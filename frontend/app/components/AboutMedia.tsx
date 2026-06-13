"use client"

import Image from "next/image"
import { useState } from "react"
import { ScrollFadeIn } from "@/components/ScrollFadeIn"
import { media } from "@/lib/media"
import { cn } from "@/lib/utils"
import { Play, X } from "lucide-react"

export function AboutGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {media.about.gallery.map((src, index) => (
          <ScrollFadeIn key={src} threshold={0.15} delay={index * 80} direction="up">
            <button
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="group relative aspect-square w-full overflow-hidden rounded-sm border-2 border-antique-gold/30 shadow-vintage transition-all duration-500 hover:border-antique-gold hover:shadow-gold hover:scale-[1.02]"
            >
              <Image
                src={src}
                alt={`Pastry shop gallery ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-charcoal/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-cream text-xs font-serif tracking-wider uppercase">View</span>
              </div>
            </button>
          </ScrollFadeIn>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 backdrop-blur-sm animate-fade-in p-4"
          onClick={() => setSelectedIndex(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelectedIndex(null)}
          role="dialog"
          aria-modal
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-cream hover:text-antique-gold transition-colors z-10"
            onClick={() => setSelectedIndex(null)}
            aria-label="Close gallery"
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="relative max-w-4xl max-h-[85vh] w-full aspect-square md:aspect-auto md:h-[80vh] border-2 border-antique-gold shadow-gold-lg animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={media.about.gallery[selectedIndex]}
              alt={`Gallery image ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </>
  )
}

interface VideoShowcaseProps {
  className?: string
}

export function VideoShowcase({ className }: VideoShowcaseProps) {
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

  const [activeIndex, setActiveIndex] = useState(0)
  const active = videos[activeIndex]

  return (
    <div className={cn("space-y-8", className)}>
      <ScrollFadeIn threshold={0.2}>
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
          <div className="relative aspect-video w-full overflow-hidden rounded-sm border-2 border-antique-gold/50 shadow-gold-lg bg-charcoal order-1">
            <video
              key={active.src}
              src={active.src}
              controls
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4 order-2 text-left">
            <h3 className="text-2xl md:text-3xl luxury-script text-antique-gold">{active.title}</h3>
            <p className="luxury-body text-base md:text-lg leading-relaxed">{active.description}</p>
            <p className="text-charcoal/50 text-sm font-serif tracking-wider uppercase">
              Select a clip below to explore more
            </p>
          </div>
        </div>
      </ScrollFadeIn>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {videos.map((video, index) => (
          <ScrollFadeIn key={video.src} threshold={0.1} delay={index * 60}>
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative aspect-video w-full overflow-hidden rounded-sm border-2 transition-all duration-300 group",
                activeIndex === index
                  ? "border-antique-gold shadow-gold scale-105"
                  : "border-antique-gold/20 hover:border-antique-gold/60"
              )}
            >
              <video
                src={video.src}
                muted
                playsInline
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-charcoal/30 group-hover:bg-charcoal/10 transition-colors">
                <Play className="w-6 h-6 text-cream drop-shadow-lg" fill="currentColor" />
              </div>
              <span className="absolute bottom-0 left-0 right-0 p-1.5 text-[10px] md:text-xs text-cream font-serif bg-charcoal/60 truncate">
                {video.title}
              </span>
            </button>
          </ScrollFadeIn>
        ))}
      </div>
    </div>
  )
}
