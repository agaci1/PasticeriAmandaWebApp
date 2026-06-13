"use client"

import { RefObject, useEffect } from "react"

export function useAutoplayVideo(
  ref: RefObject<HTMLVideoElement | null>,
  deps: unknown[] = []
) {
  useEffect(() => {
    const video = ref.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true

    const play = () => {
      void video.play().catch(() => {})
    }

    play()

    video.addEventListener("loadeddata", play)
    video.addEventListener("canplay", play)

    return () => {
      video.removeEventListener("loadeddata", play)
      video.removeEventListener("canplay", play)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
