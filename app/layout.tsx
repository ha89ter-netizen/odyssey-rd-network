import type { Metadata, Viewport } from "next";
import { fontVars } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "ODYSSEY — Global Rare Disease Match Network",
  description:
    "Design Lab: ten visual directions for ODYSSEY, a global clinical matchmaking network for difficult and rare disease cases. Demonstration data only.",
};

export const viewport: Viewport = {
  themeColor: "#0b0d0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
