import React from "react";
import { Circle, Line, Rect, Text } from "react-konva";
import type { Field } from "../types/Field";

/* -------------------- VISUAL SYSTEM -------------------- */

const PADDING = 12;

const LINE_MAIN = 3;
const LINE_SUB = 1.5;

const MARKING = "rgba(255,255,255,0.9)";
const MARKING_FADE = "rgba(255,255,255,0.5)";

/* -------------------- COLORS -------------------- */

export const getFieldFill = (field: Field) => {
  if (field.type === "soccer") {
    return field.status === "reserved" ? "#6ea971" : "#7fbe7f";
  }

  if (field.type === "tennis") {
    return field.status === "reserved" ? "#6aa4c8" : "#7bb6db";
  }

  return field.status === "reserved" ? "#d1a06b" : "#e2b47a";
};

export const getFieldStroke = (field: Field, isActive: boolean) => {
  return isActive ? "#1f1b17" : "#7f766c";
};

/* -------------------- FIELD MARKINGS -------------------- */

export const renderFieldMarkings = (field: Field) => {
  const pad = PADDING;
  const w = field.width;
  const h = field.height;

  const cx = w / 2;
  const cy = h / 2;

  /* -------------------- SOCCER -------------------- */
  if (field.type === "soccer") {
    const penaltyW = w * 0.18;
    const penaltyH = h * 0.46;

    const goalW = w * 0.08;
    const goalH = h * 0.18;

    return (
      <>
        {/* Outer boundary */}
        <Rect
          x={pad}
          y={pad}
          width={w - pad * 2}
          height={h - pad * 2}
          stroke={MARKING}
          strokeWidth={LINE_MAIN}
          cornerRadius={4}
        />

        {/* Center line */}
        <Line
          points={[cx, pad, cx, h - pad]}
          stroke={MARKING}
          strokeWidth={LINE_MAIN}
        />

        {/* Center circle */}
        <Circle
          x={cx}
          y={cy}
          radius={h * 0.2}
          stroke={MARKING}
          strokeWidth={LINE_MAIN}
        />

        {/* Penalty areas */}
        <Rect
          x={pad}
          y={cy - penaltyH / 2}
          width={penaltyW}
          height={penaltyH}
          stroke={MARKING}
          strokeWidth={LINE_MAIN}
        />

        <Rect
          x={w - pad - penaltyW}
          y={cy - penaltyH / 2}
          width={penaltyW}
          height={penaltyH}
          stroke={MARKING}
          strokeWidth={LINE_MAIN}
        />

        {/* Goals */}
        <Rect
          x={pad}
          y={cy - goalH / 2}
          width={goalW}
          height={goalH}
          stroke={MARKING}
          strokeWidth={LINE_MAIN}
        />

        <Rect
          x={w - pad - goalW}
          y={cy - goalH / 2}
          width={goalW}
          height={goalH}
          stroke={MARKING}
          strokeWidth={LINE_MAIN}
        />

        {/* Penalty spots */}
        <Circle x={pad + w * 0.12} y={cy} radius={2.5} fill={MARKING} />
        <Circle x={w - pad - w * 0.12} y={cy} radius={2.5} fill={MARKING} />
      </>
    );
  }

  /* -------------------- TENNIS -------------------- */
  if (field.type === "tennis") {
    return (
      <>
        {/* Outer */}
        <Rect
          x={pad}
          y={pad}
          width={w - pad * 2}
          height={h - pad * 2}
          stroke={MARKING}
          strokeWidth={LINE_MAIN}
        />

        {/* Net */}
        <Line
          points={[pad, cy, w - pad, cy]}
          stroke={MARKING}
          strokeWidth={LINE_MAIN}
        />

        {/* Center service line */}
        <Line
          points={[cx, pad, cx, h - pad]}
          stroke={MARKING_FADE}
          strokeWidth={LINE_SUB}
        />

        {/* Service boxes */}
        <Rect
          x={w * 0.25}
          y={pad}
          width={w * 0.5}
          height={h - pad * 2}
          stroke={MARKING_FADE}
          strokeWidth={LINE_SUB}
        />
      </>
    );
  }

  /* -------------------- BASKETBALL -------------------- */
  return (
    <>
      {/* Outer */}
      <Rect
        x={pad}
        y={pad}
        width={w - pad * 2}
        height={h - pad * 2}
        stroke={MARKING}
        strokeWidth={LINE_MAIN}
      />

      {/* Center circle */}
      <Circle
        x={cx}
        y={cy}
        radius={h * 0.18}
        stroke={MARKING}
        strokeWidth={LINE_MAIN}
      />

      {/* Keys */}
      <Rect
        x={pad}
        y={h * 0.25}
        width={w * 0.2}
        height={h * 0.5}
        stroke={MARKING_FADE}
        strokeWidth={LINE_SUB}
      />

      <Rect
        x={w - pad - w * 0.2}
        y={h * 0.25}
        width={w * 0.2}
        height={h * 0.5}
        stroke={MARKING_FADE}
        strokeWidth={LINE_SUB}
      />

      {/* Hoops */}
      <Circle x={pad + 20} y={cy} radius={4} fill={MARKING} />
      <Circle x={w - pad - 20} y={cy} radius={4} fill={MARKING} />
    </>
  );
};

/* -------------------- LABEL -------------------- */

export const renderFieldLabel = (field: Field) => {
  return (
    <Text
      text={field.name}
      fontSize={14}
      fontStyle="bold"
      fill="#2e2720"
      x={PADDING}
      y={PADDING}
      width={field.width - PADDING * 2}
      align="left"
    />
  );
};