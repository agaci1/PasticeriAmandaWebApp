"use client"

import { ReactNode } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface VintageFrameProps {
  children: ReactNode
  className?: string
  backgroundImage?: string
  backgroundOpacity?: number
}

function CornerOrnaments() {
  const corners = ["top-0 left-0 rounded-tl-2xl border-l-4 border-t-4", "top-0 right-0 rounded-tr-2xl border-r-4 border-t-4", "bottom-0 left-0 rounded-bl-2xl border-l-4 border-b-4", "bottom-0 right-0 rounded-br-2xl border-r-4 border-b-4"]
  return (
    <>
      {corners.map((corner, i) => (
        <div key={i} className={cn("absolute w-14 h-14 md:w-16 md:h-16 z-10 border-antique-gold pointer-events-none", corner.split(" ").slice(0, 2).join(" "))}>
          <div className={cn("absolute w-10 h-10 md:w-12 md:h-12 border-antique-gold/60", corner)} />
        </div>
      ))}
    </>
  )
}

export function VintageFrame({
  children,
  className,
  backgroundImage,
  backgroundOpacity = 0.15,
}: VintageFrameProps) {
  return (
    <div
      className={cn(
        "relative p-8 md:p-12 bg-cream/95 rounded-sm shadow-vintage border border-antique-gold/40 overflow-hidden vintage-paper",
        className
      )}
    >
      {backgroundImage && (
        <div className="absolute inset-0" style={{ opacity: backgroundOpacity }}>
          <Image src={backgroundImage} alt="" fill className="object-cover blur-sm scale-105" />
        </div>
      )}
      <CornerOrnaments />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
