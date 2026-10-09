"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SquareArrowOutUpRight } from "lucide-react";
import { PROJECTS } from "../data/projects.js";
import Shader from "./shader.js";
import { sunsetFragment } from "./shaders/sunset.js";
import { planetFragment } from "./shaders/planet.js";

const hex = (h) => [
	parseInt(h.slice(1, 3), 16) / 255,
	parseInt(h.slice(3, 5), 16) / 255,
	parseInt(h.slice(5, 7), 16) / 255,
];

// PLACEHOLDER palettes, swap for colors from the screenshots (A = base, B = band, C = patches + atmosphere)
const PALETTES = {
	"project-01": ["#4a55a7", "#433586", "#5b4ca8"],
	"project-03": ["#005f30", "#007A3E", "#007e3f"],
	"project-02": ["#ffe3a6", "#FFF0CF", "#fff9ea"],
};

const WORKS = Object.entries(PALETTES).map(([projectId, palette]) => {
	const { name, badge, description } = PROJECTS.find(({ id }) => id === projectId);
	return { projectId, name, badge, description, colors: palette.map(hex) };
});
const IDLE = 0.002;      // slow drift when nobody is touching the planet (rad/frame)
const NUDGE = 0.063;     // a click/keypress gives roughly a quarter turn
const REVEAL_AT = 1.2;   // radians of user spin before the info appears

function Planet({ work, index }) {
	const fromLeft = index % 2 === 0;
	const rowRef = useRef(null);
	const sim = useRef({ dragging: false, lastX: 0, moved: 0, vel: 0, spun: 0, armed: false, revealed: false });
	const [slid, setSlid] = useState(false);
	const [revealed, setRevealed] = useState(false);

	// Must be memoized: Shader tears down its WebGL renderer if this object changes
	const uniforms = useMemo(
		() => ({
			uRotation: { value: fromLeft ? 0.6 : 2.4 },
			uColorA: { value: work.colors[0] },
			uColorB: { value: work.colors[1] },
			uColorC: { value: work.colors[2] },
		}),
		[work, fromLeft]
	);

	// Slide in once the row is on screen, and give the planet a push so it rolls in
	useEffect(() => {
		const el = rowRef.current;
		if (!el) return;
		let timer;
		const io = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				setSlid(true);
				sim.current.vel = fromLeft ? 0.1 : -0.1;
				// Don't count the roll-in as the user's spin
				timer = setTimeout(() => (sim.current.armed = true), 1400);
				io.disconnect();
			},
			{ threshold: 0.35 }
		);
		io.observe(el);
		return () => {
			io.disconnect();
			clearTimeout(timer);
		};
	}, [fromLeft]);

	// Inertia + reveal check, one loop per planet
	useEffect(() => {
		const s = sim.current;
		const rot = uniforms.uRotation;
		let raf;
		const tick = () => {
			if (!s.dragging) {
				s.vel += (IDLE - s.vel) * 0.04; // ease back toward the idle drift
				rot.value += s.vel;
				if (s.armed) s.spun += Math.abs(s.vel - IDLE);
			}
			if (s.armed && !s.revealed && s.spun > REVEAL_AT) {
				s.revealed = true;
				setRevealed(true);
			}
			raf = requestAnimationFrame(tick);
		};
		tick();
		return () => cancelAnimationFrame(raf);
	}, [uniforms]);

	const onPointerDown = (e) => {
		const s = sim.current;
		s.dragging = true;
		s.lastX = e.clientX;
		s.moved = 0;
		e.currentTarget.setPointerCapture(e.pointerId);
	};
	const onPointerMove = (e) => {
		const s = sim.current;
		if (!s.dragging) return;
		const dx = e.clientX - s.lastX;
		s.lastX = e.clientX;
		s.moved += Math.abs(dx);
		const d = dx * 0.012;
		// eslint-disable-next-line react-hooks/immutability -- shader uniforms are a mutable object by design
		uniforms.uRotation.value += d;
		s.vel = d; // release speed = last movement, which is what gives the fling
		if (s.armed) s.spun += Math.abs(d);
	};
	const onPointerUp = () => {
		const s = sim.current;
		s.dragging = false;
		if (s.moved < 4) s.vel += NUDGE; // treat it as a click
	};
	const onKeyDown = (e) => {
		const s = sim.current;
		if (e.key === "ArrowLeft") s.vel -= NUDGE;
		else if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			s.vel += NUDGE;
		}
	};

	return (
		<div
			ref={rowRef}
			className={`flex flex-col items-center mt-8 lg:justify-between ${fromLeft ? "lg:flex-row" : "lg:flex-row-reverse"}`}
		>
			<div
				role="button"
				tabIndex={0}
				aria-label={`Spin the ${work.name} planet to reveal details`}
				onPointerDown={onPointerDown}
				// eslint-disable-next-line react-hooks/immutability -- handler mutates shader uniforms by design
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerUp}
				onKeyDown={onKeyDown}
				className="relative isolate size-60 shrink-0 cursor-pointer touch-pan-y select-none sm:size-72 xl:size-96"
				style={{
					transform: slid ? "translateX(0)" : `translateX(${fromLeft ? "-100vw" : "100vw"})`,
					opacity: slid ? 1 : 0,
					transition: "transform 1400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 600ms ease-out",
				}}
			>
				<Shader fragmentShader={planetFragment} uniforms={uniforms} />
			</div>

			<div className="grid w-full max-w-md">
				<p
					aria-hidden={revealed}
					className={`col-start-1 row-start-1 self-center text-center space-grotesk text-xs tracking-widest text-white/60 transition-opacity duration-700 ${revealed ? "opacity-0" : "opacity-100"}`}
				>
					Click to Spin
				</p>
				<div
					className={`col-start-1 row-start-1 flex flex-col gap-3 border border-white/20 bg-midnight-dark/20 p-6 transition-all duration-500 sm:p-8 ${revealed ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
				>
					<span className="text-xs tracking-widest text-white/60 space-mono-regular">{work.badge}</span>
					<h3 className="text-xl space-mono-bold">{work.name}</h3>
					<a
						href="#about"
						onClick={() =>
							window.dispatchEvent(new CustomEvent("open-project", { detail: { id: work.projectId } }))
						}
						className="inline-flex w-fit items-center gap-2 text-xs text-white/60 hover:text-white space-mono-regular"
					>
						VIEW IN PROJECTS FOLDER
						<SquareArrowOutUpRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
					</a>
					<p className="text-sm leading-relaxed text-white/80 space-grotesk">{work.description}</p>
				</div>
			</div>
		</div>
	);
}

const HEADING_REM = 8;
// The sky canvas extends above the section so the stars fade out gradually
const SKY_SHIFT_REM = 25 - HEADING_REM;

export default function SelectedWork() {
	const sectionRef = useRef(null);
	const skyUniforms = useMemo(() => ({ uProgress: { value: 0 } }), []);

	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const scroller = el.closest("[data-scroll-container]") ?? window;
		let target = 0;
		let raf;

		// 0 when the section's top enters the bottom of the screen,
		// 1 when the section's bottom reaches the bottom of the screen
		const update = () => {
			const r = el.getBoundingClientRect();
			target = Math.min(1, Math.max(0, (window.innerHeight - r.top) / r.height));
		};
		const tick = () => {
			const u = skyUniforms.uProgress;
			u.value += (target - u.value) * 0.08;
			raf = requestAnimationFrame(tick);
		};

		update();
		tick();
		scroller.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		return () => {
			cancelAnimationFrame(raf);
			scroller.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, [skyUniforms]);

	return (
		<section
			ref={sectionRef}
			id="selected-work"
			className="relative px-4 pb-32 text-[#FFF4ED] sm:px-6 md:px-20 md:pb-48"
			style={{ paddingTop: `${HEADING_REM}rem` }}
		>
			<div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0" style={{ top: `-${SKY_SHIFT_REM}rem` }}>
				<Shader fragmentShader={sunsetFragment} uniforms={skyUniforms} />
			</div>

			<div className="relative flex min-h-[70dvh] items-center justify-center">
				<h2 className="max-w-4xl text-center text-4xl sm:text-6xl lg:text-8xl space-mono-bold">
					SELECTED WORKS
				</h2>
			</div>

			<div className="relative mx-auto flex max-w-6xl flex-col gap-16 md:gap-20">
				{WORKS.map((work, i) => (
					<Planet key={work.name} work={work} index={i} />
				))}
			</div>
		</section>
	);
}
