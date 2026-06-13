"use client"

import { AboutHero } from "@/app/components/about/AboutHero"
import { AboutIntro } from "@/app/components/about/AboutIntro"
import { AboutMarquee } from "@/app/components/about/AboutMarquee"
import { AboutStory } from "@/app/components/about/AboutStory"
import { AboutPhilosophy } from "@/app/components/about/AboutPhilosophy"
import { AboutGallerySection } from "@/app/components/about/AboutGallerySection"
import { AboutVideoSection } from "@/app/components/about/AboutVideoSection"
import { AboutFounder } from "@/app/components/about/AboutFounder"
import { AboutCreations } from "@/app/components/about/AboutCreations"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <AboutHero />
      <AboutIntro />
      <AboutMarquee />
      <AboutStory />
      <AboutPhilosophy />
      <AboutGallerySection />
      <AboutVideoSection />
      <AboutFounder />
      <AboutCreations />
    </div>
  )
}
