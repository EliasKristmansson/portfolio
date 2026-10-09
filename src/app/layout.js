import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
    display: "swap",
});

const spaceMono = Space_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-space-mono",
    display: "swap",
});

export const metadata = {
    title: "Elias Kristmansson",
    description: "Designing and building interesting, intuitive, and engaging interfaces.",
    icons: {
        icon: "/images/favicon.svg",
        shortcut: "/images/favicon.svg",
        apple: "/images/favicon.svg",
    },
    openGraph: {
        title: "Elias Kristmansson",
        description: "Designing and building interesting, intuitive, and engaging interfaces.",
    },
};

export const viewport = {
    themeColor: "#0e0e0f",
    colorScheme: "dark",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/devicon.min.css"
                />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
