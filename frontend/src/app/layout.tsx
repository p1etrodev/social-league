import "./globals.css";

import { Mukta_Vaani, Roboto } from "next/font/google";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Providers } from "./providers";

const muktaVaani = Mukta_Vaani({
  variable: "--font-mukta-vaani",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
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
    images: [{ url: "/jungle.png", width: 436, height: 491, alt: siteName }],
  },
  twitter: {
    card: "summary",
    title: siteName,
    description: siteDescription,
    images: ["/jungle.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${muktaVaani.variable} ${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <div className="flex min-h-full flex-1 flex-row justify-center">
            <Navbar />
            <main className="flex h-full min-w-[50%] flex-col pb-16 sm:pb-0">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
