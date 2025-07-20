import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { MovingShapes } from "@/components/ui/moving-shapes" // Import MovingShapes

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pasticeri Amanda",
  description: "Delicious custom cakes & pastries made with the finest ingredients.",
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
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <MovingShapes /> {/* Moved here to be on all pages */}
          <main className="flex-1 relative z-10">{children}</main> {/* Ensure main content is above shapes */}
          <SiteFooter />
        </div>
        <Toaster />
      </body>
    </html>
  )
}
