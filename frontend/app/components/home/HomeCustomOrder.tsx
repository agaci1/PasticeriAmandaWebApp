"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { media } from "@/lib/media"
import { useTranslation } from "@/contexts/TranslationContext"

const heading = "var(--font-cormorant), Georgia, serif"
const body = "var(--font-playfair), Georgia, serif"
const script = "var(--font-dancing), cursive"

const cakeSlides = [
  ...media.cakes.gallery,
  media.cakes.hero,
]

const SLIDE_MS = 1600
const FADE_DURATION = 0.65

function CakeSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % cakeSlides.length)
    }, SLIDE_MS)
    return () => clearInterval(id)
  }, [])

  const src = cakeSlides[index]

  return (
    <div
      className="relative flex items-center justify-center rounded-sm border border-[#B8954A]/25 bg-gradient-to-br from-[#EDE6DA] to-[#F8F4ED] p-4 shadow-[0_16px_50px_rgba(28,28,30,0.1)] sm:p-5"
      style={{ minHeight: 380, width: "100%" }}
    >
      <div className="relative flex h-[min(400px,50vh)] w-full items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FADE_DURATION, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Image
              src={src}
              alt={`Custom cake ${index + 1}`}
              width={800}
              height={700}
              className="max-h-[min(380px,48vh)] w-auto max-w-full object-contain"
              sizes="(max-width:1024px) 90vw, 45vw"
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1C1C1E]/10">
        <motion.div
          className="h-full bg-[#B8954A]"
          animate={{ width: `${((index + 1) / cakeSlides.length) * 100}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

export function HomeCustomOrder() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-[#F5F1EA] py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <CakeSlideshow />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center lg:text-left"
        >
          <p className="mb-3 text-xl text-[#B8954A]" style={{ fontFamily: script }}>
            Bespoke
          </p>
          <h2
            className="mb-5 text-3xl font-light leading-tight text-[#1C1C1E] sm:text-4xl md:text-[2.75rem]"
            style={{ fontFamily: heading }}
          >
            Custom Orders Welcome
          </h2>
          <div className="mx-auto mb-6 h-px w-14 bg-gradient-to-r from-[#B8954A] to-transparent lg:mx-0" />
          <p
            className="mb-8 text-base leading-relaxed text-[#1C1C1E]/80 sm:text-lg"
            style={{ fontFamily: body }}
          >
            Dream cakes, celebration platters, and bespoke pastries — share your vision and we will
            create something unforgettable for your most precious moments.
          </p>
          <Button
            asChild
            className="rounded-none border border-[#1C1C1E] bg-[#1C1C1E] px-8 py-3 uppercase tracking-wider text-[#F5F1EA] hover:bg-[#B8954A] hover:border-[#B8954A] hover:text-[#1C1C1E]"
            style={{ fontFamily: body }}
          >
            <Link href="/order">{t("placeCustomOrder")}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
