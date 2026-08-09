import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cafe } from "@/data/menu";

const body = Inter({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: `${cafe.name} — Menü`,
  description: `${cafe.name} dijital menü: kahvaltı, börek, pide, fast food, kahve ve içecekler. ${cafe.address}`,
  openGraph: {
    title: `${cafe.name} — Menü`,
    description: cafe.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#3b2f2a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={`${body.variable} ${display.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
