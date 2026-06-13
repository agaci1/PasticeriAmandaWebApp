"use client"

import Link from "next/link"
import OurCreationsCarousel from "@/app/components/OurCreationsCarousel"
import { useTranslation } from "@/contexts/TranslationContext"
import { Button } from "@/components/ui/button"
import { AboutReveal } from "./AboutReveal"

export function AboutCreations() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="absolute inset-0 vintage-paper opacity-50" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-antique-gold/40 to-transparent" />

      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <AboutReveal className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 font-script text-xl text-antique-gold">The Collection</p>
          <h2 className="font-display text-4xl font-light text-antique-gold md:text-5xl">
            {t("ourCreations")}
          </h2>
          <p className="mt-5 font-serif text-base leading-relaxed text-charcoal/70 md:text-lg">
            {t("creationsDescription")}
          </p>
        </AboutReveal>

        <AboutReveal delay={150}>
          <OurCreationsCarousel />
        </AboutReveal>

        <AboutReveal delay={250} className="mt-16 text-center">
          <Button asChild className="btn-luxury">
            <Link href="/menu">{t("exploreOurMenu")}</Link>
          </Button>
        </AboutReveal>
      </div>
    </section>
  )
}
