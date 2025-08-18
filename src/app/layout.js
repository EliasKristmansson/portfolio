import "./globals.css";

export const metadata = {
  title: "Elias Kristmansson",
  description: "Designing and building interesting, intuitive, and engaging interfaces.",
  openGraph: {
    title: "My Portfolio",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
