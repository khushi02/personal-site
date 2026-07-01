import type { Metadata } from "next";
import { Inter, Shantell_Sans, Caveat } from "next/font/google";
import "./globals.css";

// Clean sans, kept for dense / utility text (authors, ratings, notes).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Primary handwriting face — legible at body size.
const hand = Shantell_Sans({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

// Display / flourish face for big headers, dates, the journal title.
const display = Caveat({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "khushi's notebook",
  description: "a curated collection of places and ideas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${hand.variable} ${display.variable}`}
    >
      <body className="font-hand">{children}</body>
    </html>
  );
}
