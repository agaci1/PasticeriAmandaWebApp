"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"
import { useAutoplayVideo } from "@/hooks/use-autoplay-video"

interface AmandaStoryVideoProps {
  videoSrc: string
}

const GOLD = "#B8954A"
const CHARCOAL = "#1C1C1E"
const CLAMP = { clamp: true } as const

const headingFont = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif"
const bodyFont = "var(--font-playfair), 'Playfair Display', Georgia, serif"
const accentFont = "var(--font-dancing), cursive"

function StoryTextPanel({
  progress,
  textOpacity,
  textX,
  t,
}: {
  progress: MotionValue<number>
  textOpacity: MotionValue<number>
  textX: MotionValue<number>
  t: (key: Parameters<ReturnType<typeof useTranslation>["t"]>[0]) => string
}) {
  const headingOpacity = useTransform(progress, [0.18, 0.32], [0, 1], CLAMP)
  const lineOpacity = useTransform(progress, [0.22, 0.36], [0, 1], CLAMP)
  const lineScaleX = useTransform(progress, [0.22, 0.38], [0, 1], CLAMP)
  const p1Opacity = useTransform(progress, [0.26, 0.4], [0, 1], CLAMP)
  const p2Opacity = useTransform(progress, [0.3, 0.44], [0, 1], CLAMP)

  return (
    <motion.div
      className="flex min-h-0 min-w-0 flex-col justify-center py-2 pl-0 md:pl-2"
      style={{ opacity: textOpacity, x: textX }}
    >
      <motion.p
        className="mb-3 text-xs tracking-[0.35em] uppercase sm:text-sm"
        style={{ fontFamily: accentFont, color: GOLD, opacity: headingOpacity }}
      >
        Pastiçeri Amanda
      </motion.p>

      <motion.h2
        className="mb-4 text-[1.85rem] font-light leading-[1.12] tracking-wide text-[#1C1C1E] sm:text-3xl md:text-[2.35rem] lg:text-[2.5rem]"
        style={{ fontFamily: headingFont, opacity: headingOpacity }}
      >
        {t("ourStory")}
      </motion.h2>

      <motion.div
        className="mb-5 h-px w-14 origin-left bg-gradient-to-r from-[#B8954A] via-[#D4AF6A] to-transparent"
        style={{ opacity: lineOpacity, scaleX: lineScaleX }}
      />

      <motion.p
        className="mb-4 text-[0.9375rem] leading-[1.85] text-[#1C1C1E]/90 sm:text-[1.05rem] md:text-lg"
        style={{ fontFamily: bodyFont, opacity: p1Opacity }}
      >
        {t("aboutStory")}
      </motion.p>

      <motion.p
        className="text-[0.8125rem] leading-[1.8] text-[#1C1C1E]/75 sm:text-[0.9375rem]"
        style={{ fontFamily: bodyFont, opacity: p2Opacity }}
      >
        {t("philosophyDescription1")}
      </motion.p>
    </motion.div>
  )
}

export function AmandaStoryVideo({ videoSrc }: AmandaStoryVideoProps) {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useAutoplayVideo(videoRef, [videoSrc])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  })

  const progress = scrollYProgress

  const desktopWidths = ["100%", "58%", "58%", "58%"] as const
  const mobileWidths = ["100%", "100%", "100%", "100%"] as const
  const widthRange = isMobile ? mobileWidths : desktopWidths

  const videoColWidth = useTransform(progress, [0, 0.35, 0.5, 1], [...widthRange], CLAMP)

  const desktopTextWidths = ["0%", "40%", "40%", "40%"] as const
  const mobileTextWidths = ["100%", "100%", "100%", "100%"] as const
  const textWidthRange = isMobile ? mobileTextWidths : desktopTextWidths

  const textColWidth = useTransform(progress, [0, 0.35, 0.5, 1], [...textWidthRange], CLAMP)

  const gap = useTransform(progress, [0, 0.35, 0.5, 1], [0, 10, 10, 10], CLAMP)

  const desktopScales = [1.06, 0.96, 0.96, 0.96] as const
  const mobileScales = [1.02, 0.96, 0.96, 0.96] as const
  const scaleRange = isMobile ? mobileScales : desktopScales

  const videoScale = useTransform(progress, [0, 0.35, 0.5, 1], [...scaleRange], CLAMP)

  const textOpacity = useTransform(progress, [0, 0.25, 0.45], [0, 0, 1], CLAMP)
  const textX = useTransform(progress, [0.25, 0.45], [40, 0], CLAMP)
  const scrollHintOpacity = useTransform(progress, [0, 0.2], [1, 0], CLAMP)

  return (
    <section
      ref={sectionRef}
      className="relative m-0 w-full bg-[#F5F1EA] p-0"
      style={{ height: "220vh" }}
      aria-label="Brand story cinematic scroll"
    >
      <div
        key={isMobile ? "story-mobile" : "story-desktop"}
        className="sticky top-0 z-[1] flex h-[100vh] w-full items-center overflow-visible bg-[#F5F1EA]"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(184,149,74,0.05) 0%, transparent 72%)",
          }}
        />

        <motion.div
          className={`mx-auto flex h-full w-full max-w-[min(100%,1680px)] items-center px-5 sm:px-8 md:px-10 lg:px-12 ${
            isMobile ? "flex-col justify-center gap-3 py-6" : "flex-row justify-between"
          }`}
          style={isMobile ? undefined : { gap }}
        >
          <motion.div
            className={`flex min-h-0 shrink-0 items-center overflow-visible ${
              isMobile ? "w-full max-h-[48vh] justify-center" : "h-full justify-end pr-1 md:pr-2"
            }`}
            style={isMobile ? undefined : { width: videoColWidth }}
          >
            <motion.div
              className="flex w-full max-w-full items-center justify-center will-change-transform md:justify-end"
              style={{ scale: videoScale }}
            >
              <div className="rounded-sm border border-[#B8954A]/25 bg-[#1C1C1E]/5 p-1 shadow-[0_16px_50px_rgba(28,28,30,0.1)] sm:p-1.5">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="block h-auto max-h-[min(78vh,760px)] w-auto max-w-full object-contain md:max-h-[min(82vh,820px)]"
                />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className={`min-h-0 ${
              isMobile
                ? "w-full max-h-[40vh] overflow-y-auto px-1"
                : "flex h-full shrink-0 items-center overflow-hidden"
            }`}
            style={
              isMobile
                ? { opacity: textOpacity }
                : { width: textColWidth, opacity: textOpacity }
            }
          >
            <StoryTextPanel progress={progress} textOpacity={textOpacity} textX={textX} t={t} />
          </motion.div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1"
          style={{ opacity: scrollHintOpacity }}
        >
          <span
            className="text-[10px] tracking-[0.4em] uppercase"
            style={{ fontFamily: bodyFont, color: `${CHARCOAL}55` }}
          >
            Scroll
          </span>
          <span className="block h-5 w-px" style={{ backgroundColor: GOLD }} />
        </motion.div>
      </div>
    </section>
  )
}
