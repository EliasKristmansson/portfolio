"use client";

import { ArrowDown, Blocks, FileText, Folder, Minus, ScrollText, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DesktopIcon from "./desktopIcon.js";
import { logos } from "./techCarousel.js";

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
    const [aboutWindowOpen, setAboutWindowOpen] = useState(true);
    const [aboutWindowMinimized, setAboutWindowMinimized] = useState(false);
    const [aboutWindowPosition, setAboutWindowPosition] = useState({ x: 180, y: 72 });
    const [aboutWindowSize, setAboutWindowSize] = useState({ width: 544, height: 300 });
    const windowDragRef = useRef(null);
    const windowResizeRef = useRef(null);
    const aboutWindowRef = useRef(null);
    const [expertiseWindowOpen, setExpertiseWindowOpen] = useState(false);
    const [expertiseWindowMinimized, setExpertiseWindowMinimized] = useState(false);
    const [expertiseWindowPosition, setExpertiseWindowPosition] = useState({ x: 220, y: 80 });
    const expertiseWindowDragRef = useRef(null);
    const expertiseWindowRef = useRef(null);

    const desktopIcons = [
        { id: "filetext", icon: FileText, label: "About Me.txt", initialPosition: { x: 24, y: 24 } },
        { id: "expertise", icon: Blocks, label: "Expertise", initialPosition: { x: 24, y: 372 } },
        { id: "folder", icon: Folder, label: "Projects", initialPosition: { x: 24, y: 140 } },
        { id: "scrolltext", icon: ScrollText, label: "CV.pdf", initialPosition: { x: 24, y: 256 } },
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

    const handleWindowDragStart = (event) => {
        if (event.target.closest("button")) return;

        const workspace = selectionAreaRef.current;
        if (!workspace) return;
        const bounds = workspace.getBoundingClientRect();
        windowDragRef.current = {
            pointerId: event.pointerId,
            offsetX: event.clientX - bounds.left - aboutWindowPosition.x,
            offsetY: event.clientY - bounds.top - aboutWindowPosition.y,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handleWindowDrag = (event) => {
        if (!windowDragRef.current || windowDragRef.current.pointerId !== event.pointerId) return;

        const workspace = selectionAreaRef.current;
        const windowElement = aboutWindowRef.current;
        if (!workspace) return;
        const bounds = workspace.getBoundingClientRect();
        const nextX = event.clientX - bounds.left - windowDragRef.current.offsetX;
        const nextY = event.clientY - bounds.top - windowDragRef.current.offsetY;
        setAboutWindowPosition({
            x: Math.max(0, Math.min(bounds.width - windowElement.offsetWidth, nextX)),
            y: Math.max(0, Math.min(bounds.height - windowElement.offsetHeight, nextY)),
        });
    };

    const handleWindowDragEnd = () => {
        windowDragRef.current = null;
    };

    const handleWindowResizeStart = (event) => {
        event.stopPropagation();
        const windowElement = aboutWindowRef.current;
        if (!windowElement) return;

        windowResizeRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            startWidth: windowElement.offsetWidth,
            startHeight: windowElement.offsetHeight,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handleWindowResize = (event) => {
        const resizeState = windowResizeRef.current;
        const workspace = selectionAreaRef.current;
        if (!resizeState || resizeState.pointerId !== event.pointerId || !workspace) return;

        const workspaceBounds = workspace.getBoundingClientRect();
        const minimumWidth = 280;
        const minimumHeight = 180;
        setAboutWindowSize({
            width: Math.max(
                minimumWidth,
                Math.min(resizeState.startWidth + event.clientX - resizeState.startX, workspaceBounds.right - workspaceBounds.left - aboutWindowPosition.x),
            ),
            height: Math.max(
                minimumHeight,
                Math.min(resizeState.startHeight + event.clientY - resizeState.startY, workspaceBounds.bottom - workspaceBounds.top - aboutWindowPosition.y),
            ),
        });
    };

    const handleWindowResizeEnd = () => {
        windowResizeRef.current = null;
    };

    const openAboutWindow = () => {
        setAboutWindowOpen(true);
        setAboutWindowMinimized(false);
    };

    const openExpertiseWindow = () => {
        setExpertiseWindowOpen(true);
        setExpertiseWindowMinimized(false);
    };

    const handleExpertiseWindowDragStart = (event) => {
        if (event.target.closest("button")) return;

        const workspace = selectionAreaRef.current;
        if (!workspace) return;
        const bounds = workspace.getBoundingClientRect();
        expertiseWindowDragRef.current = {
            pointerId: event.pointerId,
            offsetX: event.clientX - bounds.left - expertiseWindowPosition.x,
            offsetY: event.clientY - bounds.top - expertiseWindowPosition.y,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handleExpertiseWindowDrag = (event) => {
        if (!expertiseWindowDragRef.current || expertiseWindowDragRef.current.pointerId !== event.pointerId) return;

        const workspace = selectionAreaRef.current;
        const windowElement = expertiseWindowRef.current;
        if (!workspace || !windowElement) return;
        const bounds = workspace.getBoundingClientRect();
        const nextX = event.clientX - bounds.left - expertiseWindowDragRef.current.offsetX;
        const nextY = event.clientY - bounds.top - expertiseWindowDragRef.current.offsetY;
        setExpertiseWindowPosition({
            x: Math.max(0, Math.min(bounds.width - windowElement.offsetWidth, nextX)),
            y: Math.max(0, Math.min(bounds.height - windowElement.offsetHeight, nextY)),
        });
    };

    const handleExpertiseWindowDragEnd = () => {
        expertiseWindowDragRef.current = null;
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
                    <div className="flex h-7 flex-shrink-0 items-center justify-between border-b border-midnight-light bg-midnight-dark/80 px-3">
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
                        {aboutWindowOpen && (
                            <section
                                ref={aboutWindowRef}
                                aria-label="About information window"
                                className={`absolute z-20 w-[min(34rem,calc(100%-2rem))] origin-bottom-left border border-white/70 bg-midnight-dark text-white shadow-2xl transition-[opacity,transform] duration-300 ease-in-out ${aboutWindowMinimized ? "pointer-events-none scale-0 opacity-0" : "scale-100 opacity-100"}`}
                                style={{ left: aboutWindowPosition.x, top: aboutWindowPosition.y, width: aboutWindowSize.width, height: aboutWindowSize.height }}
                            >
                                <div
                                    className="flex h-9 cursor-move items-center justify-between border-b border-white/50 bg-midnight-dark/95 px-3"
                                    onPointerDown={handleWindowDragStart}
                                    onPointerMove={handleWindowDrag}
                                    onPointerUp={handleWindowDragEnd}
                                    onPointerCancel={handleWindowDragEnd}
                                >
                                    <span className="text-xs text-white/80 space-mono-bold">About Me.txt</span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            aria-label="Minimize About window"
                                            className="flex h-7 w-7 cursor-pointer items-center justify-center text-white/70 transition-colors duration-100 hover:bg-[#25b4f0] hover:text-black"
                                            onClick={() => setAboutWindowMinimized(true)}
                                        >
                                            <Minus aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Close About window"
                                            className="flex h-7 w-7 cursor-pointer items-center justify-center text-white/70 transition-colors duration-100 hover:bg-[#e48098] hover:text-black"
                                            onClick={() => {
                                                setAboutWindowOpen(false);
                                                setAboutWindowMinimized(false);
                                            }}
                                        >
                                            <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                                        </button>
                                    </div>
                                </div>

                                {!aboutWindowMinimized && (
                                    <div className="h-[calc(100%-2.25rem)] overflow-auto p-6 text-sm leading-relaxed text-white/80 space-grotesk">
                                        <h2 className="mb-3 text-2xl text-white space-mono-bold">About me</h2>
                                        <p>
                                            I like to call myself an interaction designer, I design and build user interfaces that are interesting to both look at and use. Much of my work is focused on creativity and using every tool at my disposal to make something that both me, and the user, are happy with. While I much prefer front-end work because of the creative freedom, I have experience with back-end development as well.
                                        </p>
                                        <br/>
                                        <p>
                                            If there was one thing I'd like to improve on in my journey it'd probably be responsiveness and accessibility in my work. I tend to prioritize innovation and creativity which makes for (in my humble opinion) beautiful designs, but it's not always optimal for accessibility.
                                        </p>
                                        <br/>
                                        <p>
                                            You can find some of the programs, frameworks, and languages I am most proficient here! :)
                                        </p>
                                    </div>
                                )}

                                {!aboutWindowMinimized && (
                                    <button
                                        type="button"
                                        aria-label="Resize About window"
                                        className="absolute bottom-0 right-0 h-5 w-5 cursor-se-resize text-white/60 hover:text-white"
                                        onPointerDown={handleWindowResizeStart}
                                        onPointerMove={handleWindowResize}
                                        onPointerUp={handleWindowResizeEnd}
                                        onPointerCancel={handleWindowResizeEnd}
                                    >
                                        <span aria-hidden="true" className="absolute bottom-1 right-1 h-2 w-2 border-b border-r border-current" />
                                    </button>
                                )}
                            </section>
                        )}

                        {expertiseWindowOpen && (
                            <section
                                ref={expertiseWindowRef}
                                aria-label="Expertise folder"
                                className={`absolute z-30 w-[min(38rem,calc(100%-2rem))] border border-white/70 bg-midnight-dark text-white shadow-2xl transition-[opacity,transform] duration-300 ease-in-out ${expertiseWindowMinimized ? "pointer-events-none scale-0 opacity-0" : "scale-100 opacity-100"}`}
                                style={{ left: expertiseWindowPosition.x, top: expertiseWindowPosition.y }}
                            >
                                <div
                                    className="flex h-9 cursor-move items-center justify-between border-b border-white/50 bg-midnight-dark/95 px-3"
                                    onPointerDown={handleExpertiseWindowDragStart}
                                    onPointerMove={handleExpertiseWindowDrag}
                                    onPointerUp={handleExpertiseWindowDragEnd}
                                    onPointerCancel={handleExpertiseWindowDragEnd}
                                >
                                    <span className="text-xs text-white/80 space-mono-bold">Expertise</span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            aria-label="Minimize Expertise folder"
                                            className="flex h-7 w-7 cursor-pointer items-center justify-center text-white/70 transition-colors duration-100 hover:bg-[#25b4f0] hover:text-black"
                                            onClick={() => setExpertiseWindowMinimized(true)}
                                        >
                                            <Minus aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Close Expertise folder"
                                            className="flex h-7 w-7 cursor-pointer items-center justify-center text-white/70 transition-colors duration-100 hover:bg-[#e48098] hover:text-black"
                                            onClick={() => {
                                                setExpertiseWindowOpen(false);
                                                setExpertiseWindowMinimized(false);
                                            }}
                                        >
                                            <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                                        </button>
                                    </div>
                                </div>

                                {!expertiseWindowMinimized && (
                                    <div className="grid max-h-[23rem] grid-cols-3 gap-3 overflow-auto p-5 sm:grid-cols-4">
                                        {logos.map((logo) => (
                                            <button
                                                key={logo.alt}
                                                type="button"
                                                title={`Open ${logo.alt} resource`}
                                                className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 border border-transparent p-2 text-center transition-colors duration-100 hover:border-[#25b4f0] hover:bg-white/10"
                                                onDoubleClick={() => window.open(logo.link, "_blank", "noopener,noreferrer")}
                                            >
                                                <i aria-hidden="true" className={`${logo.className} text-4xl text-white/80`} />
                                                <span className="text-xs text-white/80 space-mono-bold">{logo.alt}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

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
                                onClick={(id) => {
                                    if (id === "scrolltext") {
                                        window.open("/pdfs/CV%20Elias%20Kristmansson.pdf", "_blank", "noopener,noreferrer");
                                    }
                                }}
                                onOpen={(id) => {
                                    if (id === "filetext") openAboutWindow();
                                    if (id === "expertise") openExpertiseWindow();
                                }}
                                containerRef={desktopRef}
                            />
                        ))}
                    </div>

                    {/* Taskbar */}
                    <div className="flex h-10 flex-shrink-0 items-center justify-start gap-2 border-t border-white/40 bg-midnight-dark/95 px-3">
                        <button
                            type="button"
                            className="flex cursor-pointer items-center gap-2 border border-white/40 px-3 py-1 text-xs text-white transition-colors duration-100 hover:bg-white hover:text-black space-mono-bold"
                        >
                            <span className="h-2 w-2" style={{ backgroundColor: "#25b4f0" }} />
                            Start
                        </button>
                        {(aboutWindowOpen || aboutWindowMinimized) && (
                            <button
                                type="button"
                                aria-label="Open About window"
                                onClick={openAboutWindow}
                                className={`flex cursor-pointer items-center gap-2 border px-3 py-1 text-xs transition-colors duration-100 space-mono-bold ${aboutWindowOpen ? "border-white/70 bg-white/10 text-white" : "border-white/40 text-white/60 hover:bg-white hover:text-black"}`}
                            >
                                <FileText aria-hidden="true" className="h-3 w-3" strokeWidth={1.5} />
                                About Me.txt
                            </button>
                        )}
                        {(expertiseWindowOpen || expertiseWindowMinimized) && (
                            <button
                                type="button"
                                aria-label="Open Expertise folder"
                                onClick={openExpertiseWindow}
                                className={`flex cursor-pointer items-center gap-2 border px-3 py-1 text-xs transition-colors duration-100 space-mono-bold ${expertiseWindowOpen ? "border-white/70 bg-white/10 text-white" : "border-white/40 text-white/60 hover:bg-white hover:text-black"}`}
                            >
                                <Blocks aria-hidden="true" className="h-3 w-3" strokeWidth={1.5} />
                                Expertise
                            </button>
                        )}
                        {clockTime && (
                            <span className="ml-auto flex items-center gap-2 text-xs text-white/70 space-mono-bold">
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
                    className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-10 h-10 z-100 border border-white flex items-center justify-center cursor-pointer transition-colors duration-100 bg-midnight hover:bg-white hover:text-black"
                >
                    <ArrowDown strokeWidth={1.5} className="w-5 h-5 transition-all duration-100 ease-in-out" />
                </a>
            </div>
        </main>
    );
}
