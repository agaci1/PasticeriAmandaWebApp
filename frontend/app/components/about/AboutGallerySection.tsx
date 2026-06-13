"use client"

import Image from "next/image"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { media } from "@/lib/media"
import { AboutReveal } from "./AboutReveal"

export function AboutGallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const images = media.about.gallery

  return (
    <section className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 vintage-paper opacity-40" />

      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <AboutReveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 font-script text-xl text-antique-gold">The Atelier</p>
          <h2 className="font-display text-4xl font-light text-charcoal md:text-5xl">Inside Our Shop</h2>
          <p className="mt-5 font-serif text-base leading-relaxed text-charcoal/70 md:text-lg">
            A glimpse into the artistry and passion behind every creation at Pastiçeri Amanda.
          </p>
        </AboutReveal>

        <div className="grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[180px] md:grid-cols-3 md:gap-4 md:auto-rows-[200px]">
          {images.map((src, index) => {
            const spanClass = index === 0 ? "row-span-2" : ""

            return (
              <AboutReveal key={src} delay={index * 60} className={spanClass}>
                <button
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className="group relative block h-full w-full overflow-hidden"
                >
                  <Image
                    src={src}
                    alt={`Gallery ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-charcoal/0 transition-colors duration-500 group-hover:bg-charcoal/25" />
                  <div className="absolute inset-0 border border-antique-gold/0 transition-colors duration-500 group-hover:border-antique-gold/50" />
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-charcoal/80 to-transparent p-4 transition-transform duration-500 group-hover:translate-y-0">
                    <span className="font-serif text-xs uppercase tracking-[0.2em] text-cream">View</span>
                  </div>
                </button>
              </AboutReveal>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/92 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            <button
              type="button"
              className="absolute right-5 top-5 z-10 text-cream transition-colors hover:text-antique-gold"
              onClick={() => setSelectedIndex(null)}
              aria-label="Close gallery"
            >
              <X className="h-8 w-8" />
            </button>
            <motion.div
              className="relative max-h-[85vh] w-full max-w-4xl border border-antique-gold/50 shadow-gold-lg"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-square md:aspect-[4/3]">
                <Image
                  src={images[selectedIndex]}
                  alt={`Gallery ${selectedIndex + 1}`}
                  fill
                  className="object-contain bg-charcoal"
                  sizes="90vw"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
