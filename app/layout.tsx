import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// One typeface for everything: a light, bookish Garamond.
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "khushi wadhwa",
  description:
    "currently @ predicate, conversing @ dry run. previously @ geometry, c14, spacex, carnegie mellon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={serif.variable}>
      <body className="font-serif">{children}</body>
    </html>
  );
}
