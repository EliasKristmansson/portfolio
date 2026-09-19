"use client";

import { useCallback, useRef, useState } from "react";

// Ungefärlig bredd/höjd på ikon+label — används för att inte kunna
// dra ut ikonen så den hamnar delvis utanför skrivbordsytan.
const ICON_FOOTPRINT = 96;

export default function DesktopIcon({
    id,
    icon: IconComponent,
    label,
    initialPosition,
    isSelected,
    onSelect,
    onOpen,
    containerRef,
}) {
    const [position, setPosition] = useState(initialPosition);
    const dragState = useRef(null);

    const handlePointerDown = useCallback((event) => {
        // Hindra att klicket bubblar upp till skrivbordets egen
        // "klick på tomt utrymme -> avmarkera allt"-hanterare.
        event.stopPropagation();
        onSelect(id);

        const container = containerRef.current;
        if (!container) return;
        const bounds = container.getBoundingClientRect();

        dragState.current = {
            pointerId: event.pointerId,
            // avstånd mellan pekarens position och ikonens hörn vid
            // dragstart — utan detta hoppar ikonen så dess hörn hamnar
            // exakt under muspekaren, vilket känns fel
            offsetX: event.clientX - bounds.left - position.x,
            offsetY: event.clientY - bounds.top - position.y,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    }, [id, onSelect, position, containerRef]);

    const handlePointerMove = useCallback((event) => {
        if (!dragState.current || dragState.current.pointerId !== event.pointerId) return;
        const container = containerRef.current;
        if (!container) return;
        const bounds = container.getBoundingClientRect();

        const nextX = event.clientX - bounds.left - dragState.current.offsetX;
        const nextY = event.clientY - bounds.top - dragState.current.offsetY;

        setPosition({
            x: Math.max(0, Math.min(bounds.width - ICON_FOOTPRINT, nextX)),
            y: Math.max(0, Math.min(bounds.height - ICON_FOOTPRINT, nextY)),
        });
    }, [containerRef]);

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
            className="absolute flex w-24 cursor-pointer select-none flex-col items-center gap-1.5 rounded-sm p-2 text-center outline outline-1 outline-dotted outline-transparent transition-colors hover:outline-[#e48098]/70"
            style={{
                left: position.x,
                top: position.y,
                outlineOffset: "-1px",
                backgroundColor: isSelected ? "rgba(37, 180, 240, 0.35)" : undefined,
                outlineColor: isSelected ? "rgba(37, 180, 240, 0.9)" : undefined,
            }}
        >
            <IconComponent
                aria-hidden="true"
                strokeWidth={1}
                className="pointer-events-none h-10 w-10 text-white/90"
            />
            <span
                className="pointer-events-none text-xs leading-tight text-white space-mono-bold"
                style={{ backgroundColor: isSelected ? "rgba(37, 180, 240, 0.55)" : undefined }}
            >
                {label}
            </span>
        </button>
    );
}