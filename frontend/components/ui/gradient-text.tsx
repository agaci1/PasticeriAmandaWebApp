import { cn } from "@/lib/utils"
import type React from "react"

interface GradientTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  type?: "title" | "default"
}

export function GradientText({ children, className, type = "default", ...props }: GradientTextProps) {
  const gradientClasses =
    type === "title"
      ? "bg-gradient-to-r from-title-gradient-white via-title-gradient-purple-pink to-title-gradient-gold"
      : "bg-gradient-to-r from-pink-gradient-start to-pink-gradient-end"

  return (
    <h1 className={cn(gradientClasses, "bg-clip-text text-transparent", className)} {...props}>
      {children}
    </h1>
  )
}
