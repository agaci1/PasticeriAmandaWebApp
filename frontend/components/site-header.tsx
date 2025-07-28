"use client"

import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon, Crown, ShoppingCart, Home, Info, Utensils, ClipboardList, Star, MapPin, History, Package2, ListOrdered } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { isAuthenticated, isAdmin, clearAuthData } from "@/lib/auth"
import { useEffect, useState } from "react"
import { GradientText } from "./ui/gradient-text"

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setLoggedIn(isAuthenticated())
    setUserIsAdmin(isAdmin())
  }, [pathname])

  const handleLogout = () => {
    clearAuthData()
    setLoggedIn(false)
    setUserIsAdmin(false)
    setMobileMenuOpen(false)
    router.push("/auth/login")
  }

  const handleNavigation = () => {
    setMobileMenuOpen(false)
  }

  const userNavLinks: { name: string; href: string; icon?: any; external?: boolean }[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Info },
    { name: "Menu", href: "/menu", icon: Utensils },
    { name: "Custom Order", href: "/order", icon: ClipboardList },
  ]
  
  const externalLinks: { name: string; href: string; icon?: any; external?: boolean }[] = [
    {
      name: "Review",
      href: "https://www.google.com/search?q=Pasticeri+Amanda+Saranda+Albania+reviews",
      external: true,
      icon: Star,
    },
    { name: "Find Us", href: "https://www.google.com/maps/search/Pasticeri+Amanda+Saranda+Albania", external: true, icon: MapPin },
  ]

  const adminNavLinks: { name: string; href: string; icon?: any; external?: boolean }[] = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Package2 },
    { name: "New Orders", href: "/admin/orders/new", icon: ClipboardList },
    { name: "Pending Orders", href: "/admin/orders/pending", icon: ClipboardList },
    { name: "Completed Orders", href: "/admin/orders/completed", icon: ClipboardList },
    { name: "Canceled Orders", href: "/admin/orders/canceled", icon: ClipboardList },
    { name: "Manage Cakes", href: "/admin/menu-management/cakes", icon: Utensils },
    { name: "Manage Sweets", href: "/admin/menu-management/sweets", icon: Utensils },
    { name: "Manage Other", href: "/admin/menu-management/other", icon: Utensils },
    { name: "Manage Feed", href: "/admin/feed", icon: ListOrdered },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white-gold-pink-bg-start/80 backdrop-blur-md">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-royal-blue hover:text-royal-purple">
          <Crown className="h-6 w-6 text-gold" />
          <span className="sr-only">Pasticeri Amanda</span>
          <GradientText className="text-xl font-bold">Amanda Pastry Shop</GradientText>
        </Link>
        <nav className="ml-auto hidden lg:flex gap-6 text-sm font-medium items-center">
          {/* Main navigation links */}
          {(userIsAdmin ? adminNavLinks : loggedIn ? [...userNavLinks, { name: "Cart", href: "/cart", icon: ShoppingCart }, { name: "Purchase History", href: "/order-history", icon: History }] : userNavLinks).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors hover:text-royal-purple ${
                pathname === link.href ? "text-royal-purple font-bold" : "text-royal-blue"
              } flex items-center`}
              target={link.external ? "_blank" : "_self"}
              rel={link.external ? "noopener noreferrer" : ""}
            >
              {link.icon && <link.icon className="w-5 h-5 mr-1" />}
              {link.name}
            </Link>
          ))}
          
          {/* External links (Review, Find Us) */}
          {!userIsAdmin && externalLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors hover:text-royal-purple ${
                pathname === link.href ? "text-royal-purple font-bold" : "text-royal-blue"
              } flex items-center`}
              target={link.external ? "_blank" : "_self"}
              rel={link.external ? "noopener noreferrer" : ""}
            >
              {link.icon && <link.icon className="w-5 h-5 mr-1" />}
              {link.name}
            </Link>
          ))}
          
          {/* Login/Logout */}
          {loggedIn && (
            <Button onClick={handleLogout} variant="ghost" className="text-royal-blue hover:text-royal-purple">
              Logout
            </Button>
          )}
          {!loggedIn && (
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
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto lg:hidden">
              <MenuIcon className="h-6 w-6 text-royal-blue" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-gradient-to-br from-white-gold-pink-bg-start to-white-gold-pink-bg-end">
            <Link href="/" className="flex items-center gap-2 font-semibold text-royal-blue" onClick={handleNavigation}>
              <Crown className="h-6 w-6 text-gold" />
              <GradientText className="text-xl font-bold">Amanda Pastry Shop</GradientText>
            </Link>
            <nav className="grid gap-2 py-6 text-lg font-medium">
              {/* Main navigation links */}
              {(userIsAdmin ? adminNavLinks : loggedIn ? [...userNavLinks, { name: "Cart", href: "/cart", icon: ShoppingCart }, { name: "Purchase History", href: "/order-history", icon: History }] : userNavLinks).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                    pathname === link.href ? "bg-muted text-royal-purple" : "text-royal-blue hover:text-royal-purple"
                  }`}
                  target={link.external ? "_blank" : "_self"}
                  rel={link.external ? "noopener noreferrer" : ""}
                  onClick={handleNavigation}
                >
                  {link.icon && <link.icon className="w-5 h-5 mr-1" />}
                  {link.name}
                </Link>
              ))}
              
              {/* External links (Review, Find Us) */}
              {!userIsAdmin && externalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                    pathname === link.href ? "bg-muted text-royal-purple" : "text-royal-blue hover:text-royal-purple"
                  }`}
                  target={link.external ? "_blank" : "_self"}
                  rel={link.external ? "noopener noreferrer" : ""}
                  onClick={handleNavigation}
                >
                  {link.icon && <link.icon className="w-5 h-5 mr-1" />}
                  {link.name}
                </Link>
              ))}
              
              {/* Login/Logout */}
              {loggedIn && (
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-royal-blue hover:text-royal-purple justify-start"
                >
                  Logout
                </Button>
              )}
              {!loggedIn && (
                <Link
                  href="/auth/login"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                    pathname === "/auth/login" || pathname === "/auth/signup"
                      ? "bg-muted text-royal-purple"
                      : "text-royal-blue hover:text-royal-purple"
                  }`}
                  onClick={handleNavigation}
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
