"use client";
import { ArrowDown } from "lucide-react";
import TechCarousel from "./techCarousel";


export default function Main() {
    return (
        <main
            className="text-white relative"
            style={{
                height: "calc(100vh - 72px)",
            }}
        >
            <div className="p-20 w-full h-full">
                {/* Main Content */}
                <div>
                    <div
                        className="text-9xl space-mono-bold"
                        style={{ textShadow: "0 0 50px rgba(0, 0, 0, 1)" }}
                    >
                        <span className="text-sky">Designer</span>
                        +
                        <span className="text-rose">Developer</span>
                    </div>

                    <div className="text-7xl mt-8">
                        specializing in{" "}
                        <div className="relative inline-block group">
                            <span className="relative inline-block text-white transition-all duration-700 ease-in-out group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky cursor-default group-hover:via-rose group-hover:to-amber group-hover:bg-[length:200%_100%] group-hover:animate-gradient-slide">
                                Interaction
                            </span>
                            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all group-hover:w-full duration-300"></span>
                        </div>{" "}
                        Design
                    </div>

                    {/* Tagline */}
                    <div className="inline-block">
                        <div className="mt-10 mb-8 h-[1.5px] bg-white/40" />
                            <p className="space-grotesk text-2xl leading-snug text-white tracking-wide">
                            <span className="relative z-10">
                                "Designing and building
                                <span className="text-white font-medium"> interesting</span>,
                                <span className="text-white font-medium"> intuitive</span>, and
                                <span className="text-white font-medium"> engaging</span> user interfaces for the future."
                            </span>
                        </p>
                    </div>
                </div>

                {/*<TechCarousel />*/}

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
