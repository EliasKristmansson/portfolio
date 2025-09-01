"use client";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import TechCarousel from "./techCarousel";


export default function Main() {
    return (
        <main className="bg-midnight text-white p-20 relative" style={{ height: "calc(100vh - 72px)" }}>
            {/* Floating image CTA top-right */}
            <a href="#about">
                <div className="absolute top-6 right-6 group cursor-pointer">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden transition-transform duration-300 hover:scale-105">

                        {/* Subtle gradient glow */}
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#25b4f0]/40 to-[#e48098]/40 blur-md opacity-20 group-hover:opacity-40 transition-opacity z-0"></div>

                        {/* White outline ring */}
                        <div className="absolute inset-0 rounded-full border border-white z-10 pointer-events-none" />

                        {/* Image itself */}
                        <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg z-9">
                            <Image
                                src="/images/headshot2.png"
                                alt="Headshot"
                                className="object-cover w-full h-full"
                                quality={100}
                                priority
                                fill
                            />
                        </div>
                    </div>

                    {/* Caption on hover */}
                    <div className="absolute top-full w-full mt-2 text-center dm-sans opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-gray-400">
                        That's me 👋
                    </div>
                </div>
            </a>



            {/* Main Content */}
            <div>
                <div className="text-8xl space-mono-bold">  
                    {"{"}
                    <span style={{ color: "#25b4f0" }}>Designer</span>
                    {"+"}
                    <span style={{ color: "#e48098" }}>Developer</span>
                    {"}"}
                </div>

                <div className="text-6xl mt-8 ml-10">
                    specializing in{" "}
                    <div className="relative inline-block group">
                        <span className="relative inline-block text-white transition-all duration-700 ease-in-out group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-400 cursor-default group-hover:via-rose-400 group-hover:to-orange-400 group-hover:bg-[length:200%_100%] group-hover:animate-gradient-slide">
                            Interaction
                        </span>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all group-hover:w-full duration-300"></span>
                    </div>{" "}
                    Design
                </div>

                {/* Tagline */}
                <div className="pl-10 inline-block">
                    <div className="mt-10 mb-8 h-[1.5px] bg-midnight-light" />
                    <p className="dm-sans text-2xl leading-snug text-white tracking-wide">
                        <span className="relative z-10">
                            "Designing and building
                            <span className="text-white font-medium"> interesting</span>,
                            <span className="text-white font-medium"> intuitive</span>, and
                            <span className="text-white font-medium"> engaging</span> user interfaces for the future."
                        </span>
                    </p>
                </div>
            </div>

            <TechCarousel/>



            {/* Scroll Arrow */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-10 h-10 z-10 border border-white flex items-center justify-center cursor-pointer transition-colors bg-midnight hover:bg-white hover:text-black">
                <ArrowDown strokeWidth={1.5} className="w-5 h-5 transition-all duration-300 ease-in-out" />
            </div>

        </main>
    );
}
