"use client";

import Shader from "./shader";
import { exampleFragment } from "./shaders/example.js";

const hexToRgb = (hex) => {
    const value = hex.replace("#", "");
    return {
        red: parseInt(value.slice(0, 2), 16),
        green: parseInt(value.slice(2, 4), 16),
        blue: parseInt(value.slice(4, 6), 16),
    };
};

export default function About() {
    const handleCardMouseMove = (event) => {
        const card = event.currentTarget;
        const bounds = card.getBoundingClientRect();
        const mouseX = event.clientX - bounds.left;
        const mouseY = event.clientY - bounds.top;
        const progress = Math.max(0, Math.min(1, mouseY / bounds.height));
        const start = hexToRgb(card.dataset.gradientStart);
        const end = hexToRgb(card.dataset.gradientEnd);
        const red = Math.round(start.red + (end.red - start.red) * progress);
        const green = Math.round(start.green + (end.green - start.green) * progress);
        const blue = Math.round(start.blue + (end.blue - start.blue) * progress);

        card.style.setProperty("--mouse-x", `${mouseX}px`);
        card.style.setProperty("--mouse-y", `${mouseY}px`);
        card.style.setProperty("--cursor-glow", `rgba(${red}, ${green}, ${blue}, 0.25)`);
    };

    return (
        <main
            id="about"
            className="text-white px-6 py-20 md:px-20 relative"
            style={{ minHeight: "calc(100vh)" }}
        >
            <Shader fragmentShader={exampleFragment}/>

            <div className="mt-8 mx-auto max-w-6xl lg:min-h-[660px] grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-14 items-stretch">
                <div className="relative h-full min-h-[420px] md:min-h-[560px] border border-white bg-midnight-light/20 flex items-center justify-center overflow-hidden">
                    <div className="relative z-10 w-[calc(100%-2rem)] h-[calc(100%-2rem)] border border-dashed border-white/50 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl text-white/80">[your photo]</span>
                        <span className="mt-3 text-sm text-gray-400">A portrait or image of you goes here</span>
                    </div>
                </div>

                <div className="grid gap-8">
                    <article onMouseMove={handleCardMouseMove} data-gradient-start="#e48098" data-gradient-end="#b995c5" className="about-card about-card-top border border-white p-6 md:p-8 min-h-40 bg-midnight-light/20">
                        <h2 className="text-2xl md:text-3xl space-mono-bold"><span className="about-card-marker">// </span>Services</h2>
                        <p className="mt-3 text-base leading-relaxed text-gray-300 space-grotesk">Write a short introduction about the work you do and the kind of problems you enjoy solving.</p>
                    </article>

                    <article onMouseMove={handleCardMouseMove} data-gradient-start="#b995c5" data-gradient-end="#65a4da" className="about-card about-card-middle border border-white p-6 md:p-8 min-h-40 bg-midnight-light/20">
                        <h2 className="text-2xl md:text-3xl space-mono-bold"><span className="about-card-marker">// </span>Approach</h2>
                        <p className="mt-3 text-base leading-relaxed text-gray-300 space-grotesk">Describe your process, what you value, and how you collaborate with people and teams.</p>
                    </article>

                    <article onMouseMove={handleCardMouseMove} data-gradient-start="#65a4da" data-gradient-end="#25b4f0" className="about-card about-card-bottom border border-white p-6 md:p-8 min-h-40 bg-midnight-light/20">
                        <h2 className="text-2xl md:text-3xl space-mono-bold"><span className="about-card-marker">// </span>Story</h2>
                        <p className="mt-3 text-base leading-relaxed text-gray-300 space-grotesk">Add the personal details, interests, or experiences that help visitors get to know you.</p>
                    </article>
                </div>
            </div>
        </main>
    );
}
