import type { Metadata, Viewport } from "next";
import "./globals.css";

const publicBasePath =
  process.env.GITHUB_ACTIONS === "true" ? "/JDEportfoliogpt" : "";
const siteUrl = "https://enerjadez.github.io/JDEportfoliogpt/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "JDE — Intelligent Systems for Modern Business",
  description:
    "JDE designs AI-powered systems that turn slow processes, scattered data, and repetitive work into clarity, performance, and freedom.",
  keywords: [
    "JDE",
    "AI systems",
    "business automation",
    "data systems",
    "workflow automation",
    "AI consulting",
  ],
  authors: [{ name: "JDE" }],
  creator: "JDE",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "JDE",
    title: "Your business, engineered to move freely.",
    description:
      "Intelligent systems for better productivity, data clarity, performance, and operational freedom.",
    images: [
      {
        url: siteUrl + "og.png",
        width: 1536,
        height: 1024,
        alt: "JDE — Your business, engineered to move freely.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JDE — Intelligence made useful",
    description:
      "AI-powered systems built for speed, control, clarity, and growth.",
    images: [siteUrl + "og.png"],
  },
  icons: {
    icon: publicBasePath + "/favicon.svg",
    shortcut: publicBasePath + "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#080908",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
