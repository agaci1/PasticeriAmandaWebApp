"use client"

import { useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"

type OrderImageLightboxProps = {
  src: string | null
  onClose: () => void
}

export function OrderImageLightbox({ src, onClose }: OrderImageLightboxProps) {
  useEffect(() => {
    if (!src) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [src, onClose])

  if (!src || typeof document === "undefined") return null

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged order image"
    >
      <div
        className="relative max-h-[90vh] max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Enlarged order"
          className="max-h-[85vh] w-auto max-w-full object-contain"
        />
        <Button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 rounded-none bg-black/60 text-white hover:bg-black/80"
          size="sm"
        >
          ✕
        </Button>
      </div>
    </div>,
    document.body
  )
}
