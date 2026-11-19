import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BRAND, SITE_URL } from "@/lib/config";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} — ${BRAND.product}`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    "ATELIER is a quiet, local-first visual wardrobe. Curate your pieces like a private fashion gallery.",
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description:
      "A private digital wardrobe with editorial Gallery and Grid views. Photos stay on your device.",
    type: "website",
    url: SITE_URL,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F7F5F0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col antialiased overflow-x-clip">
        <SiteHeader />
        <main className="flex-1 w-full min-w-0">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
