"use client";

import Header from "./components/header.js";
import Main from "./components/main.js";
import About from "./components/about.js";

export default function Home() {
	return (
		// Scrollable content


		<div className="max-h-screen overflow-y-auto
					[&::-webkit-scrollbar]:w-3
					[&::-webkit-scrollbar-thumb]:border-2
					[&::-webkit-scrollbar-thumb]:border-solid
					[&::-webkit-scrollbar-thumb]:border-transparent
					[&::-webkit-scrollbar-thumb]:bg-clip-content
					[&::-webkit-scrollbar-track]:bg-midnight
					[&::-webkit-scrollbar-thumb]:bg-midnight-light
					[&::-webkit-scrollbar-thumb]:rounded-full">
			<div className="box-border space-grotesk">
				<Header />
				<Main />
				<About />

				<footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
			</div>
		</div>
	);
}
