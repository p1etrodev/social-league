import "./globals.css";

import { Cinzel, Manrope, Share_Tech_Mono } from "next/font/google";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Providers } from "./providers";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: ["League of Legends", "LoL", "campeones", "red social", "Social League"],
  applicationName: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    locale: "es_AR",
    images: [{ url: "/logo.png", width: 436, height: 491, alt: siteName }],
  },
  twitter: {
    card: "summary",
    title: siteName,
    description: siteDescription,
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cinzel.variable} ${manrope.variable} ${shareTechMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <div className="flex min-h-full flex-1 flex-row justify-center">
            <Navbar />
            <main className="flex h-full min-w-[50%] flex-1 flex-col pb-16 sm:pb-0">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
