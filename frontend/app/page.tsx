"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { AmandaStoryVideo } from "@/app/components/AmandaStoryVideo"
import { HomePromoReel } from "@/app/components/home/HomePromoReel"
import { HomeMainShowcase } from "@/app/components/home/HomeMainShowcase"
import { HomeOfferings } from "@/app/components/home/HomeOfferings"
import { HomeCakeGallery } from "@/app/components/home/HomeCakeGallery"
import { HomeFeaturedMenu } from "@/app/components/home/HomeFeaturedMenu"
import { HomeCustomOrder } from "@/app/components/home/HomeCustomOrder"
import { HomeNews } from "@/app/components/home/HomeNews"
import { useTranslation } from "@/contexts/TranslationContext"
import { ScrollFadeIn } from "@/components/ScrollFadeIn"
import { media, offerItems } from "@/lib/media"
import { ChevronDown } from "lucide-react"

export default function HomePage() {
  const { t } = useTranslation()
  const heroVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return
    video.muted = true
    video.play().catch(() => {})
  }, [])

  return (
    <div className="relative w-full max-w-[100vw] bg-[#F5F1EA]">
      {/* Hero — unchanged */}
      <section className="relative isolate h-[100dvh] min-h-[480px] max-h-[100dvh] w-full overflow-hidden">
        <video
          ref={heroVideoRef}
          src={media.videos.hero}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="pointer-events-none absolute inset-0 h-full max-h-full w-full max-w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70" />

        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-4 pb-[14vh] text-center sm:px-6 sm:pb-[16vh] md:pb-[18vh]">
          <ScrollFadeIn immediate delay={150}>
            <p
              className="mb-2 text-lg uppercase tracking-[0.22em] text-[#F5F0E8] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-xl md:text-2xl"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Pastiçeri Amanda
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn immediate delay={250}>
            <p
              className="mb-2 text-xl text-[#C9A961] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-2xl md:text-3xl"
              style={{ fontFamily: "var(--font-dancing), cursive" }}
            >
              crafted with love
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn immediate delay={400}>
            <p
              className="max-w-md text-[10px] uppercase tracking-[0.25em] text-[#F5F0E8] drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] sm:text-xs md:text-sm"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Saranda, Albania · Est. 2019
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn immediate delay={550}>
            <div className="mt-5 flex w-full max-w-sm flex-col justify-center gap-3 px-2 sm:mt-6 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4">
              <Button
                asChild
                className="w-full rounded-none border border-[#C9A961]/60 bg-[#1C1C1E] px-8 py-3 text-sm uppercase tracking-wider text-[#F5F0E8] transition-all duration-300 hover:bg-[#C9A961] hover:text-[#1C1C1E] sm:w-auto"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                <Link href="/menu">{t("exploreOurMenu")}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full rounded-none border-2 border-[#F5F0E8]/50 bg-transparent px-8 py-3 text-sm uppercase tracking-wider text-[#F5F0E8] hover:bg-[#F5F0E8]/10 sm:w-auto"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                <Link href="/about">{t("aboutUs")}</Link>
              </Button>
            </div>
          </ScrollFadeIn>
        </div>

        <a
          href="#discover"
          className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-[#F5F0E8]/70 transition-colors hover:text-[#C9A961] sm:bottom-5"
          aria-label="Scroll down"
        >
          <span
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Discover
          </span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </section>

      <div id="discover" className="relative z-10">
        <AmandaStoryVideo videoSrc={media.videos.whatWeDo} />
        <HomeMainShowcase />
        <HomePromoReel />
        <HomeOfferings items={[...offerItems]} />
        <HomeCakeGallery />
        <HomeFeaturedMenu />
        <HomeCustomOrder />
        <HomeNews />
      </div>
    </div>
  )
}
