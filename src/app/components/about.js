"use client";

import { ArrowDown, FileText, Folder, Monitor } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DesktopIcon from "./desktopIcon.js";

const hexToRgb = (hex) => {
    const value = hex.replace("#", "");
    return {
        red: parseInt(value.slice(0, 2), 16),
        green: parseInt(value.slice(2, 4), 16),
        blue: parseInt(value.slice(4, 6), 16),
    };
};

export default function About() {
    const desktopRef = useRef(null);
    const selectionAreaRef = useRef(null);
    const selectionStartRef = useRef(null);
    const [selectedIconIds, setSelectedIconIds] = useState(new Set());
    const [selectionBox, setSelectionBox] = useState(null);

    const desktopIcons = [
        { id: "monitor", icon: Monitor, label: "Om mig.exe", initialPosition: { x: 24, y: 24 } },
        { id: "folder", icon: Folder, label: "Projekt", initialPosition: { x: 24, y: 140 } },
        { id: "filetext", icon: FileText, label: "CV.pdf", initialPosition: { x: 24, y: 256 } },
    ];

    const [clockTime, setClockTime] = useState(null);

    useEffect(() => {
        const updateClock = () => {
            setClockTime(new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }));
        };
        updateClock();
        const interval = setInterval(updateClock, 1000 * 30); // en klocka behöver inte uppdateras varje sekund
        return () => clearInterval(interval);
    }, []);

    const getSelectionPoint = (event) => {
        const bounds = selectionAreaRef.current.getBoundingClientRect();
        return {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
        };
    };

    const handleSelectionStart = (event) => {
        if (event.target !== event.currentTarget) return;

        const point = getSelectionPoint(event);
        selectionStartRef.current = point;
        setSelectionBox({ left: point.x, top: point.y, width: 0, height: 0 });
        setSelectedIconIds(new Set());
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handleSelectionMove = (event) => {
        const start = selectionStartRef.current;
        if (!start) return;

        const point = getSelectionPoint(event);
        const left = Math.min(start.x, point.x);
        const top = Math.min(start.y, point.y);
        const width = Math.abs(point.x - start.x);
        const height = Math.abs(point.y - start.y);
        setSelectionBox({ left, top, width, height });

        const selectionBounds = selectionAreaRef.current.getBoundingClientRect();
        const selectedIds = new Set();
        selectionAreaRef.current.querySelectorAll("[data-desktop-icon]").forEach((icon) => {
            const iconBounds = icon.getBoundingClientRect();
            const iconLeft = iconBounds.left - selectionBounds.left;
            const iconTop = iconBounds.top - selectionBounds.top;
            const intersects = iconLeft < left + width
                && iconLeft + iconBounds.width > left
                && iconTop < top + height
                && iconTop + iconBounds.height > top;

            if (intersects) selectedIds.add(icon.dataset.desktopIcon);
        });

        setSelectedIconIds(selectedIds);
    };

    const handleSelectionEnd = () => {
        selectionStartRef.current = null;
        setSelectionBox(null);
    };

    return (
        <main
            id="about"
            className="text-white px-6 py-20 md:px-20 relative"
            style={{ minHeight: "calc(100vh)" }}
        >
            <div className="border border-white lg:min-h-[700px] grid grid-cols-1 gap-14 items-stretch">
                <div
                    ref={desktopRef}
                    className="relative flex h-full min-h-[400px] w-full flex-col overflow-hidden border border-white/40"
                    style={{
                        backgroundColor: "#0e0e0f",
                        backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                >
                    {/* Titelbar — tunn rad högst upp, hintar "fönster" utan att bli skeuomorfisk */}
                    <div className="flex h-7 flex-shrink-0 items-center justify-between border-b border-white/40 bg-midnight-dark/80 px-3">
                        <span className="text-[11px] tracking-wide text-white/50 space-mono-bold">About</span>
                        <div className="flex gap-1.5">
                            <span className="h-2.5 w-2.5 border" style={{ borderColor: "#e48098" }} />
                            <span className="h-2.5 w-2.5 border" style={{ borderColor: "#25b4f0" }} />
                            <span className="h-2.5 w-2.5 border border-white/50" />
                        </div>
                    </div>

                    {/* Ikonyta — själva "skrivbordet" */}
                    <div
                        ref={selectionAreaRef}
                        className="relative min-h-0 flex-1"
                        onPointerDown={handleSelectionStart}
                        onPointerMove={handleSelectionMove}
                        onPointerUp={handleSelectionEnd}
                        onPointerCancel={handleSelectionEnd}
                    >
                        {selectionBox && (
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute z-10 border border-[#e48098] bg-[#e48098]/25"
                                style={selectionBox}
                            />
                        )}

                        {desktopIcons.map((iconConfig) => (
                            <DesktopIcon
                                key={iconConfig.id}
                                id={iconConfig.id}
                                icon={iconConfig.icon}
                                label={iconConfig.label}
                                initialPosition={iconConfig.initialPosition}
                                isSelected={selectedIconIds.has(iconConfig.id)}
                                onSelect={(id) => setSelectedIconIds(new Set([id]))}
                                containerRef={desktopRef}
                            />
                        ))}
                    </div>

                    {/* Taskbar */}
                    <div className="flex h-10 flex-shrink-0 items-center justify-between border-t border-white/40 bg-midnight-dark/95 px-3">
                        <button
                            type="button"
                            className="flex items-center gap-2 border border-white/40 px-3 py-1 text-xs text-white transition-colors hover:bg-white hover:text-black space-mono-bold"
                        >
                            <span className="h-2 w-2" style={{ backgroundColor: "#25b4f0" }} />
                            Start
                        </button>
                        {clockTime && (
                            <span className="flex items-center gap-2 text-xs text-white/70 space-mono-bold">
                                <span className="h-1.5 w-1.5" style={{ backgroundColor: "#e48098" }} />
                                {clockTime}
                            </span>
                        )}
                    </div>
                </div>

                {/* Scroll Arrow */}
                <a
                    href="#about"
                    aria-label="Go to About section"
                    className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-10 h-10 z-100 border border-white flex items-center justify-center cursor-pointer transition-colors bg-midnight hover:bg-white hover:text-black"
                >
                    <ArrowDown strokeWidth={1.5} className="w-5 h-5 transition-all duration-300 ease-in-out" />
                </a>
            </div>
        </main>
    );
}
