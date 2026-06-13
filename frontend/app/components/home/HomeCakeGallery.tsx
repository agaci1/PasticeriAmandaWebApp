"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { media } from "@/lib/media"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/contexts/TranslationContext"

const heading = "var(--font-cormorant), Georgia, serif"
const body = "var(--font-playfair), Georgia, serif"
const script = "var(--font-dancing), cursive"

const galleryPhotos = [
  ...media.cakes.gallery,
  media.cakes.hero,
  media.pastries.rafaello,
  media.pastries.sweets,
  media.pastries.cupcakes,
  media.pastries.tarts,
  media.pastries.donuts,
  media.pastries.dubaiChocolate,
  media.traditional.baklava,
  media.pastries.cookies,
]

/** Chaotic offsets — cycles for any number of photos */
const chaos = [
  { w: 300, h: 360, y: 0, rotate: -2.5, pad: "p-3" },
  { w: 240, h: 300, y: 56, rotate: 3, pad: "p-2.5" },
  { w: 280, h: 340, y: 12, rotate: -1, pad: "p-3" },
  { w: 220, h: 280, y: 72, rotate: 4.5, pad: "p-2" },
  { w: 320, h: 380, y: 24, rotate: -3, pad: "p-3" },
  { w: 260, h: 320, y: 0, rotate: 2, pad: "p-2.5" },
  { w: 200, h: 260, y: 88, rotate: -4, pad: "p-2" },
  { w: 300, h: 350, y: 40, rotate: 1.5, pad: "p-3" },
  { w: 250, h: 310, y: 8, rotate: -2, pad: "p-2.5" },
  { w: 270, h: 330, y: 64, rotate: 3.5, pad: "p-3" },
]

export function HomeCakeGallery() {
  const { t } = useTranslation()
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: "left" | "right") => {
    const el = trackRef.current
    if (!el) return
    const amount = Math.min(el.clientWidth * 0.75, 520)
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden bg-[#F5F1EA] py-14 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(184,149,74,0.07),transparent_65%)]" />

      <div className="relative z-10 mx-auto mb-8 max-w-6xl px-5 sm:mb-10 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="mb-1 text-lg text-[#B8954A] sm:text-xl" style={{ fontFamily: script }}>
              Gallery
            </p>
            <h2
              className="text-3xl font-light text-[#1C1C1E] sm:text-4xl md:text-[2.75rem]"
              style={{ fontFamily: heading }}
            >
              {t("ourCreations")}
            </h2>
            <p
              className="mt-2 text-sm text-[#1C1C1E]/55 sm:text-base"
              style={{ fontFamily: body }}
            >
              Scroll sideways to explore our work
            </p>
          </motion.div>
          <Button
            asChild
            variant="outline"
            className="shrink-0 rounded-none border-[#1C1C1E]/30 bg-transparent px-6 uppercase tracking-widest text-[#1C1C1E] hover:bg-[#1C1C1E] hover:text-[#F5F1EA]"
            style={{ fontFamily: body }}
          >
            <Link href="/menu">{t("exploreOurMenu")}</Link>
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-12 bg-gradient-to-r from-[#F5F1EA] to-transparent sm:w-20" />
        <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-12 bg-gradient-to-r from-transparent to-[#F5F1EA] sm:w-20" />

        <button
          type="button"
          onClick={() => scrollBy("left")}
          className="absolute left-2 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-[#B8954A]/40 bg-[#F5F1EA]/95 p-2.5 text-[#1C1C1E] shadow-md transition hover:bg-[#1C1C1E] hover:text-[#F5F1EA] sm:left-4 md:flex"
          aria-label="Scroll gallery left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy("right")}
          className="absolute right-2 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-[#B8954A]/40 bg-[#F5F1EA]/95 p-2.5 text-[#1C1C1E] shadow-md transition hover:bg-[#1C1C1E] hover:text-[#F5F1EA] sm:right-4 md:flex"
          aria-label="Scroll gallery right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div
          ref={trackRef}
          className="flex h-[min(480px,58vh)] items-end gap-5 overflow-x-auto overflow-y-visible px-6 pb-6 pt-4 scroll-smooth sm:gap-7 sm:px-10 md:gap-8 md:px-14 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {galleryPhotos.map((src, i) => {
            const c = chaos[i % chaos.length]
            return (
              <motion.figure
                key={`${src}-${i}`}
                initial={{ opacity: 0, y: 32, rotate: c.rotate * 2 }}
                whileInView={{ opacity: 1, y: 0, rotate: c.rotate }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.55, delay: (i % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
                className="relative shrink-0 snap-center cursor-grab active:cursor-grabbing"
                style={{
                  width: c.w,
                  marginBottom: 0,
                  marginTop: c.y,
                  zIndex: i % 3,
                }}
              >
                <div
                  className={`flex h-full min-h-0 items-center justify-center rounded-sm border border-[#B8954A]/25 bg-gradient-to-br from-[#EDE6DA] to-[#F8F4ED] shadow-[0_12px_40px_rgba(28,28,30,0.08)] ${c.pad}`}
                  style={{ minHeight: c.h }}
                >
                  <Image
                    src={src}
                    alt={`Pasticeri Amanda creation ${i + 1}`}
                    width={c.w}
                    height={c.h}
                    className="h-auto max-h-[min(340px,42vh)] w-auto max-w-full object-contain"
                    sizes={`${c.w}px`}
                    draggable={false}
                  />
                </div>
              </motion.figure>
            )
          })}
        </div>
      </div>

      <p
        className="relative z-10 mt-4 text-center text-[10px] tracking-[0.35em] uppercase text-[#1C1C1E]/40"
        style={{ fontFamily: body }}
      >
        ← Drag or scroll →
      </p>
    </section>
  )
}
