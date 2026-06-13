"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { LogoMark } from "@/components/ui/logo-mark"
import { useTranslation } from "@/contexts/TranslationContext"
import { media } from "@/lib/media"

export function AboutHero() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92vh] items-end overflow-hidden bg-charcoal md:min-h-[88vh] md:items-center"
    >
      <motion.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
        <Image
          src={media.cakes.hero}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/75 to-charcoal/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-transparent to-charcoal/40" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-24 pt-32 text-center md:pb-16 md:pt-24">
        <LogoMark size="hero" href={null} className="mx-auto drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)]" />

        <p className="mt-8 font-script text-lg text-antique-gold-light sm:text-xl">crafted with love</p>

        <h1 className="mt-4 font-display text-4xl font-light tracking-[0.12em] text-cream sm:text-5xl md:text-6xl lg:text-7xl">
          {t("aboutAmanda")}
        </h1>

        <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-antique-gold to-transparent" />

        <p className="mx-auto mt-8 max-w-2xl font-serif text-base leading-relaxed text-cream/75 sm:text-lg">
          {t("brandDescription")}
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-gentle-float text-cream/50">
        <ChevronDown className="h-7 w-7" strokeWidth={1.5} />
      </div>
    </section>
  )
}
