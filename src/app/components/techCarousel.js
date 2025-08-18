export default function TechCarousel() {
  const logos = [
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", alt: "VSCode" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg", alt: "Visual Studio" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", alt: "GitHub" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", alt: "HTML" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", alt: "CSS" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg", alt: "C" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg", alt: "C#" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg", alt: "ASP.NET" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg", alt: "Tailwind" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", alt: "React" },
  ];

  return (
    <div className="relative overflow-hidden mt-25 py-10">
      {/* Left gradient overlay */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-midnight to-transparent z-10"></div>

      {/* Right gradient overlay */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-midnight to-transparent z-10"></div>

      {/* Infinite marquee container */}
      <div className="marquee">
        {/* First set */}
        <div className="flex space-x-24">
          {logos.map((logo, idx) => (
            <img
              key={idx}
              src={logo.src}
              alt={logo.alt}
              className={`h-36 w-36 cursor-pointer object-contain ${
                idx === logos.length - 1 ? "mr-24" : ""
              }`}
            />
          ))}
        </div>

        {/* Second set (clone for seamless loop) */}
        <div className="flex space-x-24">
          {logos.map((logo, idx) => (
            <img
              key={`clone-${idx}`}
              src={logo.src}
              alt={logo.alt}
              className="h-36 w-36 cursor-pointer object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
