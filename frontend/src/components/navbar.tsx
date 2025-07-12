"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/menu", label: "Menu" },
    { href: "/order", label: "Order" },
    { href: "/contact", label: "Contact" },
    { href: "/reviews", label: "Reviews" },
    { href: "/find-us", label: "Find Us" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm py-4 px-4 md:px-6 flex items-center justify-between">
      <Link
        href="/"
        className="flex items-center gap-2 font-title text-2xl font-bold text-royalPurple hover:text-gold transition-colors"
        prefetch={false}
      >
        <CrownIcon className="h-6 w-6 text-gold" />
        Amanda Pastry Shop
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-lg font-body text-royalBlue hover:text-gold transition-colors relative group",
              pathname === link.href && "font-semibold text-gold",
            )}
            prefetch={false}
          >
            {link.label}
            <span
              className={cn(
                "absolute bottom-0 left-0 w-full h-0.5 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300",
                pathname === link.href && "scale-x-100",
              )}
            />
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon className="h-6 w-6 text-royalPurple" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-white p-6">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xl font-body text-royalBlue hover:text-gold transition-colors",
                  pathname === link.href && "font-semibold text-gold",
                )}
                prefetch={false}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

function CrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 5-1.8 1.8a7.9 7.9 0 0 0-2.9 2.9L5 12l1.8 1.8c.7.7 1.2 1.7 1.4 2.7l.8 3.2h8l.8-3.2c.2-1 .7-2 1.4-2.7L19 12l-1.8-1.8a7.9 7.9 0 0 0-2.9-2.9L12 5Z" />
      <path d="M5 12c0-1.7.7-3.4 2-4.7" />
      <path d="M19 12c0-1.7-.7-3.4-2-4.7" />
      <path d="M12 5v3" />
      <path d="M12 19v-3" />
    </svg>
  )
}
