"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function Header() {
    const headerHeight = 72;
    const revealBuffer = 24;
    const [headerOffset, setHeaderOffset] = useState(0);
    const [profileOpen, setProfileOpen] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        const scrollContainer = headerRef.current?.closest("[data-scroll-container]");
        if (!scrollContainer) return;

        let previousScrollTop = scrollContainer.scrollTop;
        let currentOffset = 0;
        let upwardScroll = 0;

        const handleScroll = () => {
            const currentScrollTop = scrollContainer.scrollTop;
            const scrollDelta = currentScrollTop - previousScrollTop;

            if (currentScrollTop <= headerHeight) {
                currentOffset = 0;
                upwardScroll = 0;
            } else if (scrollDelta > 0) {
                upwardScroll = 0;
                currentOffset = Math.min(headerHeight, currentOffset + scrollDelta);
            } else if (scrollDelta < 0) {
                const previousUpwardScroll = upwardScroll;
                upwardScroll += Math.abs(scrollDelta);
                const previousRevealDistance = Math.max(0, previousUpwardScroll - revealBuffer);
                const currentRevealDistance = Math.max(0, upwardScroll - revealBuffer);
                currentOffset = Math.max(0, currentOffset - (currentRevealDistance - previousRevealDistance));
            }

            previousScrollTop = currentScrollTop;
            setHeaderOffset(currentOffset);
        };

        scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
        return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            ref={headerRef}
            className="sticky top-0 z-[1000] bg-midnight-dark/95 text-white p-6 border-b border-midnight-light flex h-18 items-center justify-between"
            style={{ transform: `translateY(-${headerOffset}px)` }}
        >
            <div className="relative flex items-center gap-3 cursor-pointer group">
                <div className="p-1 border-[1.5px] border-white/60">
                    <img
                        src="/images/outlinewhitethin.svg"
                        alt="Elias Kristmansson logo"
                        className="h-8 w-8 object-contain shrink-0"
                    />
                </div>
                <div className="relative inline-block">
                    Elias Kristmansson
                    <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-white transition-all group-hover:w-full"></span>
                </div>
            </div>
            <div className="relative">
                <button
                    type="button"
                    aria-label={profileOpen ? "Close profile photo" : "Open profile photo"}
                    aria-expanded={profileOpen}
                    aria-controls="header-profile-photo"
                    onClick={() => setProfileOpen((open) => !open)}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center border border-white/60 text-white/80 transition-colors hover:bg-white hover:text-black"
                >
                    <ChevronDown
                        aria-hidden="true"
                        className={`h-5 w-5 ${profileOpen ? "rotate-180" : "rotate-0"}`}
                        strokeWidth={1.5}
                    />
                </button>
                <div
                    id="header-profile-photo"
                    hidden={!profileOpen}
                    aria-hidden={!profileOpen}
                    className="absolute right-0 top-full z-20 w-48 overflow-hidden border border-white/60 bg-midnight-dark shadow-2xl"
                >
                    <div className="flex h-7 items-center justify-between                     border-b border-white/40 bg-midnight-dark/95 px-3">
                        <span className="space-mono-bold text-[11px] tracking-wide text-white/80">thats_me.png</span>
                        <div aria-hidden="true" className="flex gap-1.5">
                            <span className="h-2.5 w-2.5                             border border-rose" />
                                                        <span className="h-2.5 w-2.5 border border-sky" />
                                                        <span className="h-2.5 w-2.5 border border-white/40" />
                        </div>
                    </div>
                    <div className="relative aspect-square w-full bg-midnight-dark">
                        <Image
                            src="/images/headshot2.png"
                            alt="Portrait of Elias Kristmansson"
                            className="object-cover"
                            sizes="192px"
                            priority
                            fill
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}