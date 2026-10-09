"use client";

import { ArrowUp, Github, Mail, MapPin } from "lucide-react";
import { CONTACT_EMAIL, GITHUB_URL, LOCATION } from "../data/profile.js";

const TOOLS = ["Next.js", "React", "Tailwind CSS", "Three.js", "GLSL Shaders", "Lucide Icons", "Space Grotesk", "Space Mono"];

const linkClass =
    "group relative inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white space-mono-regular";

function Underline() {
    return <span aria-hidden="true" className="absolute left-0 -bottom-1 h-[1px] w-0 bg-white transition-all group-hover:w-full" />;
}

export default function Footer() {
    const scrollToTop = (event) => {
        const scroller = event.currentTarget.closest("[data-scroll-container]") ?? window;
        scroller.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="relative border-t border-white/20 bg-midnight-dark/95 px-6 py-16 text-white md:px-20">
            <div className="mx-auto flex max-w-6xl flex-col gap-12">
                <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                        <span className="text-xs tracking-widest text-white/60 space-mono-regular">BUILT WITH</span>
                        <ul className="flex flex-wrap mt-2 gap-2">
                            {TOOLS.map((tool) => (
                                <li key={tool} className="border border-white/20 px-3 py-1 text-xs text-white/80 space-mono-regular">
                                    {tool}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <nav aria-label="Footer" className="flex flex-col gap-4">
                        <p className="inline-flex items-center gap-2 text-sm text-white/80 space-mono-regular">
                            <MapPin aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                            {LOCATION}
                        </p>
                        <a className={linkClass} href={`mailto:${CONTACT_EMAIL}`}>
                            <Mail aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                            {CONTACT_EMAIL}
                            <Underline />
                        </a>
                        <a className={linkClass} href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                            <Github aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                            GitHub
                            <Underline />
                        </a>
                    </nav>
                </div>
                <div className="flex flex-col gap-4 border-t border-white/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-white/60 space-mono-regular">
                        &copy; {new Date().getFullYear()} Elias Kristmansson
                    </p>
                    <button
                        type="button"
                        onClick={scrollToTop}
                        className="inline-flex w-fit cursor-pointer items-center gap-2 border border-white/40 px-4 py-2 text-xs text-white transition-colors hover:bg-white hover:text-black space-mono-bold"
                    >
                        <ArrowUp aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                        Back to top
                    </button>
                </div>
            </div>
        </footer>
    );
}

