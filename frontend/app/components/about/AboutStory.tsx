"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"
import { useAutoplayVideo } from "@/hooks/use-autoplay-video"
import { media } from "@/lib/media"
import { AboutReveal } from "./AboutReveal"

export function AboutStory() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  useAutoplayVideo(videoRef, [media.videos.logo])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-charcoal py-24 md:py-32">
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #C9A961 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <AboutReveal direction="left">
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-full w-full border border-antique-gold/30" />
              <motion.div
                className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-charcoal shadow-gold-lg"
                style={{ y: imageY, scale: imageScale }}
              >
                <video
                  ref={videoRef}
                  src={media.videos.logo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="h-full w-full object-contain p-6 sm:p-8"
                  aria-label="Pastiçeri Amanda logo"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
              </motion.div>
              <div className="absolute -bottom-6 -right-4 border border-antique-gold/40 bg-charcoal px-6 py-4 shadow-gold">
                <p className="font-display text-3xl font-light text-antique-gold">2019</p>
                <p className="font-serif text-xs uppercase tracking-[0.25em] text-cream/60">Est.</p>
              </div>
            </div>
          </AboutReveal>

          <AboutReveal direction="right" delay={150}>
            <div className="lg:pl-4">
              <p className="mb-3 font-script text-xl text-antique-gold">Since the beginning</p>
              <h2 className="font-display text-4xl font-light text-cream md:text-5xl">
                {t("ourStory")}
              </h2>
              <div className="my-8 h-px w-16 bg-gradient-to-r from-antique-gold to-transparent" />
              <p className="font-serif text-lg leading-[1.9] text-cream/80">{t("ourStoryContent")}</p>
            </div>
          </AboutReveal>
        </div>
      </div>
    </section>
  )
}
