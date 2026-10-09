import { ArrowDown } from "lucide-react";

export default function Main() {
    return (
        <section
            id="home"
            className="relative min-h-[calc(100dvh-72px)] px-6 pb-28 pt-10 text-white sm:px-10 md:p-20 md:pb-28"
        >
            <h1
                className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl space-mono-bold"
                style={{ textShadow: "0 0 50px rgba(0, 0, 0, 1)" }}
            >
                <span className="inline-block text-sky">Designer</span>
                +
                <span className="inline-block text-rose">Developer</span>
            </h1>

            <div className="mt-6 text-3xl sm:text-5xl md:mt-8 lg:text-6xl xl:text-7xl">
                specializing in{" "}
                <div className="relative inline-block group">
                    <span className="relative inline-block text-white transition-all duration-700 ease-in-out group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky cursor-default group-hover:via-rose group-hover:to-amber group-hover:bg-[length:200%_100%] group-hover:animate-gradient-slide">
                        Interaction
                    </span>
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all group-hover:w-full duration-300"></span>
                </div>{" "}
                Design
            </div>

            <div className="inline-block">
                <div className="mb-6 mt-8 h-[1.5px] bg-white/40 md:mb-8 md:mt-10" />
                <p className="text-lg leading-snug tracking-wide text-white space-grotesk sm:text-xl md:text-2xl">
                    &ldquo;Designing and building
                    <span className="font-medium"> interesting</span>,
                    <span className="font-medium"> intuitive</span>, and
                    <span className="font-medium"> engaging</span> user interfaces for the future.&rdquo;
                </p>
            </div>

            <a
                href="#about"
                aria-label="Go to About section"
                className="absolute bottom-5 left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 cursor-pointer items-center justify-center border border-white bg-midnight transition-colors hover:bg-white hover:text-black"
            >
                <ArrowDown strokeWidth={1.5} className="h-5 w-5" />
            </a>
        </section>
    );
}
