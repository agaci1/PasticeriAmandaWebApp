"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { MediaZoomFrame } from "./MediaZoomFrame"
import type { OfferItem } from "@/app/components/WhatWeOffer"
import { cn } from "@/lib/utils"

const heading = "var(--font-cormorant), Georgia, serif"
const body = "var(--font-playfair), Georgia, serif"
const script = "var(--font-dancing), cursive"

interface HomeOfferingsProps {
  items: OfferItem[]
}

export function HomeOfferings({ items }: HomeOfferingsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "")

  const active = items.find((i) => i.id === activeId) ?? items[0]

  return (
    <section className="relative overflow-hidden bg-[#F5F1EA] py-16 sm:py-24">
      <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#B8954A]/8 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.75 }}
          className="mb-12 text-center md:mb-16"
        >
          <p className="mb-2 text-xl text-[#B8954A] sm:text-2xl" style={{ fontFamily: script }}>
            Our Offerings
          </p>
          <h2
            className="text-3xl font-light tracking-wide text-[#1C1C1E] sm:text-4xl md:text-5xl"
            style={{ fontFamily: heading }}
          >
            Everything We Create
          </h2>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <MediaZoomFrame
                className="min-h-[280px] rounded-sm sm:min-h-[360px] lg:min-h-[420px]"
                scrollZoom
              >
                {active.image && (
                  <Image
                    src={active.image}
                    alt={active.title}
                    width={900}
                    height={700}
                    className="max-h-[min(52vh,380px)] w-auto max-w-full object-contain lg:max-h-[400px]"
                    sizes="(max-width: 1024px) 90vw, 50vw"
                    priority
                  />
                )}
              </MediaZoomFrame>
            </motion.div>
          </AnimatePresence>

          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <h3
                  className="mb-4 text-3xl font-light text-[#1C1C1E] sm:text-4xl"
                  style={{ fontFamily: heading }}
                >
                  {active.title}
                </h3>
                <div className="mb-5 h-px w-16 bg-gradient-to-r from-[#B8954A] to-transparent" />
                <p
                  className="mb-4 text-base leading-relaxed text-[#1C1C1E]/85 sm:text-lg"
                  style={{ fontFamily: body }}
                >
                  {active.shortDescription}
                </p>
                <p
                  className="text-sm leading-relaxed text-[#1C1C1E]/65 sm:text-base"
                  style={{ fontFamily: body }}
                >
                  {active.fullDescription}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {items.map((item, index) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs tracking-wide transition-colors sm:px-4 sm:py-2 sm:text-sm",
                    activeId === item.id
                      ? "border-[#B8954A] bg-[#1C1C1E] text-[#F5F1EA]"
                      : "border-[#B8954A]/35 bg-transparent text-[#1C1C1E]/75 hover:border-[#B8954A]/70"
                  )}
                  style={{ fontFamily: body }}
                >
                  {item.title}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
