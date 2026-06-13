"use client"

import Image from "next/image"
import { media } from "@/lib/media"

const marqueeImages = [
  media.cakes.gallery[0],
  media.pastries.sweets,
  media.cakes.gallery[5],
  media.traditional.baklava,
  media.cakes.gallery[9],
  media.pastries.cupcakes,
  media.cakes.gallery[12],
  media.pastries.tarts,
]

export function AboutMarquee() {
  const items = [...marqueeImages, ...marqueeImages]

  return (
    <section className="overflow-hidden border-y border-antique-gold/20 bg-charcoal py-6">
      <div className="flex animate-promo-marquee gap-6 whitespace-nowrap">
        {items.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative h-28 w-44 shrink-0 overflow-hidden border border-antique-gold/20 opacity-80 md:h-32 md:w-52"
          >
            <Image src={src} alt="" fill className="object-cover" sizes="208px" />
            <div className="absolute inset-0 bg-charcoal/20" />
          </div>
        ))}
      </div>
    </section>
  )
}
