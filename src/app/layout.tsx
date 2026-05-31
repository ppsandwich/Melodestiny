import type { Metadata } from "next";
import { Playfair_Display, Lora, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-body",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const syamsiah = localFont({
  src: "../../public/fonts/SyamsiahArabic.ttf",
  variable: "--font-title",
});

export const metadata: Metadata = {
  title: "Melodestiny - Lyric Analysis",
  description: "Score pop songs on structural and lyrical quality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${lora.variable} ${ibmPlexMono.variable} ${syamsiah.variable} min-h-full flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
