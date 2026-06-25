import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { APP } from "@/lib/constants";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${APP.name} — ${APP.tagline}`,
  description: APP.description,
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: `${APP.name} — ${APP.tagline}`,
    description: APP.description,
    type: "website",
  },
  twitter: { card: "summary_large_image", site: "@chadwallet" },
};

export const viewport: Viewport = {
  themeColor: "#080404",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-base text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
