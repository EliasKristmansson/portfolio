"use client";

import { useCallback, useRef } from "react";

// Ungefärlig bredd/höjd på ikon+label — används för att inte kunna
// dra ut ikonen så den hamnar delvis utanför skrivbordsytan.
const ICON_FOOTPRINT = 96;

export default function DesktopIcon({
    id,
    icon: IconComponent,
    label,
    isSelected,
    positions,
    selectedIconIds,
    onSelect,
    onMoveSelected,
    onOpen,
    containerRef,
}) {
    const dragState = useRef(null);

    const handlePointerDown = useCallback((event) => {
        // Hindra att klicket bubblar upp till skrivbordets egen
        // "klick på tomt utrymme -> avmarkera allt"-hanterare.
        event.stopPropagation();
        if (!isSelected) onSelect(id);

        const container = containerRef.current;
        if (!container) return;
        const movingIds = isSelected ? [...selectedIconIds] : [id];
        const movingPositions = Object.fromEntries(movingIds.map((movingId) => [movingId, positions[movingId]]));
        const groupBounds = {
            left: Math.min(...Object.values(movingPositions).map(({ x }) => x)),
            top: Math.min(...Object.values(movingPositions).map(({ y }) => y)),
            right: Math.max(...Object.values(movingPositions).map(({ x }) => x + ICON_FOOTPRINT)),
            bottom: Math.max(...Object.values(movingPositions).map(({ y }) => y + ICON_FOOTPRINT)),
        };

        dragState.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            movingPositions,
            groupBounds,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    }, [id, isSelected, onSelect, positions, selectedIconIds, containerRef]);

    const handlePointerMove = useCallback((event) => {
        if (!dragState.current || dragState.current.pointerId !== event.pointerId) return;
        const container = containerRef.current;
        if (!container) return;
        const bounds = container.getBoundingClientRect();

        const offsetX = Math.max(
            -dragState.current.groupBounds.left,
            Math.min(bounds.width - dragState.current.groupBounds.right, event.clientX - dragState.current.startX),
        );
        const offsetY = Math.max(
            -dragState.current.groupBounds.top,
            Math.min(bounds.height - dragState.current.groupBounds.bottom, event.clientY - dragState.current.startY),
        );

        const nextPositions = Object.fromEntries(Object.entries(dragState.current.movingPositions).map(([movingId, position]) => [
            movingId,
            { x: position.x + offsetX, y: position.y + offsetY },
        ]));
        onMoveSelected((currentPositions) => ({ ...currentPositions, ...nextPositions }));
    }, [containerRef, onMoveSelected]);

    const handlePointerUp = useCallback(() => {
        dragState.current = null;
    }, []);

    return (
        <button
            type="button"
            data-desktop-icon={id}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDoubleClick={() => onOpen?.(id)}
            className={`absolute flex w-24 cursor-pointer select-none flex-col items-center gap-1.5 p-2 text-center outline outline-1 outline-dotted transition-colors duration-100 ${isSelected ? "bg-sky/40 outline-sky" : "outline-transparent hover:outline-rose/60"}`}
                        style={{
                            left: positions[id].x,
                            top: positions[id].y,
                            outlineOffset: "-1px",
                        }}
                    >
                        <IconComponent
                            aria-hidden="true"
                            strokeWidth={1}
                            className="pointer-events-none h-10 w-10 text-white/80"
                        />
                        <span
                            className={`pointer-events-none text-xs leading-tight text-white space-mono-bold ${isSelected ? "bg-sky/60" : ""}`}
                        >
                {label}
            </span>
        </button>
    );
}