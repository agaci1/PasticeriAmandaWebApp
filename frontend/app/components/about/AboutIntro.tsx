"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"
import { AboutReveal } from "./AboutReveal"

const milestones = [
  { year: "2019", label: "Founded in Saranda" },
  { year: "100%", label: "Handcrafted daily" },
  { year: "∞", label: "Passion in every bite" },
]

export function AboutIntro() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const lineScale = useTransform(scrollYProgress, [0.1, 0.45], [0, 1])

  return (
    <section ref={ref} className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 vintage-paper opacity-60" />
      <div className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-antique-gold/5 blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <AboutReveal>
            <p className="mb-4 font-script text-2xl text-antique-gold md:text-3xl">Pastiçeri Amanda</p>
            <h2 className="font-display text-4xl font-light leading-tight text-charcoal md:text-5xl lg:text-6xl">
              {t("welcomeToAmanda")}
            </h2>
            <motion.div
              className="mt-8 h-px w-full max-w-xs origin-left bg-gradient-to-r from-antique-gold via-antique-gold-light to-transparent"
              style={{ scaleX: lineScale }}
            />
          </AboutReveal>

          <AboutReveal delay={120} direction="right">
            <p className="font-serif text-lg leading-[1.9] text-charcoal/80 md:text-xl">{t("aboutStory")}</p>
          </AboutReveal>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          {milestones.map((item, i) => (
            <AboutReveal key={item.label} delay={i * 100}>
              <div className="group relative overflow-hidden border border-antique-gold/25 bg-cream/80 px-8 py-10 text-center shadow-vintage transition-all duration-500 hover:border-antique-gold/50 hover:shadow-gold">
                <p className="font-display text-4xl font-light text-antique-gold md:text-5xl">{item.year}</p>
                <p className="mt-3 font-serif text-sm uppercase tracking-[0.2em] text-charcoal/60">{item.label}</p>
              </div>
            </AboutReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
