"use client";

import { FileText, Folder } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PROJECTS } from "../data/projects.js";

const outlineClass = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky";

function Abstract({ project }) {
    return (
        <div className="relative z-10 flex flex-1 flex-col px-5 pb-5 pt-12 sm:px-8 sm:pb-7 sm:pt-14">
            <div className="mx-auto grid w-full flex-1 grid-cols-1 content-start gap-8 xl:grid-cols-[minmax(0,1fr)_10rem]">
                <article className="w-full max-w-[82ch]">
                    <h3 className="mb-4 text-xs text-white/60 space-mono-bold">Abstract</h3>
                    <div className="space-y-4">
                        {project.abstract.map((paragraph) => (
                            <p key={paragraph} className="text-sm leading-relaxed text-white/80 space-grotesk">{paragraph}</p>
                        ))}
                    </div>
                </article>
                <aside className="flex flex-col gap-7 border-t border-white/20 pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
                    <section>
                        <h4 className="mb-2 text-[10px] text-white/60 space-mono-bold">AUDIO PROPERTIES</h4>
                        <ul className="space-y-2 text-xs text-white/80 space-mono-regular">
                            {project.audioProperties.map((property) => <li key={property}>{property}</li>)}
                        </ul>
                    </section>
                    <section>
                        <h4 className="mb-2 text-[10px] text-white/60 space-mono-bold">TEST INTERACTIONS</h4>
                        <ul className="space-y-2 text-xs leading-relaxed text-white/80 space-mono-regular">
                            {project.interactions.map((interaction) => <li key={interaction}>{interaction}</li>)}
                        </ul>
                    </section>
                </aside>
            </div>
        </div>
    );
}

export default function ProjectsBrowser({ initialProjectId, fullscreen }) {
    const [projectId, setProjectId] = useState(initialProjectId);
    const [imageIndex, setImageIndex] = useState(0);

    const project = PROJECTS.find(({ id }) => id === projectId) ?? PROJECTS[0];
    const image = project.images[imageIndex] ?? project.images[0];

    const previewSize = project.abstract
        ? `flex flex-col ${fullscreen ? "min-h-[min(70vh,38rem)] flex-1" : "min-h-[22rem]"}`
        : `overflow-hidden ${project.previewMode === "portrait" ? "h-[22rem] sm:h-[24rem]" : "aspect-video sm:aspect-[16/7]"}`;

    return (
        <div className="grid min-h-full grid-cols-1 sm:min-h-[25rem] sm:grid-cols-[13rem_minmax(0,1fr)]">
            <aside className="border-b border-white/20 p-3 sm:border-b-0 sm:border-r">
                <div className="flex gap-1 overflow-x-auto sm:flex-col sm:overflow-visible">
                    {PROJECTS.map((entry, index) => (
                        <button
                            key={entry.id}
                            type="button"
                            aria-pressed={project.id === entry.id}
                            className={`flex min-w-36 flex-1 cursor-pointer items-center gap-2 border px-2 py-3 text-left transition-colors sm:min-w-0 ${project.id === entry.id ? "border-white/40 bg-white/10 text-white" : "border-transparent text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"}`}
                            onClick={() => {
                                setProjectId(entry.id);
                                setImageIndex(0);
                            }}
                        >
                            <span className="text-[10px] text-white/40 space-mono-regular">0{index + 1}</span>
                            <Folder aria-hidden="true" className="h-4 w-4 shrink-0" style={{ color: entry.color }} strokeWidth={1.5} />
                            <span className="truncate text-xs space-mono-regular">{entry.name}</span>
                        </button>
                    ))}
                </div>
            </aside>

            <div className={`min-w-0 p-4 sm:p-5 ${project.abstract && fullscreen ? "flex flex-col" : ""}`}>
                <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="min-w-0 truncate text-lg text-white space-mono-bold">{project.name}</h2>
                    <span className="shrink-0 border border-white/20 px-2 py-1 text-[10px] text-white/60 space-mono-regular">{project.badge}</span>
                </div>

                <div
                    className={`bg-dots relative border border-white/20 bg-midnight-dark ${previewSize}`}
                    style={{ backgroundSize: "18px 18px" }}
                >
                    <div className="absolute inset-x-0 top-0 z-20 flex h-7 items-center gap-1.5 border-b border-white/20 bg-midnight-dark/95 px-3">
                        <span className="h-2 w-2 border" style={{ borderColor: project.color }} />
                        <span className="h-2 w-2 border border-white/40" />
                        <span className="h-2 w-2 border border-white/40" />
                    </div>
                    {project.abstract ? (
                        <Abstract project={project} />
                    ) : (
                        <div className="absolute inset-x-0 bottom-0 top-7">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(min-width: 1024px) 700px, 100vw"
                                className="object-contain object-top"
                            />
                        </div>
                    )}
                </div>

                {project.abstract ? (
                    <a
                        href={project.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-3 inline-flex min-h-11 items-center gap-2 border border-white/40 px-4 py-2 text-xs text-white transition-colors hover:border-sky hover:bg-sky hover:text-black space-mono-bold ${outlineClass}`}
                    >
                        <FileText aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                        Read full paper
                    </a>
                ) : (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60 space-grotesk">
                        {project.description}
                        {project.link && (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`ml-1 cursor-pointer text-sky underline decoration-sky/60 underline-offset-2 hover:text-white ${outlineClass}`}
                            >
                                Open the live app
                            </a>
                        )}
                    </p>
                )}

                {project.images.length > 1 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto border-t border-white/10 pt-3">
                        {project.images.map((thumb, index) => (
                            <button
                                key={thumb.src}
                                type="button"
                                aria-label={`Show image ${index + 1}: ${thumb.alt}`}
                                aria-pressed={imageIndex === index}
                                className={`relative h-14 w-20 shrink-0 cursor-pointer overflow-hidden border ${imageIndex === index ? "border-white/60" : "border-white/20 hover:border-white/40"}`}
                                onClick={() => setImageIndex(index)}
                            >
                                <Image src={thumb.src} alt="" fill sizes="80px" className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
