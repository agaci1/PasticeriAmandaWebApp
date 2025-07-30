"use client"

import Link from "next/link"
import Image from "next/image"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon, Crown, ShoppingCart, Home, Info, Utensils, ClipboardList, Star, MapPin, History, Package2, ListOrdered } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { isAuthenticated, isAdmin, clearAuthData } from "@/lib/auth"
import { useEffect, useState } from "react"
import { GradientText } from "./ui/gradient-text"
import { LanguageSelector } from "./LanguageSelector"
import { useTranslation } from "@/contexts/TranslationContext"

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useTranslation()

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
    { name: t("home"), href: "/", icon: Home },
    { name: t("about"), href: "/about", icon: Info },
    { name: t("menu"), href: "/menu", icon: Utensils },
    { name: t("customOrder"), href: "/order", icon: ClipboardList },
  ]
  
  const externalLinks: { name: string; href: string; icon?: any; external?: boolean }[] = [
    {
      name: t("review"),
      href: "https://www.google.com/search?q=Pasticeri+Amanda+Saranda+Albania+reviews",
      external: true,
      icon: Star,
    },
    { name: t("findUs"), href: "https://www.google.com/maps/search/Pasticeri+Amanda+Saranda+Albania", external: true, icon: MapPin },
  ]

  const adminNavLinks: { name: string; href: string; icon?: any; external?: boolean }[] = [
    { name: t("dashboard"), href: "/admin/dashboard", icon: Package2 },
    { name: t("newOrders"), href: "/admin/orders/new", icon: ClipboardList },
    { name: t("pendingOrders"), href: "/admin/orders/pending", icon: ClipboardList },
    { name: t("completedOrders"), href: "/admin/orders/completed", icon: ClipboardList },
    { name: t("canceledOrders"), href: "/admin/orders/canceled", icon: ClipboardList },
    { name: t("manageCakes"), href: "/admin/menu-management/cakes", icon: Utensils },
    { name: t("manageSweets"), href: "/admin/menu-management/sweets", icon: Utensils },
    { name: t("manageOther"), href: "/admin/menu-management/other", icon: Utensils },
    { name: t("manageFeed"), href: "/admin/feed", icon: ListOrdered },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white-gold-pink-bg-start/80 backdrop-blur-md">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-royal-blue hover:text-royal-purple">
          <Image
            src="/logoAmanda.jpg"
            alt="Pasticeri Amanda Logo"
            width={40}
            height={40}
            className="rounded-full border-2 border-gold shadow-lg"
          />
          <span className="sr-only">Pasticeri Amanda</span>
          <span className="text-lg md:text-xl font-bold leading-tight bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-[0_0_4px_rgba(239,68,68,0.5)]">{t("brandName")}</span>
        </Link>
        <nav className="ml-auto hidden lg:flex gap-6 text-sm font-medium items-center">
          {/* Main navigation links */}
          {(userIsAdmin ? adminNavLinks : loggedIn ? [...userNavLinks, { name: t("cart"), href: "/cart", icon: ShoppingCart }, { name: t("purchaseHistory"), href: "/order-history", icon: History }] : userNavLinks).map((link) => (
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
          
          {/* Language Selector */}
          <LanguageSelector />
          
          {/* Login/Logout */}
          {loggedIn && (
            <Button onClick={handleLogout} variant="ghost" className="text-royal-blue hover:text-royal-purple">
              {t("logout")}
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
              {t("login")}
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
              <Crown className="h-6 w-6 text-gold animate-pulse drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]" />
              <span className="text-lg font-bold leading-tight bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-[0_0_4px_rgba(239,68,68,0.5)]">{t("brandName")}</span>
            </Link>
            
            {/* Language Selector for Mobile */}
            <div className="py-4 border-b border-gold/20">
              <LanguageSelector variant="mobile" />
            </div>
            
            <nav className="grid gap-2 py-6 text-lg font-medium">
              {/* Main navigation links */}
              {(userIsAdmin ? adminNavLinks : loggedIn ? [...userNavLinks, { name: t("cart"), href: "/cart", icon: ShoppingCart }, { name: t("purchaseHistory"), href: "/order-history", icon: History }] : userNavLinks).map((link) => (
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
                  {t("logout")}
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
                  {t("login")}
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
