"use client";
import TechIcon from "./techIcon";

export default function TechCarousel() {
    // Lista över loggor med devicon font-klasser
    const logos = [
        { className: "devicon-vscode-plain", alt: "VSCode" },
        { className: "devicon-visualstudio-plain", alt: "Visual Studio" },
        { className: "devicon-github-plain", alt: "GitHub" },
        { className: "devicon-html5-plain", alt: "HTML5" },
        { className: "devicon-css3-plain", alt: "CSS3" },
        { className: "devicon-c-plain", alt: "C" },
        { className: "devicon-csharp-plain", alt: "C#" },
        { className: "devicon-dot-net-plain", alt: "ASP.NET" },
        { className: "devicon-tailwindcss-plain", alt: "TailwindCSS" },
        { className: "devicon-react-plain", alt: "React" },
    ];

    // CSS-klasser för ikonerna
    const iconClasses = "text-white text-9xl cursor-pointer";

    return (
        <div className="relative overflow-hidden mt-25 py-10">
            {/* Left gradient overlay */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-midnight to-transparent z-10"></div>

            {/* Right gradient overlay */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-midnight to-transparent z-10"></div>

            {/* Infinite marquee container */}
            <div className="marquee flex gap-24">
                {/* Lägg loggorna två gånger för seamless loop */}
                {[...logos, ...logos].map((logo, idx) => (
                        <TechIcon key={idx} iconClass={logo.className} name={logo.alt} />
                ))}

                
            </div>
        </div>
    );
}
