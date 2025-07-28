'use client';

import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import API_BASE from "@/lib/api";
import { useTranslation } from "@/contexts/TranslationContext";

const API_URL = `${API_BASE}/api/feed`;

// Minimum and maximum dimensions for the carousel
const MIN_WIDTH = 320; // Minimum width in pixels
const MAX_WIDTH = 800; // Maximum width in pixels
const MIN_HEIGHT = 240; // Minimum height in pixels
const MAX_HEIGHT = 600; // Maximum height in pixels
const ASPECT_RATIO = 16 / 9; // Default aspect ratio (16:9)

export default function FeedSection() {
  const { t } = useTranslation();
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => { setFeed(data); setLoading(false); })
      .catch(() => { setError(t("failedToLoadNews")); setLoading(false); });
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === feed.length - 1 ? 0 : prevIndex + 1
    );
  }, [feed.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? feed.length - 1 : prevIndex - 1
    );
  }, [feed.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Calculate responsive dimensions based on image/video aspect ratio
  const calculateDimensions = (naturalWidth: number, naturalHeight: number) => {
    const aspectRatio = naturalWidth / naturalHeight;
    
    // Start with maximum dimensions
    let width = MAX_WIDTH;
    let height = width / aspectRatio;
    
    // If height exceeds maximum, scale down
    if (height > MAX_HEIGHT) {
      height = MAX_HEIGHT;
      width = height * aspectRatio;
    }
    
    // If width is below minimum, scale up
    if (width < MIN_WIDTH) {
      width = MIN_WIDTH;
      height = width / aspectRatio;
    }
    
    // If height is below minimum, scale up
    if (height < MIN_HEIGHT) {
      height = MIN_HEIGHT;
      width = height * aspectRatio;
    }
    
    // Ensure we don't exceed maximum width again
    if (width > MAX_WIDTH) {
      width = MAX_WIDTH;
      height = width / aspectRatio;
    }
    
    return { width: Math.round(width), height: Math.round(height) };
  };

  // Handle image load to get natural dimensions
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const dimensions = calculateDimensions(img.naturalWidth, img.naturalHeight);
    setImageDimensions(dimensions);
  };

  // Reset dimensions when changing slides
  useEffect(() => {
    setImageDimensions(null);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (feed.length <= 1) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextSlide();
          break;
        case 'Home':
          event.preventDefault();
          setCurrentIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setCurrentIndex(feed.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [feed.length, nextSlide, prevSlide]);

  // Auto-play functionality
  useEffect(() => {
    if (feed.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [feed.length, nextSlide]);

  if (loading) return <div className="text-center py-8 text-lg">Loading news...</div>;
  if (error) return <div className="text-center py-8 text-red-600 font-semibold">{error}</div>;
  if (feed.length === 0) return <div className="text-center py-8 text-gray-500">No news available</div>;

  const currentItem = feed[currentIndex];
  
  // Use calculated dimensions or fallback to responsive defaults
  const containerStyle = imageDimensions ? {
    width: `${imageDimensions.width}px`,
    height: `${imageDimensions.height}px`,
    maxWidth: '100%',
    maxHeight: '80vh'
  } : {
    width: '100%',
    maxWidth: `${MAX_WIDTH}px`,
    height: 'auto',
    minHeight: `${MIN_HEIGHT}px`,
    maxHeight: `${MAX_HEIGHT}px`
  };

  return (
    <section className="w-full py-12">
      <h2 className="text-3xl font-bold text-royal-purple mb-4 text-center">{t('newsSection')}</h2>
      <p className="text-lg text-royal-blue text-center mb-8 max-w-2xl mx-auto leading-relaxed">
        {t('stayUpdated')}
      </p>
      
      {/* Carousel Container */}
      <div className="relative max-w-6xl mx-auto flex justify-center">
        {/* Main Carousel Item */}
        <div 
          className="relative bg-white/90 rounded-2xl shadow-2xl overflow-hidden border-2 border-gold"
          style={containerStyle}
        >
          {/* Image/Video Container */}
          <div className="w-full h-full bg-gray-100 flex items-center justify-center relative">
            {currentItem.type === "image" ? (
              <img
                src={currentItem.url.startsWith("/uploads/") ? `${API_BASE}${currentItem.url}` : currentItem.url}
                alt={currentItem.title}
                className="object-contain w-full h-full"
                onLoad={handleImageLoad}
                style={{ 
                  minWidth: `${MIN_WIDTH}px`,
                  minHeight: `${MIN_HEIGHT}px`,
                  maxWidth: `${MAX_WIDTH}px`,
                  maxHeight: `${MAX_HEIGHT}px`
                }}
              />
            ) : (
              <iframe
                src={currentItem.url}
                title={currentItem.title}
                className="w-full h-full"
                style={{ 
                  minWidth: `${MIN_WIDTH}px`,
                  minHeight: `${MIN_HEIGHT}px`,
                  maxWidth: `${MAX_WIDTH}px`,
                  maxHeight: `${MAX_HEIGHT}px`
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
            <h3 className="text-2xl font-bold text-white mb-2">{currentItem.title}</h3>
            <p className="text-white/90 text-lg">{currentItem.description}</p>
          </div>
        </div>

        {/* Navigation Arrows */}
        {feed.length > 1 && (
          <>
            {/* Previous Button */}
            <Button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-royal-purple border-2 border-royal-purple rounded-full w-12 h-12 p-0 shadow-lg transition-all duration-200 hover:scale-110 z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            {/* Next Button */}
            <Button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-royal-purple border-2 border-royal-purple rounded-full w-12 h-12 p-0 shadow-lg transition-all duration-200 hover:scale-110 z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}

        {/* Dots Indicator */}
        {feed.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2 absolute bottom-[-60px] left-1/2 transform -translate-x-1/2">
            {feed.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-royal-purple scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Slide Counter */}
        {feed.length > 1 && (
          <div className="text-center mt-4 text-sm text-gray-600 absolute bottom-[-90px] left-1/2 transform -translate-x-1/2">
            {currentIndex + 1} of {feed.length}
          </div>
        )}
      </div>
    </section>
  );
} 