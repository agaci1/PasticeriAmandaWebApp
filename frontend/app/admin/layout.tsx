"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { isAdmin, isAuthenticated } from "@/lib/auth"
import { redirect, usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon, Package2, Home, Utensils, ListOrdered, CheckCircle } from "lucide-react"
import Link from "next/link"
import { GradientText } from "@/components/ui/gradient-text"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [authorized, setAuthorized] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      redirect("/auth/login") // Redirect to login if not authenticated or not admin
    } else {
      setAuthorized(true)
    }
  }, [pathname])

  if (!authorized) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] text-royal-blue">
        <p>Access Denied. Redirecting to login...</p>
      </div>
    )
  }

  const adminNavLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Menu Management", href: "/admin/menu-management", icon: Utensils },
    { name: "Orders", href: "/admin/orders", icon: ListOrdered }, // Link to the new index page
    { name: "Completed Orders", href: "/admin/orders/completed", icon: CheckCircle }, // Keep for direct access if needed, or remove if only via index
  ]

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-bg-white via-bg-light-pink to-bg-light-violet">
      <div className="hidden border-r bg-muted/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold text-royal-blue">
              <Package2 className="h-6 w-6" />
              <GradientText className="text-xl font-bold">Admin Panel</GradientText>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {adminNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-royal-purple ${
                    pathname.startsWith(link.href) ? "bg-muted text-royal-purple font-bold" : "text-royal-blue"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
                <MenuIcon className="h-5 w-5 text-royal-blue" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-white-gold-pink-bg-start">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="/admin/dashboard" className="flex items-center gap-2 text-lg font-semibold text-royal-blue">
                  <Package2 className="h-6 w-6" />
                  <GradientText className="text-xl font-bold">Admin Panel</GradientText>
                </Link>
                {adminNavLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                      pathname.startsWith(link.href)
                        ? "bg-muted text-royal-purple"
                        : "text-royal-blue hover:text-royal-purple"
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <h1 className="font-semibold text-lg text-royal-purple">
            {adminNavLinks.find((link) => pathname.startsWith(link.href))?.name || "Admin Dashboard"}
          </h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">{children}</main>
      </div>
    </div>
  )
}
