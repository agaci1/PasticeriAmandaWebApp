"use client"

import React, { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import API_BASE from "@/lib/api"
import { isEmbedVideoUrl, resolveFeedMediaUrl } from "@/lib/feed-media"
import { useTranslation } from "@/contexts/TranslationContext"
import { MediaZoomFrame } from "./MediaZoomFrame"

const API_URL = `${API_BASE}/api/feed`
const heading = "var(--font-cormorant), Georgia, serif"
const body = "var(--font-playfair), Georgia, serif"
const script = "var(--font-dancing), cursive"

export function HomeNews() {
  const { t } = useTranslation()
  const [feed, setFeed] = useState<{ type: string; url: string; title: string; description: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setFeed(data)
        setLoading(false)
      })
      .catch(() => {
        setError(t("failedToLoadNews"))
        setLoading(false)
      })
  }, [t])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === feed.length - 1 ? 0 : prev + 1))
  }, [feed.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? feed.length - 1 : prev - 1))
  }, [feed.length])

  useEffect(() => {
    if (feed.length <= 1) return
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [feed.length, nextSlide])

  if (loading) {
    return (
      <section className="py-16 text-center text-[#1C1C1E]/50" style={{ fontFamily: body }}>
        Loading…
      </section>
    )
  }

  if (error || feed.length === 0) return null

  const currentItem = feed[currentIndex]
  const mediaUrl = resolveFeedMediaUrl(currentItem.url)

  return (
    <section className="bg-[#F5F1EA] py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <p className="mb-2 text-lg text-[#B8954A]" style={{ fontFamily: script }}>
            Journal
          </p>
          <h2
            className="text-3xl font-light text-[#1C1C1E] sm:text-4xl"
            style={{ fontFamily: heading }}
          >
            {t("newsSection")}
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#1C1C1E]/65 sm:text-base"
            style={{ fontFamily: body }}
          >
            {t("stayUpdated")}
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45 }}
            >
              <MediaZoomFrame className="min-h-[240px] rounded-sm sm:min-h-[320px]" hoverZoom={false}>
                {currentItem.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl}
                    alt={currentItem.title}
                    className="max-h-[min(55vh,420px)] w-auto max-w-full object-contain"
                  />
                ) : isEmbedVideoUrl(currentItem.url) ? (
                  <iframe
                    src={mediaUrl}
                    title={currentItem.title}
                    className="aspect-video w-full max-w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={mediaUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="max-h-[min(55vh,420px)] w-full max-w-full object-contain"
                  />
                )}
              </MediaZoomFrame>

              <div className="mt-6 text-center">
                <h3
                  className="mb-2 text-xl text-[#1C1C1E] sm:text-2xl"
                  style={{ fontFamily: heading }}
                >
                  {currentItem.title}
                </h3>
                <p className="text-sm text-[#1C1C1E]/70 sm:text-base" style={{ fontFamily: body }}>
                  {currentItem.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {feed.length > 1 && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={prevSlide}
                className="absolute left-0 top-[38%] z-10 h-10 w-10 -translate-x-1/2 rounded-full border-[#B8954A]/40 bg-[#F5F1EA] p-0 hover:bg-[#1C1C1E] hover:text-[#F5F1EA] sm:-translate-x-4"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={nextSlide}
                className="absolute right-0 top-[38%] z-10 h-10 w-10 translate-x-1/2 rounded-full border-[#B8954A]/40 bg-[#F5F1EA] p-0 hover:bg-[#1C1C1E] hover:text-[#F5F1EA] sm:translate-x-4"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              <div className="mt-8 flex justify-center gap-2">
                {feed.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex ? "w-8 bg-[#B8954A]" : "w-1.5 bg-[#1C1C1E]/20"
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
