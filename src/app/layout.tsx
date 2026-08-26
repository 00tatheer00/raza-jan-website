import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Syed Raza Jan — Architect | Interior Designer | 3D Visualization Specialist",
  description:
    "Syed Raza Jan is an architect, interior designer and 3D visualization specialist with 9+ years of professional experience in architectural design, interior design, planning, visualization and site execution.",
  keywords: [
    "architect",
    "interior designer",
    "3D visualization",
    "architectural design",
    "site execution",
    "master planning",
    "construction documentation",
    "Syed Raza Jan",
    "Pakistan architect",
    "portfolio",
  ],
  authors: [{ name: "Syed Raza Jan" }],
  openGraph: {
    title: "Syed Raza Jan — Architect | Interior Designer | 3D Visualization Specialist",
    description:
      "Architect with 9+ years of professional experience in architectural design, interior design, 3D visualization, and site execution.",
    type: "website",
    locale: "en_US",
    siteName: "Syed Raza Jan Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syed Raza Jan — Architect | Interior Designer",
    description:
      "Architect with 9+ years of professional experience in architectural design, interior design, 3D visualization, and site execution.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
