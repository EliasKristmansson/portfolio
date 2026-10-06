"use client";

import { Check, Copy, Mail, Minus, X } from "lucide-react";
import { useRef, useState } from "react";

const CONTACT_EMAIL = "eliaskristmansson22@gmail.com";

export default function Contact({ containerRef, isMinimized, isOpen, onClose, onFocus, onMinimize, zIndex }) {
    const [copyStatus, setCopyStatus] = useState("idle");
    const [position, setPosition] = useState(null);
    const windowRef = useRef(null);
    const dragRef = useRef(null);

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText(CONTACT_EMAIL);
            setCopyStatus("copied");
        } catch {
            setCopyStatus("failed");
        }
    };

    const handleDragStart = (event) => {
        onFocus?.();
        if (event.target.closest("button")) return;

        const workspace = containerRef.current;
        const windowElement = windowRef.current;
        if (!workspace || !windowElement) return;

        const workspaceBounds = workspace.getBoundingClientRect();
        const windowBounds = windowElement.getBoundingClientRect();
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
        const dragState = dragRef.current;
        const workspace = containerRef.current;
        const windowElement = windowRef.current;
        if (!dragState || dragState.pointerId !== event.pointerId || !workspace || !windowElement) return;

        const bounds = workspace.getBoundingClientRect();
        const nextX = event.clientX - dragState.workspaceLeft - dragState.offsetX;
        const nextY = event.clientY - dragState.workspaceTop - dragState.offsetY;
        setPosition({
            x: Math.max(0, Math.min(bounds.width - windowElement.offsetWidth, nextX)),
            y: Math.max(0, Math.min(bounds.height - windowElement.offsetHeight, nextY)),
        });
    };

    const handleDragEnd = () => {
        dragRef.current = null;
    };

    const handleClose = () => {
        setCopyStatus("idle");
        setPosition(null);
        dragRef.current = null;
        onClose?.();
    };

    if (!isOpen) return null;

    return (
        <section
            ref={windowRef}
            aria-labelledby="contact-window-title"
            aria-modal="false"
            className={`absolute max-h-[calc(100%-2rem)] w-[min(30rem,calc(100%-2rem))] overflow-y-auto border border-white/70 bg-midnight-dark text-white shadow-2xl transition-[opacity,transform] duration-300 ease-in-out ${isMinimized ? "pointer-events-none scale-0 opacity-0" : "scale-100 opacity-100"} ${position ? "" : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}`}
            style={{ zIndex, ...(position ? { left: position.x, top: position.y } : {}) }}
            onPointerDown={(event) => event.stopPropagation()}
            role="dialog"
        >
            <div
                className="flex h-9 cursor-move items-center justify-between border-b border-white/50 bg-midnight-dark/95 px-3"
                onPointerDown={handleDragStart}
                onPointerMove={handleDrag}
                onPointerUp={handleDragEnd}
                onPointerCancel={handleDragEnd}
            >
                <h2 id="contact-window-title" className="text-xs text-white/80 space-mono-bold">Contact.exe</h2>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        aria-label="Minimize Contact window"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center text-white/70 transition-colors duration-100 hover:bg-[#0AB5FF] hover:text-black"
                        onClick={onMinimize}
                    >
                        <Minus aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                    <button
                        type="button"
                        aria-label="Close Contact window"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center text-white/70 transition-colors duration-100 hover:bg-[#FF7A9B] hover:text-black"
                        onClick={handleClose}
                    >
                        <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            <div className="space-y-5 p-5">
                <a className="group relative inline-block max-w-full break-all text-sm text-white space-grotesk" href={`mailto:${CONTACT_EMAIL}`}>
                    {CONTACT_EMAIL}
                    <span aria-hidden="true" className="absolute left-0 -bottom-1 h-[1px] w-0 bg-white transition-all group-hover:w-full" />
                </a>
                <div className="flex flex-wrap items-center gap-2 border-t border-white/15 pt-4">
                    <button
                        className="inline-flex min-h-10 cursor-pointer items-center gap-2 border border-white/40 px-4 py-2 text-xs text-white transition-colors hover:bg-white hover:text-black space-mono-bold"
                        onClick={handleCopyEmail}
                        type="button"
                    >
                        {copyStatus === "copied"
                            ? <Check aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                            : <Copy aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />}
                        {copyStatus === "copied" ? "Copied" : "Copy email"}
                    </button>
                    <a
                        className="inline-flex min-h-10 items-center gap-2 border border-white/40 px-4 py-2 text-xs text-white transition-colors hover:bg-white hover:text-black space-mono-bold"
                        href={`mailto:${CONTACT_EMAIL}`}
                    >
                        <Mail aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                        Email me
                    </a>
                    {copyStatus !== "idle" && (
                        <p aria-live="polite" className="min-h-4 text-xs text-white/55 space-mono-regular">
                            {copyStatus === "copied" ? "Copied to clipboard." : "Copy unavailable."}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
