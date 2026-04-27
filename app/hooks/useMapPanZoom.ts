'use client'

import { useRef, useEffect, useCallback } from 'react'

interface PanZoomState {
  scale: number
  tx: number
  ty: number
}

interface PanState {
  active: boolean
  startX: number
  startY: number
  startTx: number
  startTy: number
  panning: boolean
}

const MIN_SCALE = 0.4
const MAX_SCALE = 4
const ZOOM_FACTOR = 1.2
const PAN_DEADZONE = 3 // Require 3px movement before starting pan

export function useMapPanZoom() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const state = useRef<PanZoomState>({ scale: 1, tx: 0, ty: 0 })
  const pan = useRef<PanState>({ active: false, startX: 0, startY: 0, startTx: 0, startTy: 0, panning: false })
  const lastWasPan = useRef(false)

  const applyTransform = useCallback((animate = false) => {
    const el = canvasRef.current
    if (!el) return
    const { scale, tx, ty } = state.current
    el.style.transition = animate ? 'transform 0.2s ease' : 'none'
    el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`
    if (animate) {
      const tid = setTimeout(() => { el.style.transition = 'none' }, 220)
      return () => clearTimeout(tid)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const area = canvas?.parentElement
    if (!area || !canvas) return

    // ── Wheel zoom ─────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = area.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const s = state.current
      const delta = e.deltaY < 0 ? 1.05 : 0.95
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s.scale * delta))
      s.tx = mx - (mx - s.tx) * (newScale / s.scale)
      s.ty = my - (my - s.ty) * (newScale / s.scale)
      s.scale = newScale
      applyTransform()
    }

    // ── Mouse pan ──────────────────────────────────────────
    const onMouseDown = (e: MouseEvent) => {
      // Don't start panning if clicking on the sidebar or its contents
      const target = e.target as Element
      if (target.closest('[data-sidebar]')) return
      
      pan.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        startTx: state.current.tx,
        startTy: state.current.ty,
        panning: false,
      }
      area.style.cursor = 'grabbing'
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!pan.current.active) return
      const dx = e.clientX - pan.current.startX
      const dy = e.clientY - pan.current.startY
      const distance = Math.hypot(dx, dy)
      
      // Only start panning if movement exceeds deadzone
      if (!pan.current.panning && distance > PAN_DEADZONE) {
        pan.current.panning = true
      }
      
      if (pan.current.panning) {
        state.current.tx = pan.current.startTx + dx
        state.current.ty = pan.current.startTy + dy
        applyTransform()
      }
    }
    const onMouseUp = () => {
      lastWasPan.current = pan.current.panning
      pan.current.active = false
      pan.current.panning = false
      area.style.cursor = 'grab'
    }

    // ── Touch pan + pinch ─────────────────────────────────
    let lastTouchDist = 0
    const getTouchDist = (t: TouchList) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) lastTouchDist = getTouchDist(e.touches)
      else if (e.touches.length === 1) {
        // Don't start panning if touching on the sidebar or its contents
        const target = e.target as Element
        if (target.closest('[data-sidebar]')) return
        
        pan.current = {
          active: true,
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          startTx: state.current.tx,
          startTy: state.current.ty,
          panning: false,
        }
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches.length === 2) {
        const dist = getTouchDist(e.touches)
        const rect = area.getBoundingClientRect()
        const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left
        const my = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top
        const s = state.current
        const delta = dist / lastTouchDist
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s.scale * delta))
        s.tx = mx - (mx - s.tx) * (newScale / s.scale)
        s.ty = my - (my - s.ty) * (newScale / s.scale)
        s.scale = newScale
        lastTouchDist = dist
        applyTransform()
      } else if (e.touches.length === 1 && pan.current.active) {
        const dx = e.touches[0].clientX - pan.current.startX
        const dy = e.touches[0].clientY - pan.current.startY
        const distance = Math.hypot(dx, dy)
        
        if (!pan.current.panning && distance > PAN_DEADZONE) {
          pan.current.panning = true
        }
        
        if (pan.current.panning) {
          state.current.tx = pan.current.startTx + dx
          state.current.ty = pan.current.startTy + dy
          applyTransform()
        }
      }
    }
    const onTouchEnd = () => { 
      lastWasPan.current = pan.current.panning
      pan.current.active = false
      pan.current.panning = false
    }

    area.addEventListener('wheel', onWheel, { passive: false })
    area.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    area.addEventListener('touchstart', onTouchStart, { passive: false })
    area.addEventListener('touchmove', onTouchMove, { passive: false })
    area.addEventListener('touchend', onTouchEnd)

    return () => {
      area.removeEventListener('wheel', onWheel)
      area.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      area.removeEventListener('touchstart', onTouchStart)
      area.removeEventListener('touchmove', onTouchMove)
      area.removeEventListener('touchend', onTouchEnd)
    }
  }, [applyTransform])

  const zoomTo = useCallback((factor: number) => {
    const area = canvasRef.current?.parentElement
    if (!area) return
    const cx = area.clientWidth / 2
    const cy = area.clientHeight / 2
    const s = state.current
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s.scale * factor))
    s.tx = cx - (cx - s.tx) * (newScale / s.scale)
    s.ty = cy - (cy - s.ty) * (newScale / s.scale)
    s.scale = newScale
    applyTransform(true)
  }, [applyTransform])

  const centerMap = useCallback(() => {
    const area = canvasRef.current?.parentElement
    if (!area) return
    
    const MAP_WIDTH = 1100
    const MAP_HEIGHT = 720
    const containerWidth = area.clientWidth
    const containerHeight = area.clientHeight
    
    // Calculate center position: center the map in the container
    // Shift left by reducing tx (move it to the left considerably)
    const tx = (containerWidth - MAP_WIDTH) / 2 - 150
    const ty = (containerHeight - MAP_HEIGHT) / 2
    
    state.current = { scale: 1, tx, ty }
    applyTransform(true)
  }, [applyTransform])

  // Get whether the last interaction was a pan (used to suppress court clicks on drag)
  const wasLastInteractionPan = () => lastWasPan.current

  // Reset pan flag after checking (useful for court click handlers)
  const resetPanFlag = () => {
    lastWasPan.current = false
  }

  // Center the map on initial mount and on window resize
  useEffect(() => {
    const handleResize = () => {
      centerMap()
    }

    // Center on mount
    const timer = setTimeout(() => centerMap(), 0)
    
    // Center on resize
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [centerMap])

  const reset = useCallback(() => {
    centerMap()
  }, [centerMap])

  return {
    canvasRef,
    zoomIn: () => zoomTo(ZOOM_FACTOR),
    zoomOut: () => zoomTo(1 / ZOOM_FACTOR),
    reset,
    wasLastInteractionPan,
    resetPanFlag,
  }
}