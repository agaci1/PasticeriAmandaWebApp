"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { media } from "@/lib/media"
import { useAutoplayVideo } from "@/hooks/use-autoplay-video"
import { cn } from "@/lib/utils"

const clips = [
  { src: media.videos.mainShowcase, label: "Our Craft" },
  { src: media.videos.whatWeDo, label: "Experience" },
  { src: media.videos.creation01, label: "Handcrafted" },
  { src: media.videos.creation02, label: "Artisan" },
  { src: media.videos.creation03, label: "Fresh Daily" },
  { src: media.videos.promo0603, label: "Pasticeri Amanda" },
  { src: media.videos.promoDesign, label: "Sweet Moments" },
  { src: media.videos.hero, label: "Welcome" },
]

const loopedClips = [...clips, ...clips]

const CARD_W = 280
const CARD_H = 420
const GAP = 28

const heading = "var(--font-cormorant), Georgia, serif"
const body = "var(--font-playfair), Georgia, serif"
const script = "var(--font-dancing), cursive"

function VideoCard({ src, label }: { src: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useAutoplayVideo(videoRef, [src])

  return (
    <figure className="shrink-0" style={{ width: CARD_W }}>
      <div
        className="flex items-center justify-center rounded-sm border border-[#C9A961]/20 bg-[#1a1a1c] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        style={{ width: CARD_W, height: CARD_H }}
      >
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="max-h-full max-w-full object-contain"
          style={{ width: "auto", height: "auto", maxWidth: CARD_W - 24, maxHeight: CARD_H - 24 }}
        />
      </div>
      <figcaption
        className="mt-3 text-center text-[10px] tracking-[0.35em] uppercase text-[#F5F0E8]/55"
        style={{ fontFamily: body }}
      >
        {label}
      </figcaption>
    </figure>
  )
}

export function HomePromoReel() {
  const [paused, setPaused] = useState(false)

  return (
    <section className="relative z-[2] overflow-hidden bg-[#1C1C1E] py-14 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(184,149,74,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#1C1C1E] to-transparent sm:w-24" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-transparent to-[#1C1C1E] sm:w-24" />

      <div className="relative z-10 mx-auto mb-10 max-w-6xl px-5 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-2 text-center text-xl text-[#C9A961] sm:text-2xl"
          style={{ fontFamily: script }}
        >
          Behind the Counter
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="text-center text-3xl font-light tracking-wide text-[#F5F1EA] sm:text-4xl md:text-5xl"
          style={{ fontFamily: heading }}
        >
          Where Magic Happens
        </motion.h2>
      </div>

      <div
        className="relative z-[1] overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className={cn(
            "flex w-max animate-promo-marquee will-change-transform",
            paused && "[animation-play-state:paused]"
          )}
          style={{ gap: GAP }}
        >
          {loopedClips.map((clip, i) => (
            <VideoCard key={`${clip.src}-${i}`} src={clip.src} label={clip.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
