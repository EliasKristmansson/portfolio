import { useState, useRef } from "react";
import { createPortal } from "react-dom";

export default function TechIcon({ iconClass, name, description, link, setCarouselPaused }) {
    const [hovered, setHovered] = useState(false);
    const [tooltipHovered, setTooltipHovered] = useState(false);
    const [bufferHovered, setBufferHovered] = useState(false);
    const iconRef = useRef(null);

    const [tooltipPos, setTooltipPos] = useState({ left: 0, top: 0 });

    const showTooltip = hovered || tooltipHovered || bufferHovered;

    const handleMouseEnter = () => {
        setHovered(true);
        setCarouselPaused?.(true);
        if (iconRef.current) {
            const rect = iconRef.current.getBoundingClientRect();
            setTooltipPos({
                left: rect.left + rect.width / 2,
                top: rect.top,
                width: rect.width,
                height: rect.height,
            });
        }
    };

    const handleMouseLeave = () => {
        setHovered(false);
        setCarouselPaused?.(false);
    };

    // Tooltip element (always rendered, opacity toggled)
    const tooltip = createPortal(
        <>
            {/* Invisible buffer area */}
            <div
                className="fixed"
                style={{
                    left: tooltipPos.left - (tooltipPos.width || 0) / 2,
                    top: tooltipPos.top - 20,
                    width: tooltipPos.width || 0,
                    height: 24, // Height of the buffer area (adjust as needed)
                    zIndex: 9998,
                    pointerEvents: "auto",
                }}
                onMouseEnter={() => {
                    setBufferHovered(true);
                    setCarouselPaused?.(true);
                }}
                onMouseLeave={() => {
                    setBufferHovered(false);
                    setCarouselPaused?.(false);
                }}
            />
            {/* Tooltip */}
            <div
                className={`p-3 fixed w-48
                    bg-midnight-light text-gray-400
                    rounded-lg border border-white
                    transition-opacity duration-200 ease-in-out
                    z-[9999]
                    overflow-visible
                    ${showTooltip ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                `}
                style={{
                    left: tooltipPos.left,
                    top: tooltipPos.top - 20,
                    transform: "translate(-50%, -100%)",
                }}
                onMouseEnter={() => {
                    setTooltipHovered(true);
                    setCarouselPaused?.(true);
                }}
                onMouseLeave={() => {
                    setTooltipHovered(false);
                    setCarouselPaused?.(false);
                }}
            >
                {/* Subtle gradient glow */}
                <div className="absolute -inset-2 rounded-lg bg-gradient-to-tr from-[#25b4f0]/40 to-[#e48098]/40 blur-md opacity-30 pointer-events-none z-0"></div>
                <div className="relative z-10">
                    <p className="font-bold">{name}</p>
                    <p className="text-sm mt-1">{description}</p>
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-block mt-2 font-semibold text-sky-400 transition-colors duration-200
                                   hover:text-pink-400 relative"
                    >
                        Learn more
                        <span
                            className="absolute left-0 -bottom-0.5 h-0.5 w-full bg-gradient-to-r from-sky-400 to-pink-400
                                       opacity-60 rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
                            aria-hidden="true"
                        ></span>
                    </a>
                </div>
            </div>
        </>,
        document.body
    );

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={iconRef}
        >
            <i className={`${iconClass} text-white text-9xl cursor-pointer z-0`}></i>
            {tooltip}
        </div>
    );
}