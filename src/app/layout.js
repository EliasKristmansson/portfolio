import "./globals.css";

export const metadata = {
    title: "Elias Kristmansson",
    description: "Designing and building interesting, intuitive, and engaging interfaces.",
    icons: {
        icon: "/images/favicon.svg",
        shortcut: "/images/favicon.svg",
        apple: "/images/favicon.svg",
    },
    openGraph: {
        title: "My Portfolio",
    },
};


export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
                />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
