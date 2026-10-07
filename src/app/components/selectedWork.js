"use client";

import { useEffect, useRef, useState } from "react";
import Shader from "./shader.js";
import { sunsetFragment } from "./shaders/sunset.js";

const WORKS = [
	{
		projectId: "project-01",
		name: "Songfrontation",
		badge: "MOBILE GAME",
		description: "Music quiz application made using React Native and Expo. The quiz pits two users against each other in a battle of music knowledge. The app, uniquely, plays on one device with the screen divided in the middle, streamlining the experience for the player.",
		images: [
			{ src: "/projects/project-01/songfrontation.png", alt: "Songfrontation front screen" },
		],
	},
	{
		projectId: "project-03",
		name: "Försäkringskassan Dashboard",
		badge: "WEB PROTOTYPE",
		description: "School collaboration project with Försäkringskassan. The project was a prototype of a new design for their web page, with a focus on improving the user experience for their customers by making it into a dashboard. The project was made using Figma.",
		images: [
			{ src: "/projects/project-03/forsakringskassan.png", alt: "Forsakringskassan dashboard" },
		],
	},
	{
		projectId: "project-02",
		name: "Explora",
		badge: "WELLTECH APP",
		portrait: true,
		description: "Welltech app made using React Native and Expo. The app is a prototype of a social media aimed at employees of companies. The idea is that, once a day, the user is presented with a text prompt whose feeling they have to capture in a picture. This picture can then be shared in dynamic groups across the company.",
		images: [
			{ src: "/projects/project-02/explora.png", alt: "Explora login page" },
		],
	},
];

function WorkPanel({ work, index }) {
	const ref = useRef(null);
	const [visible, setVisible] = useState(false);
	const [offsetLeft, setOffsetLeft] = useState(0);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const scroller = el.closest("[data-scroll-container]") ?? window;

		// Distance from the screen's left edge, so the panel starts fully off-screen
		const measure = () => setOffsetLeft(el.getBoundingClientRect().left);

		// Trigger once the panel's top passes 80% of the viewport height
		const check = () => {
			if (el.getBoundingClientRect().top < window.innerHeight * 0.8) {
				setVisible(true);
				scroller.removeEventListener("scroll", check);
			}
		};
		measure();
		check();
		scroller.addEventListener("scroll", check, { passive: true });
		window.addEventListener("resize", measure);
		return () => {
			scroller.removeEventListener("scroll", check);
			window.removeEventListener("resize", measure);
		};
	}, []);

	return (
		<div ref={ref} className={`flex w-full ${work.portrait ? "max-w-[30rem]" : "max-w-[22rem]"}`}>
			<article
				aria-label={work.name}
				className={`flex gap-5 border border-white/50 hover:border-white/80 bg-midnight-dark/90 p-5 text-white ${work.portrait ? "flex-row-reverse" : "flex-col"
					}`}
				style={{
					transform: visible ? "translateX(0)" : `translateX(calc(-100% - ${offsetLeft}px))`,
					opacity: visible ? 1 : 0,
					transition: visible
						? `transform 1000ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 150}ms, opacity 700ms ease-out ${index * 150}ms`
						: "none",
				}}
			>
				<img
					src={work.images[0].src}
					alt={work.images[0].alt}
					loading="lazy"
					className={work.portrait ? "h-full w-auto max-w-[45%] shrink-0 self-start" : "w-full h-auto"}
				/>
				<div className="flex flex-col gap-3">
					<h3 className="text-xl space-mono-bold">{work.name}</h3>
					<a
						href="#about"
						onClick={() =>
							window.dispatchEvent(new CustomEvent("open-project", { detail: { id: work.projectId } }))
						}
						className="text-xs text-[#6c7172] hover:text-[#a0a5a7] space-mono-regular"
					>
						VIEW IN PROJECTS FOLDER
					</a>
					<p className="text-sm leading-relaxed text-white/80 space-grotesk">{work.description}</p>
				</div>
			</article>
		</div>
	);
}

const HEADING_REM = 8;
// The sky canvas extends above the section so the stars fade out gradually
const SKY_SHIFT_REM = 25 - HEADING_REM;

export default function SelectedWork() {
	return (
		<section
			id="selected-work"
			className="selected-work-section relative text-[#FFF4ED] px-6 md:px-20 pb-16"
			style={{ paddingTop: `${HEADING_REM}rem` }}
		>
			<div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0" style={{ top: `-${SKY_SHIFT_REM}rem` }}>
				<Shader fragmentShader={sunsetFragment} />
			</div>
			<div className="relative mb-12 text-center">
				<h2 className="relative inline-block text-4xl md:text-8xl space-mono-bold">
					Selected_Works
				</h2>
			</div>
			<div className="relative flex flex-wrap items-stretch justify-center gap-8">
				{WORKS.map((work, i) => (
					<WorkPanel key={work.name} work={work} index={i} />
				))}
			</div>
		</section>
	);
}
