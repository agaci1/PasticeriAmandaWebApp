'use client';

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Instagram } from "lucide-react";

// Cake images array
const cakeImages = [
  "/cake1.jpg", "/cake2.jpg", "/cake3.jpg", "/cake4.jpg", "/cake5.jpg", "/cake6.jpg",
  "/cake7.jpg", "/cake8.jpg", "/cake9.jpg", "/cake10.jpg", "/cake11.jpg", "/cake12.jpg",
  "/cake13.jpg", "/cake14.jpg", "/cake15.jpg", "/cake16.jpg"
];

export default function OurCreationsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === cakeImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? cakeImages.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide(); // Swipe left
      } else {
        prevSlide(); // Swipe right
      }
    }
    
    setIsDragging(false);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    
    setIsDragging(false);
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Calculate which images to show (circular list)
  const getVisibleImages = () => {
    const visible = [];
    const totalImages = cakeImages.length;
    
    // Show 5 images on mobile, 7 on desktop: 2 before, 1 current, 2 after (mobile) or 3 before, 1 current, 3 after (desktop)
    const range = window.innerWidth < 768 ? 2 : 3;
    for (let i = -range; i <= range; i++) {
      const index = (currentIndex + i + totalImages) % totalImages;
      visible.push({
        index,
        src: cakeImages[index],
        isCenter: i === 0,
        position: i
      });
    }
    
    return visible;
  };

  return (
    <div className="w-full py-8">
      {/* 3D Carousel Container */}
      <div className="relative max-w-6xl mx-auto">
        <div 
          ref={carouselRef}
          className="relative h-[400px] md:h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {getVisibleImages().map((item, idx) => {
            const isCenter = item.isCenter;
            const position = item.position;
            
            // Calculate transform based on position
            let scale = 1;
            let opacity = 0.3;
            let blur = 'blur(4px)';
            let zIndex = 0;
            
            if (isCenter) {
              scale = 1.1;
              opacity = 1;
              blur = 'blur(0px)';
              zIndex = 10;
            } else if (Math.abs(position) === 1) {
              scale = 0.85;
              opacity = 0.7;
              blur = 'blur(2px)';
              zIndex = 5;
            } else if (Math.abs(position) === 2) {
              scale = 0.65;
              opacity = 0.5;
              blur = 'blur(3px)';
              zIndex = 2;
            } else {
              scale = 0.45;
              opacity = 0.3;
              blur = 'blur(4px)';
              zIndex = 1;
            }
            
            // Calculate horizontal position (smaller on mobile)
            const translateX = position * (window.innerWidth < 768 ? 120 : 200);
            
            return (
              <div
                key={`${item.index}-${idx}`}
                className="absolute transition-all duration-700 ease-in-out cursor-pointer"
                style={{
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  opacity,
                  filter: blur,
                  zIndex,
                }}
                onClick={() => !isCenter && goToSlide(item.index)}
              >
                <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-gold">
                  <Image
                    src={item.src}
                    alt={`Cake ${item.index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                  />
                  {/* Glow effect for center image */}
                  {isCenter && (
                    <div className="absolute inset-0 bg-gradient-to-t from-gold/20 via-transparent to-transparent"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {cakeImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-royal-purple scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Instagram Link */}
      <div className="text-center mt-8">
        <p className="text-lg text-royal-blue font-semibold mb-4">
          You can find this and more models in our pastry shop account
        </p>
        <a
          href="https://www.instagram.com/pasticeri_amanda"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Instagram className="w-5 h-5" />
          @pasticeri_amanda
        </a>
      </div>
    </div>
  );
}  