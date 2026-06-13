"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/contexts/TranslationContext"
import { media } from "@/lib/media"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface CategorySlide {
  id: number
  titleKey: string
  descriptionKey: string
  imageUrl: string
  category: string
  menuLink: string
  slideType?: "cakes" | "sweets" | "traditional" | "modern" | "iceCream" | "trending"
}

interface CategoryCarouselProps {
  slides: CategorySlide[]
  className?: string
}

export default function CategoryCarousel({ slides, className = "" }: CategoryCarouselProps) {
  const { t } = useTranslation()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length)

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setCurrentX(e.touches[0].clientX)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) setCurrentX(e.touches[0].clientX)
  }
  const handleTouchEnd = () => {
    if (!isDragging) return
    const diff = startX - currentX
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide()
    setIsDragging(false)
  }
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setCurrentX(e.clientX)
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) setCurrentX(e.clientX)
  }
  const handleMouseUp = () => {
    if (!isDragging) return
    const diff = startX - currentX
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide()
    setIsDragging(false)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [currentSlide, slides.length])

  const getTitle = (slide: CategorySlide) => {
    switch (slide.slideType) {
      case "cakes": return t("exquisiteCakes")
      case "sweets": return t("artisanPastries")
      case "traditional": return t("traditionalDelights")
      case "modern": return t("modernCreations")
      case "iceCream": return t("frozenDelights")
      case "trending": return t("trendingSensations")
      default: return slide.titleKey
    }
  }

  const getButtonLabel = (slide: CategorySlide) => {
    switch (slide.slideType) {
      case "cakes": return t("viewCakes")
      case "sweets": return t("viewSweets")
      case "traditional": return t("viewTraditional")
      case "modern": return t("viewModern")
      case "iceCream": return t("viewIceCream")
      case "trending": return t("viewTrending")
      default: return t("exploreOurMenu")
    }
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={carouselRef}
        className="relative w-full h-[70vh] min-h-[480px] max-h-[800px] cursor-grab active:cursor-grabbing overflow-hidden rounded-sm border border-antique-gold/30 shadow-gold-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {slides.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide
                ? "pointer-events-auto z-10 opacity-100"
                : "pointer-events-none z-0 opacity-0"
            }`}
          >
            <Image src={item.imageUrl} alt={getTitle(item)} fill className="object-cover" priority={index === 0} sizes="100vw" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/30 to-charcoal/80" />
            <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-14 pb-16">
              <h2 className="text-3xl md:text-5xl font-serif text-cream mb-3 animate-fade-in-up">{getTitle(item)}</h2>
              <p className="text-cream/85 font-serif text-lg md:text-xl max-w-xl mb-6 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
                {t(item.descriptionKey as Parameters<typeof t>[0])}
              </p>
              <Button asChild className="btn-luxury w-fit animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                <Link href={item.menuLink}>{getButtonLabel(item)}</Link>
              </Button>
            </div>
          </div>
        ))}

        <button type="button" onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-antique-gold/50 bg-charcoal/40 text-cream hover:bg-antique-gold/20 transition-colors flex items-center justify-center" aria-label="Previous">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button type="button" onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-antique-gold/50 bg-charcoal/40 text-cream hover:bg-antique-gold/20 transition-colors flex items-center justify-center" aria-label="Next">
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-8 bg-antique-gold" : "w-3 bg-cream/40 hover:bg-cream/70"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function useCategorySlides(): CategorySlide[] {
  return [
    { id: 1, titleKey: "cake", descriptionKey: "cakeDescription", imageUrl: media.cakes.hero, category: "cakes", menuLink: "/menu?category=cakes", slideType: "cakes" as const },
    { id: 2, titleKey: "pastries", descriptionKey: "pastriesDescription", imageUrl: media.pastries.sweets, category: "sweets", menuLink: "/menu?category=sweets", slideType: "sweets" as const },
    { id: 3, titleKey: "traditional", descriptionKey: "traditionalDescription", imageUrl: media.traditional.hero, category: "traditional-sweets", menuLink: "/menu?category=traditional-sweets", slideType: "traditional" as const },
    { id: 4, titleKey: "modern", descriptionKey: "modernDescription", imageUrl: media.pastries.rafaello, category: "sweets", menuLink: "/menu?category=sweets", slideType: "modern" as const },
    { id: 5, titleKey: "iceCream", descriptionKey: "iceCreamDescription", imageUrl: media.pastries.cookies, category: "coffees-juices", menuLink: "/menu?category=coffees-juices", slideType: "iceCream" as const },
    { id: 6, titleKey: "trending", descriptionKey: "trendingDescription", imageUrl: media.pastries.dubaiChocolate, category: "crepes-waffles", menuLink: "/menu?category=crepes-waffles", slideType: "trending" as const },
  ]
}
