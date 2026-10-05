"use client";

import Header from "./components/header.js";
import Main from "./components/main.js";
import About from "./components/about.js";
import Shader from "./components/shader.js";
import { exampleFragment } from "./components/shaders/example.js";
import { useEffect, useRef, useState } from "react";

export default function Home() {
	const scrollContainerRef = useRef(null);
	const [aboutDarkness, setAboutDarkness] = useState(0);

	useEffect(() => {
		const scrollContainer = scrollContainerRef.current;
		const aboutSection = scrollContainer?.querySelector("#about");
		if (!scrollContainer || !aboutSection) return;

		const updateAboutDarkness = () => {
			const containerTop = scrollContainer.getBoundingClientRect().top;
			const aboutTop = aboutSection.getBoundingClientRect().top - containerTop + scrollContainer.scrollTop;
			const progress = Math.max(0, Math.min(1, scrollContainer.scrollTop / Math.max(aboutTop, 1)));
			setAboutDarkness(progress);
		};

		updateAboutDarkness();
		scrollContainer.addEventListener("scroll", updateAboutDarkness, { passive: true });
		window.addEventListener("resize", updateAboutDarkness);
		return () => {
			scrollContainer.removeEventListener("scroll", updateAboutDarkness);
			window.removeEventListener("resize", updateAboutDarkness);
		};
	}, []);

	return (
		<div ref={scrollContainerRef} data-scroll-container className="max-h-screen overflow-y-auto
					[&::-webkit-scrollbar]:w-3
					[&::-webkit-scrollbar-thumb]:border-2
					[&::-webkit-scrollbar-thumb]:border-solid
					[&::-webkit-scrollbar-thumb]:border-transparent
					[&::-webkit-scrollbar-thumb]:bg-clip-content
					[&::-webkit-scrollbar-track]:bg-midnight
					[&::-webkit-scrollbar-thumb]:bg-midnight-light
					[&::-webkit-scrollbar-thumb]:rounded-full">
			<Shader fragmentShader={exampleFragment} className="fixed inset-0 -z-10" />
			<div
				aria-hidden="true"
				className="pointer-events-none fixed inset-0 z-0"
				style={{ backgroundColor: `rgba(14, 14, 15, ${aboutDarkness})` }}
			/>
			<div className="relative z-10 box-border space-grotesk">
				<Header />
				<div className="relative isolate overflow-hidden">
					<div className="relative z-10">
						<Main />
						<About />
						<footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
					</div>
				</div>
			</div>
		</div>
	);
}