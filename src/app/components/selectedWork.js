import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const FEATURED_WORK = [
    {
        id: "01",
        name: "Songfrontation",
        category: "MOBILE GAME",
        tools: "React Native · Expo",
        image: "/projects/project-01/songfrontation.png",
        imageAlt: "Songfrontation music quiz game",
        text: "A two-player music quiz built around quick head-to-head rounds.",
        outcome: "Split-screen play lets both players compete on one device.",
        color: "#0AB5FF",
    },
    {
        id: "02",
        name: "Explora",
        category: "WELLBEING PROTOTYPE",
        tools: "React Native · Expo",
        image: "/projects/project-02/explora3.png",
        imageAlt: "Explora employee wellbeing app front page",
        text: "A workplace social app concept built around a daily photo prompt.",
        outcome: "Daily moments are shared through dynamic company groups.",
        color: "#FF7A9B",
    },
    {
        id: "03",
        name: "Whiteboard",
        category: "FULL-STACK WEB APP",
        tools: "React · ASP.NET Core · SignalR",
        image: "/projects/project-05/whiteboard.png",
        imageAlt: "Whiteboard app with a shared drawing canvas",
        text: "A collaborative whiteboard with a React frontend and ASP.NET Core backend.",
        outcome: "Multiple people can draw and chat together in real time.",
        color: "#FF7F17",
    },
];

export default function SelectedWork() {
    return (
        <section id="selected-work" className=" text-white">
            <div className="max-w-7xl">
                <header className="mb-8 pt-20 pl-20 ">
                    <h2 className="text-7xl text-white space-mono-bold">Selected Work</h2>
                    <p className="text-md leading-relaxed text-white mt-2 space-grotesk">
                        The three projects I am the most proud of. Showcasing mobile, web development, collaboration, and design skills. See more on desktop
                    </p>
                </header>

                <div className="divide-y divide-white/15">
                    {FEATURED_WORK.map((project) => (
                        <div key={project.id} className="overflow-hidden">
                            <article
                                className="selected-work-panel grid gap-5 border border-white/10 bg-midnight-dark px-4 py-6 md:grid-cols-[2.5rem_minmax(15rem,0.9fr)_minmax(20rem,1.1fr)] md:gap-7 md:px-6"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden border border-white/15 bg-midnight-dark">
                                    <Image
                                        src={project.image}
                                        alt={project.imageAlt}
                                        fill
                                        sizes="(min-width: 768px) 36vw, 100vw"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex min-w-0 flex-col justify-center py-1">
                                    <p className="text-[10px] text-white/45 space-mono-bold">{project.category}</p>
                                    <h3 className="mt-2 text-2xl text-white space-mono-bold">{project.name}</h3>
                                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 space-grotesk">{project.text}</p>
                                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55 space-grotesk">{project.outcome}</p>
                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                                        <span className="text-[10px] text-white/45 space-mono-regular">{project.tools}</span>
                                        <a
                                            href="#about"
                                            className="inline-flex items-center gap-1 text-xs text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-white/70 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
                                        >
                                            Explore in desktop
                                            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
                                        </a>
                                    </div>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}