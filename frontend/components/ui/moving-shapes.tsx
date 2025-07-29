"use client"

import React, { useEffect, useState } from "react"

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const moveClasses = [
  "animate-move-circle-1",
  "animate-move-circle-2",
  "animate-move-circle-3",
  "animate-move-circle-4",
  "animate-move-circle-5",
];
const blurClasses = ["blur-xs", "blur-sm", "blur-md"];
const opacityClasses = [
  "opacity-40",
  "opacity-50",
  "opacity-60",
  "opacity-70",
  "opacity-80",
  "opacity-90",
];

export function MovingShapes() {
  const [stars, setStars] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }).map((_, i) => {
      const top = randomBetween(2, 90);
      const left = randomBetween(2, 90);
      const size = randomBetween(20, 60); // px
      const move = moveClasses[Math.floor(Math.random() * moveClasses.length)];
      const blur = blurClasses[Math.floor(Math.random() * blurClasses.length)];
      const opacity = opacityClasses[Math.floor(Math.random() * opacityClasses.length)];
      const delay = randomBetween(0, 7); // s
      return (
        <Star
          key={i}
          style={{
            top: `${top}%`,
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${delay}s`,
          } as React.CSSProperties}
          className={`absolute pointer-events-none ${move} ${blur} ${opacity}`}
        />
      );
    });
    setStars(generatedStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* --- MOVING BALLS (restored and more gold) --- */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-gold opacity-20 animate-move-circle-1 blur-xl" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-pink-gradient-end opacity-20 animate-move-circle-2 blur-xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-royal-purple opacity-20 animate-move-circle-3 blur-xl" />
      <div className="absolute top-[10%] right-[10%] w-32 h-32 rounded-full bg-gold opacity-15 animate-move-circle-4 blur-lg animation-delay-2s" />
      <div className="absolute bottom-[10%] left-[10%] w-40 h-40 rounded-full bg-pink-gradient-start opacity-15 animate-move-circle-5 blur-lg animation-delay-4s" />
      {/* More balls for density and gold */}
      <div className="absolute top-[5%] left-[60%] w-24 h-24 rounded-full bg-royal-blue opacity-10 animate-move-circle-1 blur-md animation-delay-3s" />
      <div className="absolute bottom-[20%] left-[5%] w-36 h-36 rounded-full bg-gold opacity-18 animate-move-circle-2 blur-xl animation-delay-1s" />
      <div className="absolute top-[70%] right-[15%] w-52 h-52 rounded-full bg-pink-gradient-start opacity-12 animate-move-circle-3 blur-lg animation-delay-5s" />
      <div className="absolute top-[30%] right-[5%] w-28 h-28 rounded-full bg-royal-purple opacity-15 animate-move-circle-4 blur-md animation-delay-0.5s" />
      <div className="absolute top-[15%] left-[20%] w-20 h-20 rounded-full bg-gold opacity-12 animate-move-circle-2 blur-lg animation-delay-1.5s" />
      <div className="absolute bottom-[40%] right-[30%] w-44 h-44 rounded-full bg-pink-gradient-end opacity-16 animate-move-circle-1 blur-xl animation-delay-2.5s" />
      <div className="absolute top-[60%] left-[15%] w-30 h-30 rounded-full bg-royal-blue opacity-14 animate-move-circle-3 blur-md animation-delay-3.5s" />
      <div className="absolute bottom-[15%] right-[5%] w-26 h-26 rounded-full bg-royal-purple opacity-13 animate-move-circle-4 blur-lg animation-delay-4.5s" />
      <div className="absolute top-[25%] right-[25%] w-38 h-38 rounded-full bg-gold opacity-17 animate-move-circle-5 blur-xl animation-delay-0.8s" />
      <div className="absolute bottom-[60%] left-[40%] w-22 h-22 rounded-full bg-pink-gradient-start opacity-11 animate-move-circle-1 blur-md animation-delay-1.8s" />
      <div className="absolute top-[80%] left-[35%] w-34 h-34 rounded-full bg-royal-blue opacity-15 animate-move-circle-2 blur-lg animation-delay-2.8s" />
      <div className="absolute top-[45%] right-[40%] w-18 h-18 rounded-full bg-gold opacity-10 animate-move-circle-3 blur-sm animation-delay-3.8s" />
      <div className="absolute bottom-[30%] left-[25%] w-46 h-46 rounded-full bg-pink-gradient-end opacity-18 animate-move-circle-4 blur-xl animation-delay-4.8s" />
      <div className="absolute top-[10%] left-[45%] w-16 h-16 rounded-full bg-royal-purple opacity-9 animate-move-circle-5 blur-sm animation-delay-0.3s" />
      <div className="absolute bottom-[50%] right-[20%] w-42 h-42 rounded-full bg-gold opacity-19 animate-move-circle-1 blur-xl animation-delay-1.3s" />
      <div className="absolute top-[35%] left-[30%] w-28 h-28 rounded-full bg-pink-gradient-start opacity-14 animate-move-circle-2 blur-lg animation-delay-2.3s" />
      <div className="absolute bottom-[10%] left-[50%] w-24 h-24 rounded-full bg-royal-blue opacity-12 animate-move-circle-3 blur-md animation-delay-3.3s" />
      <div className="absolute top-[55%] right-[10%] w-32 h-32 rounded-full bg-gold opacity-16 animate-move-circle-4 blur-lg animation-delay-4.3s" />
      <div className="absolute bottom-[70%] left-[10%] w-20 h-20 rounded-full bg-pink-gradient-end opacity-11 animate-move-circle-5 blur-md animation-delay-0.7s" />
      {/* Extra gold balls */}
      <div className="absolute top-[8%] left-[8%] w-14 h-14 rounded-full bg-gold opacity-18 animate-move-circle-1 blur-lg animation-delay-0.2s" />
      <div className="absolute top-[28%] left-[28%] w-20 h-20 rounded-full bg-gold opacity-15 animate-move-circle-5 blur-lg animation-delay-4.2s" />
      <div className="absolute bottom-[12%] left-[12%] w-18 h-18 rounded-full bg-gold opacity-13 animate-move-circle-2 blur-md animation-delay-1.6s" />
      <div className="absolute bottom-[23%] left-[3%] w-7 h-7 rounded-full bg-gold opacity-12 animate-move-circle-2 blur-xs animation-delay-4.1s" />
      <div className="absolute top-[23%] right-[3%] w-7 h-7 rounded-full bg-gold opacity-12 animate-move-circle-2 blur-xs animation-delay-4.1s" />
      <div className="absolute bottom-[27%] right-[7%] w-11 h-11 rounded-full bg-gold opacity-18 animate-move-circle-3 blur-sm animation-delay-0.4s" />
      <div className="absolute top-[27%] right-[7%] w-11 h-11 rounded-full bg-gold opacity-18 animate-move-circle-3 blur-sm animation-delay-0.4s" />

      {/* --- MANY SHINING, MOVING, BLURRY GOLD STARS --- */}
      {stars}
    </div>
  )
}

// Proper star shape SVG
function Star({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="star-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
          <stop offset="70%" stopColor="#FFA500" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FF8C00" stopOpacity="0.6" />
        </radialGradient>
        <filter id="star-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#star-glow)">
        <path
          d="M50 5L61.18 35.82L95 35.82L68.41 56.59L79.59 87.41L50 66.64L20.41 87.41L31.59 56.59L5 35.82L38.82 35.82L50 5Z"
          fill="url(#star-gradient)"
          stroke="#FFD700"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
