import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "James Cedeño | Full-Stack Developer",
  description:
    "Portfolio of James Cedeño – Full-Stack Developer with 6+ years of experience in .NET, React Native, APIs, and cloud services.",
  openGraph: {
    title: "James Cedeño | Full-Stack Developer",
    description:
      "6+ years building enterprise systems, APIs, and mobile apps across healthcare, government, and insurance sectors.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
