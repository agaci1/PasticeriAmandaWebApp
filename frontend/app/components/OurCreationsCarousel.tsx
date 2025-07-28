'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

// Cake images array
const cakeImages = [
  "/cake1.jpg", "/cake2.jpg", "/cake3.jpg", "/cake4.jpg", "/cake5.jpg", "/cake6.jpg",
  "/cake7.jpg", "/cake8.jpg", "/cake9.jpg", "/cake10.jpg", "/cake11.jpg", "/cake12.jpg",
  "/cake13.jpg", "/cake14.jpg", "/cake15.jpg", "/cake16.jpg"
];

export default function OurCreationsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    
    // Show 7 images: 3 before, 1 current, 3 after
    for (let i = -3; i <= 3; i++) {
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
        <div className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
          {getVisibleImages().map((item, idx) => {
            const isCenter = item.isCenter;
            const position = item.position;
            
            // Calculate transform based on position
            let scale = 1;
            let opacity = 0.3;
            let blur = 'blur(4px)';
            let zIndex = 0;
            
            if (isCenter) {
              scale = 1.2;
              opacity = 1;
              blur = 'blur(0px)';
              zIndex = 10;
            } else if (Math.abs(position) === 1) {
              scale = 0.9;
              opacity = 0.7;
              blur = 'blur(2px)';
              zIndex = 5;
            } else if (Math.abs(position) === 2) {
              scale = 0.7;
              opacity = 0.5;
              blur = 'blur(3px)';
              zIndex = 2;
            } else {
              scale = 0.5;
              opacity = 0.3;
              blur = 'blur(4px)';
              zIndex = 1;
            }
            
            // Calculate horizontal position
            const translateX = position * 200;
            
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
                <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-gold">
                  <Image
                    src={item.src}
                    alt={`Cake ${item.index + 1}`}
                    fill
                    className="object-cover"
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

        {/* Navigation Arrows */}
        <Button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-royal-purple border-2 border-royal-purple rounded-full w-16 h-16 p-0 shadow-lg transition-all duration-200 hover:scale-110 z-20"
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        <Button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-royal-purple border-2 border-royal-purple rounded-full w-16 h-16 p-0 shadow-lg transition-all duration-200 hover:scale-110 z-20"
        >
          <ChevronRight className="w-8 h-8" />
        </Button>

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