"use client"

import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Crown } from "lucide-react"
import Link from "next/link"
import { GradientText } from "./ui/gradient-text"
import { useTranslation } from "@/contexts/TranslationContext"

export function SiteFooter() {
  const { t } = useTranslation()
  
  return (
    <footer className="relative z-20 bg-gradient-to-r from-footer-gradient-light-start to-footer-gradient-light-end py-8 md:py-12 border-t border-gold">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 text-dark-royal-blue">
        <div className="space-y-4">
          <div className="flex items-center">
            <Crown className="h-8 w-8 text-gold drop-shadow-sm -ml-2" />
            <GradientText className="text-3xl md:text-4xl font-bold drop-shadow-lg bg-gradient-to-r from-royal-purple via-dark-royal-purple to-royal-blue">{t("brandName")}</GradientText>
          </div>
          <p className="text-sm">{t("brandDescription")}</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-dark-royal-purple drop-shadow-sm">{t("contactUs")}</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" />
              {t("locatedIn")}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" />
              <Link href="tel:+355693520462" className="hover:underline">
                +355 69 352 0462
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold" />
              <Link href="mailto:pasticeriamanda@gmail.com" className="hover:underline">
                pasticeriamanda@gmail.com
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" />
              {t("hours")}
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-dark-royal-purple drop-shadow-sm">{t("followUs")}</h3>
          <div className="flex gap-4">
            <Link
              href="https://www.instagram.com/pasticeri_amanda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-royal-blue hover:text-gold transition-colors"
            >
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://www.facebook.com/pasticeri_amanda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-royal-blue hover:text-gold transition-colors"
            >
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-dark-royal-blue/80">© 2025 {t("brandName")}. All rights reserved.</p>
            <p className="text-xs text-dark-royal-blue/70">
              Designed by{" "}
              <span className="font-semibold text-dark-royal-purple">Alkeo Gaci</span>
              {" "}+355 69 685 1089
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
