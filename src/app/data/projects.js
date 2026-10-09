export const PROJECTS = [
    {
        id: "project-01",
        name: "Songfrontation",
        badge: "MOBILE GAME",
        color: "#4a55a7",
        description: "Music quiz application made using React Native and Expo. The quiz pits two users against each other in a battle of music knowledge. The app, uniquely, plays on one device with the screen divided in the middle, streamlining the experience for the player.",
        images: [
            { src: "/projects/project-01/songfrontation.png", alt: "Songfrontation front screen" },
            { src: "/projects/project-01/songfrontation2.png", alt: "Songfrontation match settings" },
            { src: "/projects/project-01/songfrontation3.png", alt: "Songfrontation game settings" },
        ],
    },
    {
        id: "project-02",
        name: "Explora",
        badge: "WELLTECH APP",
        color: "#fff0cf",
        previewMode: "portrait",
        description: "Welltech app made using React Native and Expo. The app is a prototype of a social media aimed at employees of companies. The idea is that, once a day, the user is presented with a text prompt whose feeling they have to capture in a picture. This picture can then be shared in dynamic groups across the company.",
        images: [
            { src: "/projects/project-02/explora.png", alt: "Explora login screen" },
            { src: "/projects/project-02/explora3.png", alt: "Explora front page" },
            { src: "/projects/project-02/explora2.png", alt: "Explora camera" },
            { src: "/projects/project-02/explora4.png", alt: "Explora gallery page" },
            { src: "/projects/project-02/explora5.png", alt: "Explora profile page" },
        ],
    },
    {
        id: "project-03",
        name: "Försäkringskassan Dashboard",
        badge: "WEB PROTOTYPE",
        color: "#007A3E",
        description: "School collaboration project with Försäkringskassan. The project was a prototype of a new design for their web page, with a focus on improving the user experience for their customers by making it into a dashboard. The project was made using Figma.",
        images: [
            { src: "/projects/project-03/forsakringskassan.png", alt: "Forsakringskassan dashboard" },
            { src: "/projects/project-03/forsakringskassan2.png", alt: "Forsakringskassan stories page" },
            { src: "/projects/project-03/forsakringskassan3.png", alt: "Forsakringskassan stories widget" },
            { src: "/projects/project-03/forsakringskassan4.png", alt: "Forsakringskassan scrolled dashboard" },
        ],
    },
    {
        id: "project-04",
        name: "Projekt Streamline",
        badge: "WEB PAGE",
        color: "#e0e0e0",
        description: "Collaboration project with a company called Pelagia. The goal was to create a new documentation/sorting system for their internal use. The project was made using React. The result landed in a prototype that was presented to the company, and was left open for further development.",
        images: [
            { src: "/projects/project-04/pelagia.png", alt: "Projekt Streamline project view" },
            { src: "/projects/project-04/pelagia2.png", alt: "Projekt Streamline sidebar" },
            { src: "/projects/project-04/pelagia3.png", alt: "Projekt Streamline modal 1" },
            { src: "/projects/project-04/pelagia4.png", alt: "Projekt Streamline modal 2" },
            { src: "/projects/project-04/pelagia5.png", alt: "Projekt Streamline filter modal" },
        ],
    },
    {
        id: "project-05",
        name: "Whiteboard",
        badge: "FULLSTACK WEB APP",
        color: "#ffffff",
        description: "Simple whiteboard application made using React for frontend and ASP.NET Core for backend, as well as SignalR for websocket handling. Supports multiple users and real-time drawing and chatting.",
        link: "https://whiteboard-frontend-e304.onrender.com/",
        images: [
            { src: "/projects/project-05/whiteboard.png", alt: "Whiteboard page" },
            { src: "/projects/project-05/whiteboard2.png", alt: "Whiteboard page with more drawing" },
            { src: "/projects/project-05/whiteboard3.png", alt: "Whiteboard chat" },
        ],
    },
    {
        id: "project-06",
        name: "Audio Feedback in Gaming: How Audio Properties Shape Player Experience",
        badge: "RESEARCH PAPER",
        color: "#0AB5FF",
        abstract: [
            "This study investigates how audio feedback in video games influences player experience, with a focus on four specific audio properties (Pitch, Loudness, ADSR Envelope, and Frequency Content) across three classic interactions: collecting an item, making a UI action, and taking damage.",
            "The study consisted of two phases, the data gathering phase and the audio analysis phase. The first phase involved the player test, where players chose the sounds to be investigated in the second phase. The resulting sounds were extracted and analyzed according to the four audio properties.",
            "The analysis indicated, among other things, that UI action sounds should be short, noise-like clicks to effectively respond to the player’s actions. Item collection sounds should also be fast, but lean towards being rewarding and positive, while the taking damage sounds should be slightly longer and lean towards being punishing, impactful, and negative.",
            "Audio feedback remains a relatively underexplored area in game design research, and these findings—along with potential future ones should this paper be expanded upon—provide more scientifically and technically grounded guidelines for sound designers and game developers looking to give players more effective feedback in their games.",
        ],
        audioProperties: ["Pitch", "Loudness", "ADSR Envelope", "Frequency Content"],
        interactions: ["Collecting an item", "Making a UI action", "Taking damage"],
        pdfUrl: "/projects/project-06/Audio%20Feedback%20in%20Gaming%20How%20Audio%20Properties%20Shape%20Player%20Experience.pdf",
        images: [],
    },
];

export const EXPERTISE = [
    {
        icon: "devicon-vscode-plain",
        alt: "VSCode",
        link: "https://code.visualstudio.com/"
    },
    {
        icon: "devicon-visualstudio-plain",
        alt: "Visual Studio",
        link: "https://visualstudio.microsoft.com/"
    },
    {
        icon: "devicon-github-plain",
        alt: "GitHub",
        link: "https://github.com/"
    },
    {
        icon: "devicon-html5-plain",
        alt: "HTML5",
        link: "https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5"
    },
    {
        icon: "devicon-css3-plain",
        alt: "CSS3",
        link: "https://developer.mozilla.org/en-US/docs/Web/CSS"
    },
    {
        icon: "devicon-c-plain",
        alt: "C",
        link: "https://en.wikipedia.org/wiki/C_(programming_language)"
    },
    {
        icon: "devicon-csharp-plain",
        alt: "C#",
        link: "https://learn.microsoft.com/en-us/dotnet/csharp/"
    },
    {
        icon: "devicon-dot-net-plain",
        alt: "ASP.NET",
        link: "https://dotnet.microsoft.com/"
    },
    {
        icon: "devicon-tailwindcss-plain",
        alt: "TailwindCSS",
        link: "https://tailwindcss.com/"
    },
    {
        icon: "devicon-react-plain",
        alt: "React",
        link: "https://react.dev/"
    },
];
