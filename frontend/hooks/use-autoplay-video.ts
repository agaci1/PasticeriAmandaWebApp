"use client"

import { RefObject, useEffect } from "react"

type AutoplayOptions = {
  /** Only load & play when the video enters the viewport */
  lazy?: boolean
}

export function useAutoplayVideo(
  ref: RefObject<HTMLVideoElement | null>,
  deps: unknown[] = [],
  options: AutoplayOptions = {}
) {
  const { lazy = false } = options

  useEffect(() => {
    const video = ref.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true

    const play = () => {
      void video.play().catch(() => {})
    }

    const pause = () => {
      video.pause()
    }

    if (!lazy) {
      play()
      video.addEventListener("loadeddata", play)
      video.addEventListener("canplay", play)

      return () => {
        video.removeEventListener("loadeddata", play)
        video.removeEventListener("canplay", play)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.getAttribute("preload") === "none") {
            video.preload = "metadata"
            video.load()
          }
          play()
        } else {
          pause()
        }
      },
      { threshold: 0.15, rootMargin: "64px" }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
      pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
