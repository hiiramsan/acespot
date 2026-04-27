import React from "react";
import { Circle, Rect, Text } from "react-konva";
import type { RoundTable } from "../types/RoundTable";
import type { RectTable } from "../types/RectTable";
import type { Table } from "../types/Table";

const CHAIR_FILL = "#c9c2b8";
const CHAIR_STROKE = "#857f78";

export const getTableFill = (table: Table) => {
	if (table.status === "reserved") return table.type === "round" ? "#efe7dd" : "#ebe4da";
	return table.type === "round" ? "#d9e7df" : "#dbe3ee";
};

export const getTableStroke = (table: Table, isActive: boolean) => {
	if (isActive) return "#1a1816";
	return "#9e978f";
};

export const getTableAccent = (table: Table) => {
	if (table.status === "reserved") return "#d9cfc3";
	return table.type === "round" ? "#c6d7cd" : "#c7d2e1";
};

export const renderRoundChairs = (table: RoundTable) => {
	const chairRadius = 6;
	const offset = table.radius + 12;
	const count = Math.max(2, table.seats);
	const angleStep = (Math.PI * 2) / count;

	return Array.from({ length: count }).map((_, index) => {
		const angle = index * angleStep - Math.PI / 2;
		return (
			<Circle
				key={`${table.id}-chair-${index}`}
				x={Math.cos(angle) * offset}
				y={Math.sin(angle) * offset}
				radius={chairRadius}
				fill={CHAIR_FILL}
				stroke={CHAIR_STROKE}
				strokeWidth={1}
			/>
		);
	});
};

export const renderRectChairs = (table: RectTable) => {
	const chairWidth = 12;
	const chairHeight = 6;
	const topCount = Math.max(1, Math.ceil(table.seats / 2));
	const bottomCount = Math.max(1, table.seats - topCount);
	const topGap = table.width / (topCount + 1);
	const bottomGap = table.width / (bottomCount + 1);

	const topChairs = Array.from({ length: topCount }).map((_, index) => (
		<Rect
			key={`${table.id}-chair-top-${index}`}
			x={topGap * (index + 1) - chairWidth / 2}
			y={-chairHeight - 4}
			width={chairWidth}
			height={chairHeight}
			cornerRadius={2}
			fill={CHAIR_FILL}
			stroke={CHAIR_STROKE}
			strokeWidth={1}
		/>
	));

	const bottomChairs = Array.from({ length: bottomCount }).map((_, index) => (
		<Rect
			key={`${table.id}-chair-bottom-${index}`}
			x={bottomGap * (index + 1) - chairWidth / 2}
			y={table.height + 4}
			width={chairWidth}
			height={chairHeight}
			cornerRadius={2}
			fill={CHAIR_FILL}
			stroke={CHAIR_STROKE}
			strokeWidth={1}
		/>
	));

	return [...topChairs, ...bottomChairs];
};

export const renderTableId = (table: Table) => {
	if (table.type === "round") {
		return (
			<Text
				text={table.id.toUpperCase()}
				fontSize={14}
				fontStyle="bold"
				fill="#4b433b"
				x={-table.radius}
				y={-8}
				width={table.radius * 2}
				align="center"
			/>
		);
	}

	return (
		<Text
			text={table.id.toUpperCase()}
			fontSize={14}
			fontStyle="bold"
			fill="#4b433b"
			y={table.height / 2 - 8}
			width={table.width}
			align="center"
		/>
	);
};
