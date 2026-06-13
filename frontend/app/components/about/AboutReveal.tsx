"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ScrollFadeIn } from "@/components/ScrollFadeIn"

type Direction = "up" | "down" | "left" | "right"

interface AboutRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: Direction
  /** Always show content — animate in without hiding first */
  immediate?: boolean
}

/** Scroll reveal that never leaves content permanently hidden */
export function AboutReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  immediate = true,
}: AboutRevealProps) {
  return (
    <ScrollFadeIn
      className={cn(className)}
      threshold={0.06}
      delay={delay}
      direction={direction}
      immediate={immediate}
    >
      {children}
    </ScrollFadeIn>
  )
}

export function AboutStagger({
  children,
  className,
}: {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  immediate?: boolean
}) {
  return <div className={className}>{children}</div>
}

export function AboutStaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
  direction?: Direction
}) {
  return <div className={className}>{children}</div>
}
