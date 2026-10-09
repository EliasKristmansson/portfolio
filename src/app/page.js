import Footer from "./components/footer.js";
import Header from "./components/header.js";
import Main from "./components/main.js";
import About from "./components/about.js";
import SelectedWork from "./components/selectedWork.js";
import Shader from "./components/shader.js";
import { exampleFragment } from "./components/shaders/example.js";

export default function Home() {
	return (
		<div data-scroll-container className="h-dvh overflow-y-auto motion-safe:scroll-smooth
					[&::-webkit-scrollbar]:w-3
					[&::-webkit-scrollbar-thumb]:border-2
					[&::-webkit-scrollbar-thumb]:border-solid
					[&::-webkit-scrollbar-thumb]:border-transparent
					[&::-webkit-scrollbar-thumb]:bg-clip-content
					[&::-webkit-scrollbar-track]:bg-midnight
					[&::-webkit-scrollbar-thumb]:bg-midnight-light
					[&::-webkit-scrollbar-thumb]:rounded-full">
			<Shader fragmentShader={exampleFragment} className="fixed inset-0 -z-10" />
			<div className="relative z-10 box-border space-grotesk">
				<Header />
				<main className="relative isolate overflow-hidden">
					<Main />
					<About />
					<SelectedWork />
				</main>
				<Footer />
			</div>
		</div>
	);
}
