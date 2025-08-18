"use client";

import { useState } from "react";
import { User, Layers, Mail, Menu, X } from "lucide-react";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-midnight-dark  text-white p-6 border-b border-midnight-light flex h-18 items-center">
            <div className="relative inline-block cursor-pointer group">
                Elias Kristmansson
                <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-white transition-all group-hover:w-full"></span>
            </div>

            <div className="flex text-base ml-auto items-center">
                <div className="relative flex items-center">
                    {/* Sliding Panel (click-revealed) */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-10 flex items-center">
                        <div className={`overflow-hidden h-full transition-all duration-350 ease-out ${menuOpen ? "w-[240px]" : "w-0"}`}>
                            <div className="bg-midnight-dark border border-white h-full flex items-center gap-10 px-5">
                                <div title="About" className="flex-shrink-0">
                                    <User className="hover:text-gray-400 cursor-pointer" strokeWidth={1.5} />
                                </div>
                                <div title="Projects" className="flex-shrink-0">
                                    <Layers className="hover:text-gray-400 cursor-pointer" strokeWidth={1.5} />
                                </div>
                                <div title="Contact" className="flex-shrink-0">
                                    <Mail className="hover:text-gray-400 cursor-pointer" strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Button (click toggles panel) */}
                    <div
                        onClick={() => setMenuOpen(prev => !prev)}
                        className={`w-10 h-10 z-10 border-white border flex items-center justify-center cursor-pointer transition-colors
    ${menuOpen ? "bg-white text-black" : "bg-midnight-dark text-white hover:bg-white hover:text-black"}`}
                        aria-label="Toggle menu"
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setMenuOpen(prev => !prev) }}
                    >
                        {/* Menu Icon */}
                        <Menu
                            className="absolute w-5 h-5 transition-all duration-300 ease-in-out"
                            strokeWidth={1.5}
                            style={{
                                opacity: menuOpen ? 0 : 1,
                                transform: menuOpen ? "scale(0.6)" : "scale(1)",
                                pointerEvents: menuOpen ? "none" : "auto",
                            }}
                        />
                        {/* X Icon */}
                        <X
                            className="absolute w-5 h-5 transition-all duration-300 ease-in-out"
                            strokeWidth={1.5}
                            style={{
                                opacity: menuOpen ? 1 : 0,
                                transform: menuOpen ? "scale(1)" : "scale(0.6)",
                                pointerEvents: menuOpen ? "auto" : "none",
                            }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}