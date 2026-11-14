import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";

// IBM Plex is self-hosted (public/fonts, src/app/fonts.css) because next/font/google
// in Next 15 crashes on Google's extensionless subset URLs, and because ₦ (latin-ext)
// and Nigerian dot-below letters ọ ẹ ị ụ (vietnamese subset) must render in Plex.
const preload = [
  "/fonts/IBMPlexSans-400-latin.woff2",
  "/fonts/IBMPlexSans-600-latin.woff2",
  "/fonts/IBMPlexMono-400-latin.woff2",
] as const;

export const metadata: Metadata = {
  title: "CautionSafe",
  description: "Record your flat's condition, sign it together, and settle the caution fee fairly.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F5F0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <head>
        {preload.map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
