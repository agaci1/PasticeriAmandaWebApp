"use client"

import { useRef, ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface MediaZoomFrameProps {
  children: ReactNode
  className?: string
  innerClassName?: string
  scrollZoom?: boolean
  hoverZoom?: boolean
}

export function MediaZoomFrame({
  children,
  className,
  innerClassName,
  scrollZoom = true,
  hoverZoom = true,
}: MediaZoomFrameProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const scrollScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.94, 1, 0.97])

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        "bg-gradient-to-br from-[#EDE6DA]/80 to-[#F5F1EA]",
        "border border-[#B8954A]/20",
        className
      )}
      style={scrollZoom ? { scale: scrollScale } : undefined}
    >
      <motion.div
        className={cn("flex h-full w-full items-center justify-center p-3 sm:p-5", innerClassName)}
        whileHover={hoverZoom ? { scale: 1.04 } : undefined}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
