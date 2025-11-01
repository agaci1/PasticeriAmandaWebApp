"use client"

import { ReactNode } from "react"
import { useScrollFade } from "@/hooks/use-scroll-fade"
import { cn } from "@/lib/utils"

interface ScrollFadeInProps {
  children: ReactNode
  className?: string
  threshold?: number
  delay?: number
  direction?: "up" | "down" | "left" | "right"
}

const directionMap = {
  up: "translateY(30px)",
  down: "translateY(-30px)",
  left: "translateX(30px)",
  right: "translateX(-30px)",
}

const directionMapVisible = {
  up: "translateY(0)",
  down: "translateY(0)",
  left: "translateX(0)",
  right: "translateX(0)",
}

export function ScrollFadeIn({
  children,
  className,
  threshold = 0.2,
  delay = 0,
  direction = "up",
}: ScrollFadeInProps) {
  const { elementRef, isVisible } = useScrollFade({ threshold })

  return (
    <div
      ref={elementRef}
      className={cn("transition-all duration-700 ease-out", className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? directionMapVisible[direction] : directionMap[direction],
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
