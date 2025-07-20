"use client"

import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon, Crown } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { isAuthenticated, isAdmin, clearAuthData } from "@/lib/auth"
import { useEffect, useState } from "react"
import { GradientText } from "./ui/gradient-text"

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [userIsAdmin, setUserIsAdmin] = useState(false)

  useEffect(() => {
    setLoggedIn(isAuthenticated())
    setUserIsAdmin(isAdmin())
  }, [pathname])

  const handleLogout = () => {
    clearAuthData()
    setLoggedIn(false)
    setUserIsAdmin(false)
    router.push("/auth/login")
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Menu", href: "/menu" },
    { name: "Order", href: "/order" },
    {
      name: "Review",
      href: "https://www.google.com/search?q=Pasticeri+Amanda+Saranda+Albania+reviews",
      external: true,
    },
    { name: "Find Us", href: "https://www.google.com/maps/search/Pasticeri+Amanda+Saranda+Albania", external: true },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white-gold-pink-bg-start/80 backdrop-blur-md">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-royal-blue hover:text-royal-purple">
          <Crown className="h-6 w-6 text-gold" />
          <span className="sr-only">Pasticeri Amanda</span>
          <GradientText className="text-xl font-bold">Amanda Pastry Shop</GradientText>
        </Link>
        <nav className="ml-auto hidden md:flex gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors hover:text-royal-purple ${
                pathname === link.href ? "text-royal-purple font-bold" : "text-royal-blue"
              }`}
              target={link.external ? "_blank" : "_self"}
              rel={link.external ? "noopener noreferrer" : ""}
            >
              {link.name}
            </Link>
          ))}
          {loggedIn ? (
            <>
              {userIsAdmin ? (
                <Link
                  href="/admin/orders" // Link to the new admin orders index page
                  className={`transition-colors hover:text-royal-purple ${
                    pathname.startsWith("/admin/orders") ? "text-royal-purple font-bold" : "text-royal-blue"
                  }`}
                >
                  Orders
                </Link>
              ) : (
                <Link
                  href="/order-history" // Link for client's purchase history
                  className={`transition-colors hover:text-royal-purple ${
                    pathname === "/order-history" ? "text-royal-purple font-bold" : "text-royal-blue"
                  }`}
                >
                  Purchase History
                </Link>
              )}
              <Button onClick={handleLogout} variant="ghost" className="text-royal-blue hover:text-royal-purple">
                Logout
              </Button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className={`transition-colors hover:text-royal-purple ${
                pathname === "/auth/login" || pathname === "/auth/signup"
                  ? "text-royal-purple font-bold"
                  : "text-royal-blue"
              }`}
            >
              Log In
            </Link>
          )}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto md:hidden">
              <MenuIcon className="h-6 w-6 text-royal-blue" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-white-gold-pink-bg-start">
            <Link href="/" className="flex items-center gap-2 font-semibold text-royal-blue">
              <Crown className="h-6 w-6 text-gold" />
              <GradientText className="text-xl font-bold">Amanda Pastry Shop</GradientText>
            </Link>
            <nav className="grid gap-2 py-6 text-lg font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                    pathname === link.href ? "bg-muted text-royal-purple" : "text-royal-blue hover:text-royal-purple"
                  }`}
                  target={link.external ? "_blank" : "_self"}
                  rel={link.external ? "noopener noreferrer" : ""}
                >
                  {link.name}
                </Link>
              ))}
              {loggedIn ? (
                <>
                  {userIsAdmin ? (
                    <Link
                      href="/admin/orders" // Link to the new admin orders index page
                      className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                        pathname.startsWith("/admin/orders")
                          ? "bg-muted text-royal-purple"
                          : "text-royal-blue hover:text-royal-purple"
                      }`}
                    >
                      Orders
                    </Link>
                  ) : (
                    <Link
                      href="/order-history" // Link for client's purchase history
                      className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                        pathname === "/order-history"
                          ? "bg-muted text-royal-purple"
                          : "text-royal-blue hover:text-royal-purple"
                      }`}
                    >
                      Purchase History
                    </Link>
                  )}
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-royal-blue hover:text-royal-purple justify-start"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                    pathname === "/auth/login" || pathname === "/auth/signup"
                      ? "bg-muted text-royal-purple"
                      : "text-royal-blue hover:text-royal-purple"
                  }`}
                >
                  Log In
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
