"use client"

import { useRef } from "react"
import { useTranslation } from "@/contexts/TranslationContext"
import { useAutoplayVideo } from "@/hooks/use-autoplay-video"

interface AmandaStoryVideoProps {
  videoSrc: string
}

const GOLD = "#B8954A"
const headingFont = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif"
const bodyFont = "var(--font-playfair), 'Playfair Display', Georgia, serif"
const accentFont = "var(--font-dancing), cursive"

export function AmandaStoryVideo({ videoSrc }: AmandaStoryVideoProps) {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)

  useAutoplayVideo(videoRef, [videoSrc], { lazy: true })

  return (
    <section
      className="relative w-full bg-[#F5F1EA] py-12 sm:py-16 md:py-20"
      aria-label="Brand story"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(184,149,74,0.05) 0%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-[min(100%,1680px)] flex-col gap-10 px-5 sm:gap-12 sm:px-8 md:flex-row md:items-center md:gap-14 lg:gap-16 md:px-10 lg:px-12">
        <div className="flex w-full shrink-0 items-center justify-center md:w-[52%] lg:w-[55%]">
          <div className="rounded-sm border border-[#B8954A]/25 bg-[#1C1C1E]/5 p-1 shadow-[0_16px_50px_rgba(28,28,30,0.1)] sm:p-1.5">
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              preload="none"
              className="block h-auto max-h-[min(42vh,380px)] w-auto max-w-full object-contain sm:max-h-[min(48vh,440px)] md:max-h-[min(60vh,520px)]"
              aria-label="Pastiçeri Amanda"
            />
          </div>
        </div>

        <div className="w-full md:flex-1 md:pl-2">
          <p
            className="mb-3 text-xs tracking-[0.35em] uppercase sm:text-sm"
            style={{ fontFamily: accentFont, color: GOLD }}
          >
            Pastiçeri Amanda
          </p>

          <h2
            className="mb-4 text-[1.85rem] font-light leading-[1.12] tracking-wide text-[#1C1C1E] sm:text-3xl md:text-[2.35rem] lg:text-[2.5rem]"
            style={{ fontFamily: headingFont }}
          >
            {t("ourStory")}
          </h2>

          <div className="mb-5 h-px w-14 bg-gradient-to-r from-[#B8954A] via-[#D4AF6A] to-transparent" />

          <p
            className="mb-4 text-[0.9375rem] leading-[1.85] text-[#1C1C1E]/90 sm:text-[1.05rem] md:text-lg"
            style={{ fontFamily: bodyFont }}
          >
            {t("aboutStory")}
          </p>

          <p
            className="text-[0.8125rem] leading-[1.8] text-[#1C1C1E]/75 sm:text-[0.9375rem]"
            style={{ fontFamily: bodyFont }}
          >
            {t("philosophyDescription1")}
          </p>
        </div>
      </div>
    </section>
  )
}
