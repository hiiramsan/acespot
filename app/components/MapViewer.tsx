"use client";
import React, { useEffect, useState, useRef } from "react";
import { Stage, Layer, Rect, Line, Group } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type Konva from "konva";
import { SPORT_CENTER_LAYOUT } from "../data/sportCenterData";
import { Field } from "../types/Field";
import { getFieldFill, getFieldStroke, renderFieldLabel, renderFieldMarkings } from "../utils/fieldRenderUtils";

type TooltipState = {
  x: number;
  y: number;
  field: Field;
} | null;

export default function MapViewer() {
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const stageRef = useRef<Konva.Stage>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setIsMounted(true);
    const updateSize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!isMounted || containerSize.width === 0) return null;

  const { perimeters, fields } = SPORT_CENTER_LAYOUT;

  // Calculate canvas dimensions from perimeter points
  const allPoints = perimeters.flatMap(p => p.points);
  const xCoords = allPoints.filter((_, i) => i % 2 === 0);
  const yCoords = allPoints.filter((_, i) => i % 2 === 1);
  const canvasWidth = Math.max(...xCoords) || containerSize.width;
  const canvasHeight = Math.max(...yCoords) || containerSize.height;

  const isActiveField = (field: Field) => {
    return field.id === hoveredFieldId;
  };

  const setTooltipFromEvent = (event: KonvaEventObject<MouseEvent>, field: Field) => {
    const stage = event.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;
    setTooltip({ x: pointer.x, y: pointer.y, field });
  };

  const handleFieldEnter = (event: KonvaEventObject<MouseEvent>, field: Field) => {
    setHoveredFieldId(field.id);
    setTooltipFromEvent(event, field);
    const stage = event.target.getStage();
    if (stage) stage.container().style.cursor = "pointer";
  };

  const handleFieldMove = (event: KonvaEventObject<MouseEvent>, field: Field) => {
    if (hoveredFieldId === field.id) setTooltipFromEvent(event, field);
  };

  const handleFieldLeave = (event: KonvaEventObject<MouseEvent>) => {
    setHoveredFieldId(null);
    setTooltip(null);
    const stage = event.target.getStage();
    if (stage) stage.container().style.cursor = "default";
  };

  const handleStageMouseDown = (event: KonvaEventObject<MouseEvent>) => {
    if (zoom === 1) return; // Only allow dragging when zoomed in
    
    const stage = event.target.getStage();
    if (!stage) return;
    
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    
    setIsDragging(true);
    setDragStart({ x: pointer.x - position.x, y: pointer.y - position.y });
    if (stage) stage.container().style.cursor = "grab";
  };

  const handleStageMouseMove = (event: KonvaEventObject<MouseEvent>) => {
    if (!isDragging || zoom === 1) return;
    
    const stage = event.target.getStage();
    if (!stage) return;
    
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const newPos = {
      x: pointer.x - dragStart.x,
      y: pointer.y - dragStart.y,
    };

    // Limit panning to canvas bounds
    const maxX = containerSize.width / 2;
    const maxY = containerSize.height / 2;
    const minX = (containerSize.width / 2) - (canvasWidth * zoom);
    const minY = (containerSize.height / 2) - (canvasHeight * zoom);

    setPosition({
      x: Math.min(maxX, Math.max(minX, newPos.x)),
      y: Math.min(maxY, Math.max(minY, newPos.y)),
    });
  };

  const handleStageMouseUp = () => {
    setIsDragging(false);
    if (stageRef.current) {
      stageRef.current.container().style.cursor = zoom === 1 ? "default" : "grab";
    }
  };

  const handleZoom = (direction: "in" | "out") => {
    const newZoom = direction === "in" ? zoom * 1.2 : zoom / 1.2;
    setZoom(Math.max(0.5, Math.min(newZoom, 4)));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f4f1ea]">
      {/* Zoom Controls */}
      <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-2">
        <button
          onClick={() => handleZoom("in")}
          className="bg-black text-lime-400 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg hover:bg-lime-400 hover:text-black transition-all shadow-lg"
        >
          +
        </button>
        <button
          onClick={handleResetZoom}
          className="bg-black text-lime-400 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs hover:bg-lime-400 hover:text-black transition-all shadow-lg"
        >
          Reset
        </button>
        <button
          onClick={() => handleZoom("out")}
          className="bg-black text-lime-400 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg hover:bg-lime-400 hover:text-black transition-all shadow-lg"
        >
          −
        </button>
      </div>

      {/* Canvas - No visible container, seamless integration */}
      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        scale={{ x: zoom, y: zoom }}
        position={position}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onMouseLeave={handleStageMouseUp}
      >
        {/* Transparent background layer - Page background shows through */}
        <Layer>
          <Rect 
            width={canvasWidth} 
            height={canvasHeight} 
            fill="rgba(0,0,0,0)" 
          />
        </Layer>

        {/* Perimeter/zones layer */}
        <Layer>
          {perimeters.map((perimeter) => (
            <Line
              key={perimeter.id}
              points={perimeter.points}
              stroke="transparent"
              strokeWidth={0}
              closed
            />
          ))}
        </Layer>

        {/* Fields layer */}
        <Layer>
          {fields.map((field) => (
            <Group
              key={field.id}
              x={field.x}
              y={field.y}
              onMouseEnter={(event) => handleFieldEnter(event, field)}
              onMouseMove={(event) => handleFieldMove(event, field)}
              onMouseLeave={handleFieldLeave}
            >
              <Rect
                width={field.width}
                height={field.height}
                fill={getFieldFill(field)}
                stroke={getFieldStroke(field, isActiveField(field))}
                strokeWidth={2}
                cornerRadius={10}
                shadowColor="#1c1a18"
                shadowBlur={8}
                shadowOpacity={0.08}
                shadowOffset={{ x: 0, y: 3 }}
              />
              {renderFieldMarkings(field)}
              {renderFieldLabel(field)}
            </Group>
          ))}
        </Layer>
      </Stage>

      {/* Tooltip */}
      {tooltip ? (
        <div
          className="fixed z-10 min-w-48 rounded-md border border-zinc-200 bg-white/95 px-3 py-2 text-xs text-zinc-700 shadow-md pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
        >
          <div className="font-semibold text-zinc-900">{tooltip.field.name}</div>
          <div className="mt-1 flex items-center justify-between gap-4">
            <span>Type</span>
            <span className="font-medium text-zinc-900">{tooltip.field.type}</span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-4">
            <span>Status</span>
            <span className="font-medium text-zinc-900">{tooltip.field.status}</span>
          </div>
          {tooltip.field.type === "tennis" && tooltip.field.match ? (
            <div className="mt-1 text-zinc-700">
              <div className="flex items-center justify-between gap-4">
                <span>Match</span>
                <span className="font-medium text-zinc-900">
                  {tooltip.field.match.players[0]} vs {tooltip.field.match.players[1]}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Start</span>
                <span className="font-medium text-zinc-900">{tooltip.field.match.startTime}</span>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}