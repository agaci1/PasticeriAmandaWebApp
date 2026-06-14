"use client"

import Link from "next/link"
import Image from "next/image"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon, Home, Info, Utensils, ClipboardList, Star, MapPin, Mail, Package2, ListOrdered } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { isAuthenticated, isAdmin, clearAuthData } from "@/lib/auth"
import { useEffect, useState } from "react"
import { LanguageSelector } from "./LanguageSelector"
import { useTranslation } from "@/contexts/TranslationContext"
import { media } from "@/lib/media"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    setLoggedIn(isAuthenticated())
    setUserIsAdmin(isAdmin())
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleLogout = () => {
    clearAuthData()
    setLoggedIn(false)
    setUserIsAdmin(false)
    setMobileMenuOpen(false)
    router.push("/auth/login")
  }

  const handleNavigation = () => setMobileMenuOpen(false)

  const userNavLinks: { name: string; href: string; icon?: React.ComponentType<{ className?: string }>; external?: boolean }[] = [
    { name: t("home"), href: "/", icon: Home },
    { name: t("about"), href: "/about", icon: Info },
    { name: t("menu"), href: "/menu", icon: Utensils },
    { name: t("customOrder"), href: "/order", icon: ClipboardList },
    { name: t("contactUs"), href: "/contact", icon: Mail },
  ]

  const loggedInUserLinks: { name: string; href: string; icon?: React.ComponentType<{ className?: string }>; external?: boolean }[] = [
    { name: t("purchaseHistory"), href: "/order-history", icon: ListOrdered },
  ]

  const adminNavLinks: { name: string; href: string; icon?: React.ComponentType<{ className?: string }>; external?: boolean }[] = [
    { name: t("dashboard"), href: "/admin/dashboard", icon: Package2 },
    { name: t("newOrders"), href: "/admin/orders/new", icon: ClipboardList },
    { name: t("pendingOrders"), href: "/admin/orders/pending", icon: ClipboardList },
    { name: t("completedOrders"), href: "/admin/orders/completed", icon: ClipboardList },
    { name: t("canceledOrders"), href: "/admin/orders/canceled", icon: ClipboardList },
    { name: t("manageFeed"), href: "/admin/feed", icon: ListOrdered },
  ]

  const getNavLinks = () => {
    if (userIsAdmin) return adminNavLinks
    if (!loggedIn) return userNavLinks
    const customOrderIndex = userNavLinks.findIndex((link) => link.href === "/order")
    const links = [...userNavLinks]
    links.splice(customOrderIndex + 1, 0, ...loggedInUserLinks)
    return links
  }

  const navLinks = getNavLinks()

  const externalLinks = [
    { name: t("review"), href: "https://www.google.com/search?q=Pasticeri+Amanda+Saranda+Albania+reviews", external: true, icon: Star },
    { name: t("findUs"), href: "https://www.google.com/maps/search/Pasticeri+Amanda+Saranda+Albania", external: true, icon: MapPin },
  ]

  const linkClass = (href: string) =>
    cn(
      "transition-all duration-300 font-serif tracking-wide text-sm hover:text-antique-gold relative after:absolute after:bottom-0 after:left-0 after:h-px after:bg-antique-gold after:transition-all after:duration-300",
      pathname === href
        ? "text-antique-gold font-semibold after:w-full"
        : "text-charcoal/80 after:w-0 hover:after:w-full"
    )

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-500 bg-[#F5F0E8]/95 backdrop-blur-md",
        scrolled ? "border-[#C9A961]/30 shadow-sm" : "border-[#C9A961]/20"
      )}
    >
      <div className="container flex h-14 items-center px-4 md:h-16 md:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center transition-opacity hover:opacity-90"
        >
          <Image
            src={media.branding.logoNoBackground}
            alt="Pastiçeri Amanda"
            width={400}
            height={500}
            className="h-auto w-auto max-h-[4.75rem] object-contain drop-shadow-[0_2px_8px_rgba(28,28,30,0.14)] sm:max-h-[5rem] md:max-h-[5.75rem]"
            priority
          />
        </Link>

        <nav className="ml-auto hidden lg:flex gap-6 text-base items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(linkClass(link.href), "flex items-center gap-1")}
              target={link.external ? "_blank" : "_self"}
              rel={link.external ? "noopener noreferrer" : ""}
            >
              {link.icon && <link.icon className="w-4 h-4" />}
              {link.name}
            </Link>
          ))}

          {!userIsAdmin && externalLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(linkClass(link.href), "flex items-center gap-1")}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.icon && <link.icon className="w-4 h-4" />}
              {link.name}
            </Link>
          ))}

          <LanguageSelector />

          {loggedIn ? (
            <Button onClick={handleLogout} variant="ghost" className="text-charcoal hover:text-antique-gold font-serif">
              {t("logout")}
            </Button>
          ) : (
            <Link href="/auth/login" className={linkClass("/auth/login")}>
              {t("login")}
            </Link>
          )}
        </nav>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto lg:hidden">
              <MenuIcon className="h-6 w-6 text-charcoal" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-cream border-antique-gold/30">
            <Link href="/" className="flex items-center mb-6" onClick={handleNavigation}>
              <Image
                src={media.branding.logoNoBackground}
                alt="Pastiçeri Amanda"
                width={400}
                height={500}
                className="h-auto w-auto max-h-24 object-contain drop-shadow-md sm:max-h-28"
              />
            </Link>

            <div className="py-4 border-b border-antique-gold/20">
              <LanguageSelector variant="mobile" />
            </div>

            <nav className="grid gap-1 py-6 font-serif">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-sm px-3 py-2.5 transition-colors",
                    pathname === link.href ? "bg-antique-gold/15 text-antique-gold-dark" : "text-charcoal hover:bg-antique-gold/10"
                  )}
                  target={link.external ? "_blank" : "_self"}
                  rel={link.external ? "noopener noreferrer" : ""}
                  onClick={handleNavigation}
                >
                  {link.icon && <link.icon className="w-5 h-5" />}
                  {link.name}
                </Link>
              ))}

              {!userIsAdmin && externalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-charcoal hover:bg-antique-gold/10 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleNavigation}
                >
                  {link.icon && <link.icon className="w-5 h-5" />}
                  {link.name}
                </Link>
              ))}

              {loggedIn ? (
                <Button onClick={handleLogout} variant="ghost" className="justify-start text-charcoal hover:text-antique-gold font-serif">
                  {t("logout")}
                </Button>
              ) : (
                <Link href="/auth/login" className="flex items-center gap-3 px-3 py-2.5 text-charcoal hover:bg-antique-gold/10" onClick={handleNavigation}>
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
