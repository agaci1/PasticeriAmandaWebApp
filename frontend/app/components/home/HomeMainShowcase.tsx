"use client"

import { useRef } from "react"
import { MediaZoomFrame } from "./MediaZoomFrame"
import { media } from "@/lib/media"
import { useAutoplayVideo } from "@/hooks/use-autoplay-video"

const heading = "var(--font-cormorant), Georgia, serif"
const body = "var(--font-playfair), Georgia, serif"
const script = "var(--font-dancing), cursive"

export function HomeMainShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null)
  useAutoplayVideo(videoRef, [media.videos.mainShowcase], { lazy: true })

  return (
    <section className="relative z-[2] bg-[#F5F1EA] py-14 sm:py-16">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mb-8 text-center">
          <p className="mb-1 text-lg text-[#B8954A]" style={{ fontFamily: script }}>
            Cinematic
          </p>
          <h2
            className="text-2xl font-light text-[#1C1C1E] sm:text-3xl md:text-4xl"
            style={{ fontFamily: heading }}
          >
            The Amanda Experience
          </h2>
        </div>

        <MediaZoomFrame
          className="min-h-[min(70vh,520px)] rounded-sm shadow-[0_24px_80px_rgba(28,28,30,0.12)]"
          scrollZoom={false}
          hoverZoom={false}
        >
          <video
            ref={videoRef}
            src={media.videos.mainShowcase}
            muted
            loop
            playsInline
            preload="none"
            className="max-h-[min(68vh,500px)] w-auto max-w-full object-contain"
          />
        </MediaZoomFrame>

        <p
          className="mt-6 text-center text-xs tracking-[0.3em] uppercase text-[#1C1C1E]/45"
          style={{ fontFamily: body }}
        >
          Saranda · Pastiçeri Amanda
        </p>
      </div>
    </section>
  )
}
