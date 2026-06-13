"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"
import { media } from "@/lib/media"
import { AboutReveal } from "./AboutReveal"

export function AboutFounder() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-[#F5F1EA] py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <AboutReveal direction="left" className="flex justify-center lg:justify-start">
            <div className="relative">
              <motion.div
                className="absolute -inset-3 rounded-full border border-antique-gold/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative h-72 w-72 overflow-hidden rounded-full border-4 border-antique-gold shadow-gold-lg md:h-80 md:w-80">
                <Image
                  src={media.team.amanda}
                  alt="Amanda Gaci"
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
            </div>
          </AboutReveal>

          <div className="space-y-6">
            <AboutReveal>
              <p className="mb-3 font-script text-xl text-antique-gold">{t("meetOurTeam")}</p>
              <h2 className="font-display text-4xl font-light text-charcoal md:text-5xl">Amanda Gaci</h2>
              <p className="mt-2 font-serif text-sm uppercase tracking-[0.2em] text-antique-gold-dark">
                Founder · Head Pastry Chef · Custom Cake Specialist
              </p>
            </AboutReveal>

            <AboutReveal delay={100}>
              <div className="my-2 h-px w-16 bg-gradient-to-r from-antique-gold to-transparent" />
              <p className="font-serif text-lg leading-relaxed text-charcoal/75">{t("teamDescription")}</p>
            </AboutReveal>

            <AboutReveal delay={180}>
              <p className="font-serif text-base leading-relaxed text-charcoal/70 md:text-lg">
                {t("amandaDescription")}
              </p>
            </AboutReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
