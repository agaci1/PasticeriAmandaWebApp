"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { media } from "@/lib/media"

interface LogoMarkProps {
  size?: "sm" | "md" | "lg" | "xl" | "hero"
  className?: string
  href?: string | null
}

const sizeClasses = {
  sm: "max-h-[40px] w-auto",
  md: "max-h-[52px] w-auto",
  lg: "max-h-[72px] w-auto",
  xl: "max-h-[6rem] w-auto sm:max-h-[7rem] md:max-h-[8rem]",
  hero: "max-h-[11rem] w-auto sm:max-h-[13rem] md:max-h-[15rem] lg:max-h-[18rem]",
}

export function LogoMark({
  size = "md",
  className,
  href = "/",
}: LogoMarkProps) {
  const content = (
    <div className={cn("flex items-center justify-center", className)}>
      <Image
        src={media.branding.logoNoBackground}
        alt="Pastiçeri Amanda"
        width={400}
        height={500}
        className={cn("object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.2)]", sizeClasses[size])}
        priority={size === "hero" || size === "xl"}
        sizes={size === "hero" ? "(max-width:768px) 320px, 480px" : "(max-width:768px) 200px, 280px"}
      />
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}
