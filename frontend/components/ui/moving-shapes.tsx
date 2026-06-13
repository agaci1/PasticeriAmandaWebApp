"use client"

import React, { useEffect, useState } from "react"

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

const moveClasses = [
  "animate-move-circle-1",
  "animate-move-circle-2",
  "animate-move-circle-3",
  "animate-move-circle-4",
  "animate-move-circle-5",
]

export function MovingShapes() {
  const [particles, setParticles] = useState<React.ReactElement[]>([])

  useEffect(() => {
    const generated = Array.from({ length: 20 }).map((_, i) => {
      const top = randomBetween(5, 90)
      const left = randomBetween(5, 90)
      const size = randomBetween(4, 12)
      const move = moveClasses[Math.floor(Math.random() * moveClasses.length)]
      const delay = randomBetween(0, 5)
      const opacity = randomBetween(0.15, 0.4)

      return (
        <div
          key={i}
          className={`absolute rounded-full bg-antique-gold pointer-events-none ${move}`}
          style={{
            top: `${top}%`,
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity,
            animationDelay: `${delay}s`,
          }}
        />
      )
    })
    setParticles(generated)
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none [&_*]:pointer-events-none">
      {/* Soft gold ambient orbs */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-64 w-64 animate-move-circle-1 rounded-full bg-antique-gold/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/3 right-1/4 h-80 w-80 animate-move-circle-2 rounded-full bg-antique-gold/6 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-move-circle-3 rounded-full bg-burgundy/5 blur-3xl" />
      <div className="animation-delay-2s pointer-events-none absolute top-[10%] right-[15%] h-48 w-48 animate-move-circle-4 rounded-full bg-antique-gold/10 blur-2xl" />
      <div className="animation-delay-3s pointer-events-none absolute bottom-[15%] left-[10%] h-56 w-56 animate-move-circle-5 rounded-full bg-antique-gold/7 blur-2xl" />
      <div className="animation-delay-1s pointer-events-none absolute top-[60%] right-[30%] h-40 w-40 animate-move-circle-1 rounded-full bg-cream-dark/20 blur-xl" />
      <div className="animation-delay-4s pointer-events-none absolute top-[20%] left-[60%] h-32 w-32 animate-move-circle-3 rounded-full bg-antique-gold/12 blur-xl" />

      {/* Floating gold dust particles */}
      {particles}
    </div>
  )
}
