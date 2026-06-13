"use client"

import { useState } from "react"
import Image from "next/image"
import { ScrollFadeIn } from "@/components/ScrollFadeIn"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface OfferItem {
  id: string
  title: string
  shortDescription: string
  fullDescription: string
  image?: string
}

interface WhatWeOfferProps {
  items: OfferItem[]
}

const serif = "var(--font-playfair), Georgia, serif"
const script = "var(--font-dancing), cursive"

export function WhatWeOffer({ items }: WhatWeOfferProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 md:px-8 bg-[#F5F0E8] w-full overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        <ScrollFadeIn threshold={0.15}>
          <div className="text-center mb-10 sm:mb-14 px-2">
            <p className="text-[#C9A961] text-xl sm:text-2xl md:text-3xl mb-2" style={{ fontFamily: script }}>
              Our Offerings
            </p>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-[#1C1C1E] tracking-wide"
              style={{ fontFamily: serif }}
            >
              Everything We Create
            </h2>
          </div>
        </ScrollFadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {items.map((item, index) => {
            const isExpanded = expandedId === item.id
            return (
              <ScrollFadeIn key={item.id} threshold={0.08} delay={index * 50} direction="up">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className={cn(
                    "w-full text-left group relative overflow-hidden rounded-sm border transition-all duration-500",
                    isExpanded
                      ? "border-[#C9A961] bg-[#1C1C1E] shadow-lg"
                      : "border-[#C9A961]/25 bg-[#E8DFD0]/50 hover:border-[#C9A961]/60 hover:shadow-md"
                  )}
                >
                  {item.image && (
                    <div className="relative h-32 sm:h-36 w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className={cn(
                          "object-cover transition-transform duration-700",
                          isExpanded ? "scale-105 opacity-60" : "group-hover:scale-110"
                        )}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div
                        className={cn(
                          "absolute inset-0 transition-colors duration-500",
                          isExpanded ? "bg-[#1C1C1E]/70" : "bg-[#1C1C1E]/20 group-hover:bg-[#1C1C1E]/30"
                        )}
                      />
                    </div>
                  )}

                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className={cn(
                          "text-base sm:text-lg md:text-xl tracking-wide transition-colors duration-300",
                          isExpanded ? "text-[#C9A961]" : "text-[#1C1C1E]"
                        )}
                        style={{ fontFamily: serif }}
                      >
                        {item.title}
                      </h3>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 flex-shrink-0 transition-all duration-500",
                          isExpanded ? "rotate-180 text-[#C9A961]" : "text-[#1C1C1E]/40 group-hover:text-[#C9A961]"
                        )}
                      />
                    </div>

                    <p
                      className={cn(
                        "mt-2 text-sm leading-relaxed transition-colors duration-300",
                        isExpanded ? "text-[#F5F0E8]/80" : "text-[#1C1C1E]/70"
                      )}
                      style={{ fontFamily: serif }}
                    >
                      {item.shortDescription}
                    </p>

                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-500 ease-out",
                        isExpanded ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0"
                      )}
                    >
                      <p
                        className="text-sm text-[#F5F0E8]/70 leading-relaxed border-t border-[#C9A961]/30 pt-4"
                        style={{ fontFamily: serif }}
                      >
                        {item.fullDescription}
                      </p>
                    </div>
                  </div>
                </button>
              </ScrollFadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
