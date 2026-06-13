"use client"

import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/contexts/TranslationContext"
import { media } from "@/lib/media"
import { ScrollFadeIn } from "@/components/ScrollFadeIn"

export function SiteFooter() {
  const { t } = useTranslation()

  return (
    <footer className="relative z-20 bg-charcoal border-t border-antique-gold/30 py-10 md:py-14">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-10 text-cream/90">
        <ScrollFadeIn threshold={0.1} immediate>
          <div className="space-y-4">
            <div className="flex items-center gap-5 sm:gap-6">
              <Image
                src={media.branding.logoNoBackground}
                alt="Pastiçeri Amanda"
                width={400}
                height={500}
                className="h-auto w-auto max-h-[5.5rem] shrink-0 object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)] sm:max-h-24 md:max-h-[6.75rem]"
              />
              <div className="min-w-0">
                <p className="font-serif text-cream text-sm tracking-[0.15em] uppercase sm:text-base md:text-lg">
                  Pastiçeri Amanda
                </p>
                <p className="font-script text-antique-gold text-sm italic sm:text-base">crafted with love</p>
              </div>
            </div>
            <p className="text-sm text-cream/70 font-serif leading-relaxed">{t("brandDescription")}</p>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn threshold={0.1} delay={100} immediate>
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-antique-gold tracking-wider uppercase">
              <Link href="/contact" className="transition-colors hover:text-cream">
                {t("contactUs")}
              </Link>
            </h3>
            <ul className="space-y-3 text-sm font-serif">
              <li className="flex items-center gap-2 text-cream/80">
                <MapPin className="h-4 w-4 text-antique-gold flex-shrink-0" />
                {t("locatedIn")}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-antique-gold flex-shrink-0" />
                <Link href="tel:+355693520462" className="hover:text-antique-gold transition-colors">
                  +355 69 352 0462
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-antique-gold flex-shrink-0" />
                <Link href="mailto:pasticeriamanda@gmail.com" className="hover:text-antique-gold transition-colors">
                  pasticeriamanda@gmail.com
                </Link>
              </li>
              <li className="flex items-center gap-2 text-cream/80">
                <Clock className="h-4 w-4 text-antique-gold flex-shrink-0" />
                {t("hours")}
              </li>
            </ul>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn threshold={0.1} delay={200} immediate>
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-antique-gold tracking-wider uppercase">{t("followUs")}</h3>
            <div className="flex gap-4">
              <Link
                href="https://www.instagram.com/pasticeri_amanda"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/70 hover:text-antique-gold transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://www.facebook.com/pasticeri_amanda"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/70 hover:text-antique-gold transition-all duration-300 hover:scale-110"
              >
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
            <div className="space-y-2 pt-2 border-t border-antique-gold/20">
              <p className="text-xs text-cream/50 font-serif">© 2025 {t("brandName")}. All rights reserved.</p>
              <p className="text-xs text-cream/40 font-serif">
                Designed by{" "}
                <span className="text-antique-gold/80">DTW Code Studio</span>
                {" · "}
                <Link href="tel:+355696851089" className="transition-colors hover:text-antique-gold">
                  +355 69 685 1089
                </Link>
              </p>
              <p className="text-xs font-serif italic tracking-wide text-cream/35">debug the world</p>
            </div>
          </div>
        </ScrollFadeIn>
      </div>
    </footer>
  )
}
