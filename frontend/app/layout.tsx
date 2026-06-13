import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Dancing_Script, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { ClientBackground } from "@/components/ui/client-background"
import { TranslationProvider } from "@/contexts/TranslationContext"
import { media } from "@/lib/media"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
})
const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dancing",
})
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
  title: "Pasticeri Amanda - Best Pastry Shop in Sarande | Custom Cakes & Pastries",
  description: "Pasticeri Amanda - The finest pastry shop in Sarande, Albania. Custom cakes, traditional pastries, baklava, and sweet treats made with love and the best ingredients. Order online for delivery or pickup.",
  keywords: "pasticeri amanda, pastry shop sarande, cakes sarande, baklava albania, custom cakes, pastries sarande, dessert shop, albanian pastries, wedding cakes, birthday cakes",
  authors: [{ name: "Pasticeri Amanda" }],
  creator: "Pasticeri Amanda",
  publisher: "Pasticeri Amanda",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pasticeriamanda.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Pasticeri Amanda - Best Pastry Shop in Sarande",
    description: "Delicious custom cakes & pastries made with the finest ingredients in Sarande, Albania.",
    url: 'https://pasticeriamanda.com',
    siteName: 'Pasticeri Amanda',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: media.branding.logo,
        width: 1200,
        height: 630,
        alt: 'Pasticeri Amanda - Pastry Shop in Sarande',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Pasticeri Amanda - Best Pastry Shop in Sarande",
    description: "Delicious custom cakes & pastries made with the finest ingredients in Sarande, Albania.",
    images: [media.branding.logo],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add this after setting up Google Search Console
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn(playfair.variable, dancing.variable, inter.variable, cormorant.variable)}>
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-[#F5F0E8] text-[#1C1C1E] antialiased",
        )}
      >
        <TranslationProvider>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div
              className="pointer-events-none fixed inset-0 z-0 overflow-hidden [&_*]:pointer-events-none"
              aria-hidden="true"
            >
              <ClientBackground />
            </div>
            <main className="relative z-10 flex-1 w-full max-w-[100vw]">{children}</main>
            <SiteFooter />
          </div>
          <Toaster />
        </TranslationProvider>
      </body>
    </html>
  )
}
