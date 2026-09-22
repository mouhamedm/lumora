import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LUMORA — Studio Créatif, Direction Artistique & Ingénierie Digitale",
  description:
    "LUMORA est un studio créatif d'avant-garde. Nous sculptons des identités magnétiques, des expériences web immersives et des artefacts digitaux inoubliables.",
  keywords: [
    "studio créatif",
    "direction artistique",
    "branding",
    "motion design",
    "creative development",
    "WebGL",
    "Next.js",
  ],
  authors: [{ name: "LUMORA Studio" }],
  openGraph: {
    title: "LUMORA — Studio Créatif & Direction Artistique",
    description:
      "Design radical, identités souveraines et ingénierie créative sans compromis.",
    url: "https://lumora.studio",
    siteName: "LUMORA",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased selection:bg-[#FF3B1D] selection:text-white`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAF8] text-[#111110]">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
