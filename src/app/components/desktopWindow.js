"use client";

import { Minus, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

const MIN_WIDTH = 280;
const MIN_HEIGHT = 180;

const HOVER = {
    sky: "hover:bg-sky",
    rose: "hover:bg-rose",
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function TitleButton({ label, title, hover = "sky", pressed, onClick, children }) {
    return (
        <button
            type="button"
            aria-label={label}
            aria-pressed={pressed}
            title={title}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center text-white/80 transition-colors duration-100 hover:text-black ${HOVER[hover]}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

/**
 * Ett fönster på "skrivbordet". Äger sin egen dra/storleksändra-logik och
 * klampar sig själv inom containerRef. När `compact` (smal skärm) eller
 * `fullscreen` är satt fyller fönstret hela skrivbordsytan istället.
 *
 * Utan dragen position placeras fönstret av `placement` (Tailwind-klasser);
 * första draget gör om den placeringen till pixelkoordinater.
 */
export default function DesktopWindow({
    title,
    containerRef,
    compact = false,
    fullscreen = false,
    resizable = false,
    isMinimized = false,
    zIndex,
    onFocus,
    onMinimize,
    onClose,
    actions,
    placement = "left-4 top-4",
    className = "",
    bodyClassName = "overflow-auto",
    children,
}) {
    const titleId = useId();
    const windowRef = useRef(null);
    const dragRef = useRef(null);
    const resizeRef = useRef(null);
    const [position, setPosition] = useState(null);
    const [size, setSize] = useState(null);

    const maximized = compact || fullscreen;

    useEffect(() => {
        const workspace = containerRef.current;
        const element = windowRef.current;
        if (maximized || !workspace || !element) return;

        const keepInside = () => {
            const bounds = workspace.getBoundingClientRect();
            setPosition((current) => current && {
                x: clamp(current.x, 0, Math.max(0, bounds.width - element.offsetWidth)),
                y: clamp(current.y, 0, Math.max(0, bounds.height - element.offsetHeight)),
            });
        };
        const observer = new ResizeObserver(keepInside);
        observer.observe(workspace);
        return () => observer.disconnect();
    }, [containerRef, maximized]);

    const handleDragStart = (event) => {
        onFocus?.();
        if (maximized || event.target.closest("button")) return;

        const workspace = containerRef.current;
        const element = windowRef.current;
        if (!workspace || !element) return;

        const workspaceBounds = workspace.getBoundingClientRect();
        const windowBounds = element.getBoundingClientRect();
        dragRef.current = {
            pointerId: event.pointerId,
            offsetX: event.clientX - windowBounds.left,
            offsetY: event.clientY - windowBounds.top,
            workspaceLeft: workspaceBounds.left,
            workspaceTop: workspaceBounds.top,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handleDrag = (event) => {
        const drag = dragRef.current;
        const workspace = containerRef.current;
        const element = windowRef.current;
        if (!drag || drag.pointerId !== event.pointerId || !workspace || !element) return;

        const bounds = workspace.getBoundingClientRect();
        setPosition({
            x: clamp(event.clientX - drag.workspaceLeft - drag.offsetX, 0, Math.max(0, bounds.width - element.offsetWidth)),
            y: clamp(event.clientY - drag.workspaceTop - drag.offsetY, 0, Math.max(0, bounds.height - element.offsetHeight)),
        });
    };

    const handleDragEnd = () => {
        dragRef.current = null;
    };

    const handleResizeStart = (event) => {
        event.stopPropagation();
        const workspace = containerRef.current;
        const element = windowRef.current;
        if (!workspace || !element) return;

        const workspaceBounds = workspace.getBoundingClientRect();
        const windowBounds = element.getBoundingClientRect();
        resizeRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            startWidth: element.offsetWidth,
            startHeight: element.offsetHeight,
            maxWidth: workspaceBounds.right - windowBounds.left,
            maxHeight: workspaceBounds.bottom - windowBounds.top,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handleResize = (event) => {
        const resize = resizeRef.current;
        if (!resize || resize.pointerId !== event.pointerId) return;

        setSize({
            width: clamp(resize.startWidth + event.clientX - resize.startX, MIN_WIDTH, Math.max(MIN_WIDTH, resize.maxWidth)),
            height: clamp(resize.startHeight + event.clientY - resize.startY, MIN_HEIGHT, Math.max(MIN_HEIGHT, resize.maxHeight)),
        });
    };

    const handleResizeEnd = () => {
        resizeRef.current = null;
    };

    // @max-[40rem] gör att smala skrivbord visas rätt redan före hydrering (jfr COMPACT_BELOW i about.js)
    const frame = maximized
        ? "inset-0 h-full w-full"
        : `max-h-[calc(100%-2rem)] max-w-[calc(100%-2rem)] @max-[40rem]:inset-0 @max-[40rem]:h-full @max-[40rem]:max-h-none @max-[40rem]:w-full @max-[40rem]:max-w-none @max-[40rem]:translate-x-0 @max-[40rem]:translate-y-0 ${position ? "" : placement} ${className}`;
    const style = { zIndex };
    if (!maximized && position) {
        style.left = position.x;
        style.top = position.y;
    }
    if (!maximized && size) {
        style.width = size.width;
        style.height = size.height;
    }

    return (
        <section
            ref={windowRef}
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            inert={isMinimized}
            className={`absolute flex origin-bottom-left flex-col overflow-hidden border border-white/60 bg-midnight-dark text-white shadow-2xl transition-[opacity,scale] duration-300 ease-in-out ${isMinimized ? "pointer-events-none scale-0 opacity-0" : "scale-100 opacity-100"} ${frame}`}
            style={style}
            onPointerDownCapture={onFocus}
        >
            <div
                className={`flex h-9 shrink-0 items-center justify-between border-b border-white/40 bg-midnight-dark/95 px-3 ${maximized ? "" : "cursor-move touch-none"}`}
                onPointerDown={handleDragStart}
                onPointerMove={handleDrag}
                onPointerUp={handleDragEnd}
                onPointerCancel={handleDragEnd}
            >
                <span id={titleId} className="truncate text-xs text-white/80 space-mono-bold">{title}</span>
                <div className="flex shrink-0 items-center gap-1">
                    <TitleButton label={`Minimize ${title}`} onClick={onMinimize}>
                        <Minus aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                    </TitleButton>
                    {actions}
                    <TitleButton label={`Close ${title}`} hover="rose" onClick={onClose}>
                        <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                    </TitleButton>
                </div>
            </div>

            <div className={`min-h-0 flex-1 ${bodyClassName}`}>{children}</div>

            {resizable && !maximized && (
                <button
                    type="button"
                    aria-label={`Resize ${title}`}
                    className="absolute bottom-0 right-0 h-5 w-5 cursor-se-resize touch-none text-white/60 hover:text-white"
                    onPointerDown={handleResizeStart}
                    onPointerMove={handleResize}
                    onPointerUp={handleResizeEnd}
                    onPointerCancel={handleResizeEnd}
                >
                    <span aria-hidden="true" className="absolute bottom-1 right-1 h-2 w-2 border-b border-r border-current" />
                </button>
            )}
        </section>
    );
}
