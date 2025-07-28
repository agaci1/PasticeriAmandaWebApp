import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { MovingShapes } from "@/components/ui/moving-shapes" // Import MovingShapes
import { TranslationProvider } from "@/contexts/TranslationContext"

const inter = Inter({ subsets: ["latin"] })

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
        url: '/logoAmanda.jpg',
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
    images: ['/logoAmanda.jpg'],
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
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-gradient-to-br from-bg-white via-bg-light-pink to-bg-light-violet text-foreground font-sans antialiased",
          inter.className,
        )}
      >
        <TranslationProvider>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <MovingShapes /> {/* Moved here to be on all pages */}
            <main className="flex-1 relative z-10">{children}</main> {/* Ensure main content is above shapes */}
            <SiteFooter />
          </div>
          <Toaster />
        </TranslationProvider>
      </body>
    </html>
  )
}
