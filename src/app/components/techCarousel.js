"use client";
import { useState } from "react";
import TechIcon from "./techIcon";

const logos = [
    {
        className: "devicon-vscode-plain",
        alt: "VSCode",
        description: "My primary code editor, loved for its speed, extensions, and customization.",
        link: "https://code.visualstudio.com/"
    },
    {
        className: "devicon-visualstudio-plain",
        alt: "Visual Studio",
        description: "Robust IDE for .NET and C# development, perfect for large-scale projects.",
        link: "https://visualstudio.microsoft.com/"
    },
    {
        className: "devicon-github-plain",
        alt: "GitHub",
        description: "Where I host, collaborate, and manage all my code and open source projects.",
        link: "https://github.com/"
    },
    {
        className: "devicon-html5-plain",
        alt: "HTML5",
        description: "The backbone of every web page I build—semantic, accessible, and modern.",
        link: "https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5"
    },
    {
        className: "devicon-css3-plain",
        alt: "CSS3",
        description: "For crafting beautiful, responsive, and interactive user interfaces.",
        link: "https://developer.mozilla.org/en-US/docs/Web/CSS"
    },
    {
        className: "devicon-c-plain",
        alt: "C",
        description: "A foundational language for understanding low-level programming and performance.",
        link: "https://en.wikipedia.org/wiki/C_(programming_language)"
    },
    {
        className: "devicon-csharp-plain",
        alt: "C#",
        description: "My go-to for building robust desktop and web applications with .NET.",
        link: "https://learn.microsoft.com/en-us/dotnet/csharp/"
    },
    {
        className: "devicon-dot-net-plain",
        alt: "ASP.NET",
        description: "Framework of choice for scalable, high-performance web backends.",
        link: "https://dotnet.microsoft.com/"
    },
    {
        className: "devicon-tailwindcss-plain",
        alt: "TailwindCSS",
        description: "Utility-first CSS framework that speeds up my styling workflow.",
        link: "https://tailwindcss.com/"
    },
    {
        className: "devicon-react-plain",
        alt: "React",
        description: "My favorite JavaScript library for building fast, interactive UIs.",
        link: "https://react.dev/"
    },
];

export default function TechCarousel() {
    const [paused, setPaused] = useState(false);

    // CSS-klasser för ikonerna
    const iconClasses = "text-white text-9xl cursor-pointer";

    return (
        <div className="relative overflow-hidden mt-25 py-10">
            {/* Left gradient overlay */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-midnight to-transparent z-10"></div>

            {/* Right gradient overlay */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-midnight to-transparent z-10"></div>

            {/* Infinite marquee container */}
            <div className={`marquee flex gap-24 relative ${paused ? "pause" : ""}`}>
                {/* Lägg loggorna två gånger för seamless loop */}
                {[...logos, ...logos].map((logo, idx) => (
                    <TechIcon
                        key={idx}
                        iconClass={logo.className}
                        name={logo.alt}
                        description={logo.description}
                        link={logo.link}
                        setCarouselPaused={setPaused}
                    />
                ))}
            </div>
        </div>
    );
}
