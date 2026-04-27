// hooks/useMapInteraction.ts
import { useEffect, useRef } from 'react'
import panzoom from 'panzoom'

export function useMapInteraction() {
  const mapRef = useRef<SVGGElement>(null)
  const instanceRef = useRef<ReturnType<typeof panzoom> | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    instanceRef.current = panzoom(mapRef.current, {
      maxZoom: 4,
      minZoom: 0.5,
      boundsPadding: 0.1,
      smoothScroll: true,
      beforeMouseDown: (e) => {
        const target = e.target as HTMLElement
        return target.closest('[data-court]') !== null
      },
    })

    return () => instanceRef.current?.dispose()
  }, [])

  const zoomIn = () => instanceRef.current?.smoothZoom(0, 0, 1.5)
  const zoomOut = () => instanceRef.current?.smoothZoom(0, 0, 0.7)
  const reset = () => instanceRef.current?.moveTo(0, 0) // reset pan
  
  return { mapRef, zoomIn, zoomOut, reset }
}