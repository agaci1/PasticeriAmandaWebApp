"use client"

import { ReactNode, useEffect, useState } from "react"
import { useScrollFade } from "@/hooks/use-scroll-fade"
import { cn } from "@/lib/utils"

interface ScrollFadeInProps {
  children: ReactNode
  className?: string
  threshold?: number
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  /** Show immediately (hero / above-the-fold) */
  immediate?: boolean
}

const directionMap = {
  up: "translateY(24px)",
  down: "translateY(-24px)",
  left: "translateX(24px)",
  right: "translateX(-24px)",
}

const directionMapVisible = {
  up: "translateY(0)",
  down: "translateY(0)",
  left: "translateX(0)",
  right: "translateX(0)",
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function ScrollFadeIn({
  children,
  className,
  threshold = 0.15,
  delay = 0,
  direction = "up",
  immediate = false,
}: ScrollFadeInProps) {
  const { elementRef, isVisible } = useScrollFade({ threshold, rootMargin: "0px 0px -40px 0px" })
  const [mounted, setMounted] = useState(false)
  const [forceShow, setForceShow] = useState(immediate)

  useEffect(() => {
    setMounted(true)
    if (immediate || prefersReducedMotion()) {
      setForceShow(true)
      return
    }
    const timer = window.setTimeout(() => setForceShow(true), 400)
    return () => window.clearTimeout(timer)
  }, [immediate])

  const show = immediate || isVisible || forceShow
  const hidden = mounted && !immediate && !show

  return (
    <div
      ref={elementRef}
      className={cn("transition-all duration-700 ease-out", className)}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? directionMap[direction] : directionMapVisible[direction],
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
