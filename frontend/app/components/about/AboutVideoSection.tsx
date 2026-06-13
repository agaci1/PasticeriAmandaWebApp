"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { media } from "@/lib/media"
import { AboutReveal } from "./AboutReveal"

const videos = [
  {
    src: media.videos.mainShowcase,
    title: "Our Craft",
    description:
      "Step inside our kitchen and watch how every pastry is shaped by hand — from delicate layers to the final golden finish.",
  },
  {
    src: media.videos.promo0603,
    title: "Fresh Creations",
    description:
      "New flavours and seasonal specials, prepared daily with the finest ingredients and a touch of Amanda's signature style.",
  },
  {
    src: media.videos.creation01,
    title: "Behind the Scenes",
    description:
      "The early-morning rhythm of our shop: mixing, baking, and decorating before the first guest walks through the door.",
  },
  {
    src: media.videos.creation02,
    title: "Artisan Process",
    description:
      "Precision and patience at every stage — see how tradition and modern technique come together in each creation.",
  },
  {
    src: media.videos.creation03,
    title: "Sweet Moments",
    description:
      "Celebrations, smiles, and the joy of sharing something made with heart — moments that make our work worthwhile.",
  },
  {
    src: media.videos.promoDesign,
    title: "Pasticeri Amanda",
    description:
      "Our story in motion: the atmosphere, the artistry, and the passion behind Pastiçeri Amanda in Saranda.",
  },
]

export function AboutVideoSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = videos[activeIndex]

  return (
    <section className="relative overflow-hidden bg-charcoal py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-light/80 to-charcoal" />

      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <AboutReveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 font-script text-xl text-antique-gold">In Motion</p>
          <h2 className="font-display text-4xl font-light text-cream md:text-5xl">Watch Our Craft</h2>
          <p className="mt-5 font-serif text-base leading-relaxed text-cream/65 md:text-lg">
            See the love and precision that goes into every pastry we create.
          </p>
        </AboutReveal>

        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <AboutReveal direction="left">
            <div className="relative overflow-hidden border border-antique-gold/30 shadow-gold-lg">
              <div className="relative aspect-video bg-charcoal-light">
                <video
                  key={active.src}
                  src={active.src}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="pointer-events-none absolute inset-3 border border-antique-gold/15" />
            </div>
          </AboutReveal>

          <AboutReveal direction="right" delay={120}>
            <h3 className="font-display text-3xl font-light text-antique-gold md:text-4xl">{active.title}</h3>
            <div className="my-5 h-px w-12 bg-antique-gold/60" />
            <p className="font-serif text-base leading-relaxed text-cream/75 md:text-lg">{active.description}</p>
          </AboutReveal>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {videos.map((video, index) => (
            <AboutReveal key={video.src} delay={index * 50}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "group relative aspect-video w-full overflow-hidden border transition-all duration-300",
                  activeIndex === index
                    ? "border-antique-gold shadow-gold scale-[1.03]"
                    : "border-antique-gold/20 hover:border-antique-gold/55"
                )}
              >
                <video
                  src={video.src}
                  muted
                  playsInline
                  className="h-full w-full object-cover opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-charcoal/35 transition-colors group-hover:bg-charcoal/15">
                  <Play className="h-5 w-5 text-cream drop-shadow-md" fill="currentColor" />
                </div>
                <span className="absolute bottom-0 left-0 right-0 truncate bg-charcoal/70 px-2 py-1.5 text-[10px] font-serif text-cream sm:text-xs">
                  {video.title}
                </span>
              </button>
            </AboutReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
