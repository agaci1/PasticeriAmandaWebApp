"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { isAdmin, isAuthenticated } from "@/lib/auth"
import { redirect, usePathname, useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon, Package2, Home, Utensils, ListOrdered, CheckCircle, ChevronRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import { GradientText } from "@/components/ui/gradient-text"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [authorized, setAuthorized] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [ordersOpen, setOrdersOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      redirect("/auth/login")
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

  // Determine current page title based on pathname
  let pageTitle = "Admin Panel"
  if (pathname.startsWith("/admin/menu-management/cakes")) pageTitle = "Cakes"
  else if (pathname.startsWith("/admin/menu-management/sweets")) pageTitle = "Sweets"
  else if (pathname.startsWith("/admin/menu-management/other")) pageTitle = "Other"
  else if (pathname.startsWith("/admin/menu-management")) pageTitle = "Menu Management"
  else if (pathname.startsWith("/admin/orders/new")) pageTitle = "New Orders"
  else if (pathname.startsWith("/admin/orders/pending")) pageTitle = "Pending Orders"
  else if (pathname.startsWith("/admin/orders/completed")) pageTitle = "Completed Orders"
  else if (pathname.startsWith("/admin/orders")) pageTitle = "Orders"

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-bg-white via-bg-light-pink to-bg-light-violet">
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
            <MenuIcon className="h-6 w-6 text-royal-blue" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] bg-gradient-to-br from-bg-white via-bg-light-pink to-bg-light-violet">
          <div className="flex h-full flex-col gap-2">
            <div className="flex h-[60px] items-center border-b px-6">
              <div className="flex items-center gap-2 font-semibold text-royal-blue">
                <Package2 className="h-6 w-6" />
                <GradientText className="text-xl font-bold">Admin Panel</GradientText>
              </div>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium gap-2">
                {/* Manage Orders Section */}
                <button
                  className="flex items-center w-full gap-2 px-2 py-2 rounded-lg hover:bg-gold/10 transition-colors text-royal-purple font-semibold"
                  onClick={() => setOrdersOpen((open) => !open)}
                  aria-expanded={ordersOpen}
                >
                  {ordersOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  Manage Orders
                </button>
                {ordersOpen && (
                  <div className="ml-6 flex flex-col gap-1">
                    <button
                      className={`text-left px-2 py-1 rounded hover:bg-gold/10 transition-colors ${pathname === "/admin/orders/new" ? "font-bold text-royal-blue" : "text-royal-purple"}`}
                      onClick={() => router.push("/admin/orders/new")}
                    >
                      New Orders
                    </button>
                    <button
                      className={`text-left px-2 py-1 rounded hover:bg-gold/10 transition-colors ${pathname === "/admin/orders/pending" ? "font-bold text-royal-blue" : "text-royal-purple"}`}
                      onClick={() => router.push("/admin/orders/pending")}
                    >
                      Pending Orders
                    </button>
                    <button
                      className={`text-left px-2 py-1 rounded hover:bg-gold/10 transition-colors ${pathname === "/admin/orders/completed" ? "font-bold text-royal-blue" : "text-royal-purple"}`}
                      onClick={() => router.push("/admin/orders/completed")}
                    >
                      Completed Orders
                    </button>
                    <button
                      className={`text-left px-2 py-1 rounded hover:bg-gold/10 transition-colors ${pathname === "/admin/orders/canceled" ? "font-bold text-royal-blue" : "text-royal-purple"}`}
                      onClick={() => router.push("/admin/orders/canceled")}
                    >
                      Canceled Orders
                    </button>
                  </div>
                )}
                {/* Manage Menu Section */}
                <button
                  className="flex items-center w-full gap-2 px-2 py-2 rounded-lg hover:bg-gold/10 transition-colors text-royal-purple font-semibold mt-2"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-expanded={menuOpen}
                >
                  {menuOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  Manage Menu
                </button>
                {menuOpen && (
                  <div className="ml-6 flex flex-col gap-1">
                    <button
                      className={`text-left px-2 py-1 rounded hover:bg-gold/10 transition-colors ${pathname === "/admin/menu-management/cakes" ? "font-bold text-royal-blue" : "text-royal-purple"}`}
                      onClick={() => router.push("/admin/menu-management/cakes")}
                    >
                      Cakes
                    </button>
                    <button
                      className={`text-left px-2 py-1 rounded hover:bg-gold/10 transition-colors ${pathname === "/admin/menu-management/sweets" ? "font-bold text-royal-blue" : "text-royal-purple"}`}
                      onClick={() => router.push("/admin/menu-management/sweets")}
                    >
                      Sweets
                    </button>
                    <button
                      className={`text-left px-2 py-1 rounded hover:bg-gold/10 transition-colors ${pathname === "/admin/menu-management/other" ? "font-bold text-royal-blue" : "text-royal-purple"}`}
                      onClick={() => router.push("/admin/menu-management/other")}
                    >
                      Other
                    </button>
                  </div>
                )}
                {/* Manage Feed Section */}
                <button
                  className="flex items-center w-full gap-2 px-2 py-2 rounded-lg hover:bg-gold/10 transition-colors text-royal-purple font-semibold mt-2"
                  onClick={() => router.push("/admin/feed")}
                >
                  <ListOrdered className="h-4 w-4" />
                  Manage Feed
                </button>
              </nav>
            </div>
            <div className="px-6 pb-4 mt-auto">
              <Link href="/auth/login" className="text-royal-purple hover:text-royal-blue font-semibold">Logout</Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <div className="flex items-center gap-2 font-semibold text-royal-blue">
              <Package2 className="h-6 w-6" />
              <GradientText className="text-xl font-bold">Admin Panel</GradientText>
            </div>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium gap-2">
              {/* Manage Orders Section */}
              <button
                className="flex items-center w-full gap-2 px-2 py-2 rounded-lg hover:bg-gold/10 transition-colors text-royal-purple font-semibold"
                onClick={() => setOrdersOpen((open) => !open)}
                aria-expanded={ordersOpen}
              >
                {ordersOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                Manage Orders
              </button>
              {ordersOpen && (
                <div className="ml-6 flex flex-col gap-1">
                  <button
                    className={`text-left px-2 py-1 rounded hover:bg-gold/10 transition-colors ${pathname === "/admin/orders/new" ? "font-bold text-royal-blue" : "text-royal-purple"}`}
                    onClick={() => router.push("/admin/orders/new")}
                  >
                    New Orders
                  </button>
                  <button
                    className={`text-left px-2 py-1 rounded hover:bg-gold/10 transition-colors ${pathname === "/admin/orders/pending" ? "font-bold text-royal-blue" : "text-royal-purple"}`}
                    onClick={() => router.push("/admin/orders/pending")}
                  >
                    Pending Orders
                  </button>
                  <button
                    className={`text-left px-2 py-1 rounded hover:bg-gold/10 transition-colors ${pathname === "/admin/orders/completed" ? "font-bold text-royal-blue" : "text-royal-purple"}`}
                    onClick={() => router.push("/admin/orders/completed")}
                  >
                    Completed Orders
                  </button>
                  <button
                    className={`text-left px-2 py-1 rounded hover:bg-gold/10 transition-colors ${pathname === "/admin/orders/canceled" ? "font-bold text-royal-blue" : "text-royal-purple"}`}
                    onClick={() => router.push("/admin/orders/canceled")}
                  >
                    Canceled Orders
                  </button>
                </div>
              )}
              {/* Manage Menu Section */}
              <button
                className="flex items-center w-full gap-2 px-2 py-2 rounded-lg hover:bg-gold/10 transition-colors text-royal-purple font-semibold mt-2"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                Manage Menu
              </button>
              {menuOpen && (
                <div className="ml-6 flex flex-col gap-1">
                  <button
                    className={`text-left px-2 py-1 rounded hover:bg-gold/10 transition-colors ${pathname === "/admin/menu-management/cakes" ? "font-bold text-royal-blue" : "text-royal-purple"}`}
                    onClick={() => router.push("/admin/menu-management/cakes")}
                  >
                    Cakes
                  </button>
                  <button
                    className={`text-left px-2 py-1 rounded hover:bg-gold/10 transition-colors ${pathname === "/admin/menu-management/sweets" ? "font-bold text-royal-blue" : "text-royal-purple"}`}
                    onClick={() => router.push("/admin/menu-management/sweets")}
                  >
                    Sweets
                  </button>
                  <button
                    className={`text-left px-2 py-1 rounded hover:bg-gold/10 transition-colors ${pathname === "/admin/menu-management/other" ? "font-bold text-royal-blue" : "text-royal-purple"}`}
                    onClick={() => router.push("/admin/menu-management/other")}
                  >
                    Other
                  </button>
                </div>
              )}
              {/* Manage Feed Section */}
              <button
                className="flex items-center w-full gap-2 px-2 py-2 rounded-lg hover:bg-gold/10 transition-colors text-royal-purple font-semibold mt-2"
                onClick={() => router.push("/admin/feed")}
              >
                <ListOrdered className="h-4 w-4" />
                Manage Feed
              </button>
            </nav>
          </div>
          <div className="px-6 pb-4 mt-auto">
            <Link href="/auth/login" className="text-royal-purple hover:text-royal-blue font-semibold">Logout</Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex flex-col items-center justify-center py-6 px-6 lg:pt-6 pt-20">
          <div
            className="rounded-full bg-white-gold-pink-bg-start px-8 py-3 text-xl lg:text-2xl font-bold text-royal-purple shadow-md cursor-pointer transition-all hover:scale-105"
            onClick={() => router.push("/admin/dashboard")}
          >
            {pageTitle}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">{children}</main>
      </div>
    </div>
  )
}
