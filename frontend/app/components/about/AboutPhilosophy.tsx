"use client"

import { useRef } from "react"
import { Sparkles, Heart, Award } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"
import { useAutoplayVideo } from "@/hooks/use-autoplay-video"
import { media } from "@/lib/media"
import { AboutReveal } from "./AboutReveal"

const pillars = [
  { icon: Heart, title: "Passion", textKey: "philosophyDescription1" as const },
  { icon: Sparkles, title: "Artistry", textKey: "philosophyDescription2" as const },
  { icon: Award, title: "Excellence", textKey: "brandDescription" as const },
]

export function AboutPhilosophy() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  useAutoplayVideo(videoRef, [media.videos.birthdayCakeTogether])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const imageX = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"])

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#F5F1EA] py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <AboutReveal className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-3 font-script text-xl text-antique-gold">Our Philosophy</p>
          <h2 className="font-display text-4xl font-light text-charcoal md:text-5xl">{t("ourPhilosophy")}</h2>
          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-antique-gold to-transparent" />
        </AboutReveal>

        <div className="grid items-stretch gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="space-y-6">
            {pillars.map(({ icon: Icon, title, textKey }, i) => (
              <AboutReveal key={title} delay={i * 80}>
                <div className="group relative overflow-hidden border border-antique-gold/20 bg-cream/60 p-8 shadow-vintage transition-colors duration-500 hover:border-antique-gold/45 hover:bg-cream">
                  <div className="relative flex gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-antique-gold/30 bg-antique-gold/10 text-antique-gold-dark">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="mb-3 font-display text-2xl font-light text-charcoal">{title}</h3>
                      <p className="font-serif text-base leading-relaxed text-charcoal/75">{t(textKey)}</p>
                    </div>
                  </div>
                </div>
              </AboutReveal>
            ))}
          </div>

          <AboutReveal direction="right" delay={120}>
            <div className="relative h-full min-h-[420px]">
              <motion.div className="absolute inset-0 overflow-hidden shadow-gold-lg" style={{ x: imageX }}>
                <video
                  ref={videoRef}
                  src={media.videos.birthdayCakeTogether}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="h-full w-full object-cover"
                  aria-label="Let's make a birthday cake together"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-antique-gold/10" />
              </motion.div>
              <div className="pointer-events-none absolute inset-4 border border-antique-gold/25" />
            </div>
          </AboutReveal>
        </div>
      </div>
    </section>
  )
}
