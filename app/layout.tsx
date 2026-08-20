import type { Metadata, Viewport } from "next";
import { Alex_Brush, Fraunces, Quicksand } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic", "normal"],
});

const signature = Alex_Brush({
  variable: "--font-signature",
  subsets: ["latin"],
  weight: ["400"],
});

const sans = Quicksand({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bruiloftquiz",
  description: "De trouwquiz — doe mee vanaf je telefoon!",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#fbf6f1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="nl"
      className={`${display.variable} ${signature.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
