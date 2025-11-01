'use client';

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { GradientText } from "@/components/ui/gradient-text"
import FeedSection from "@/app/components/FeedSection";
import API_BASE from "@/lib/api";
import { Dancing_Script, Playfair_Display } from "next/font/google"
import { useTranslation } from "@/contexts/TranslationContext"
import { ScrollFadeIn } from "@/components/ScrollFadeIn"

const dancingScript = Dancing_Script({ subsets: ["latin"] })
const playfairDisplay = Playfair_Display({ 
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair"
})

interface CarouselItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  menuLink: string;
}

// Full-screen carousel items will be defined inside the component

interface MenuItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  originalIndex: number;
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isMenuDragging, setIsMenuDragging] = useState(false);
  const [menuStartX, setMenuStartX] = useState(0);
  const [menuCurrentX, setMenuCurrentX] = useState(0);
  const menuCarouselRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Full-screen carousel items
  const carouselItems: CarouselItem[] = [
    {
      id: 1,
      name: t("cake"),
      description: t("cakeDescription"),
      imageUrl: "/cakespic.WEBP",
      category: "cakes",
      menuLink: "/menu?category=cakes"
    },
    {
      id: 2,
      name: t("pastries"),
      description: t("pastriesDescription"),
      imageUrl: "/sweetspic.JPG",
      category: "sweets",
      menuLink: "/menu?category=sweets"
    },
    {
      id: 3,
      name: t("traditional"),
      description: t("traditionalDescription"),
      imageUrl: "/bakllava123.jpeg",
      category: "other",
      menuLink: "/menu?category=other"
    },
    {
      id: 4,
      name: t("modern"),
      description: t("modernDescription"),
      imageUrl: "/rafaellopic.jpg",
      category: "other",
      menuLink: "/menu?category=other"
    },
    {
      id: 5,
      name: t("iceCream"),
      description: t("iceCreamDescription"),
      imageUrl: "/icecreampic.WEBP",
      category: "other",
      menuLink: "/menu?category=other"
    },
    {
      id: 6,
      name: t("trending"),
      description: t("trendingDescription"),
      imageUrl: "/dubaipic.jpg",
      category: "other",
      menuLink: "/menu?category=other"
    }
  ];

  const [randomMenuItems, setRandomMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Create random menu items with proper structure
        const items = data.slice(0, 8).map((item: any, index: number) => ({
          id: item.id || index + 1,
          name: item.name || `Menu Item ${index + 1}`,
          description: item.description || "Delicious pastry made with love",
          imageUrl: item.imageUrl || "/placeholder.svg",
          price: String(item.price || "1500"),
          originalIndex: index
        }));
        setRandomMenuItems(items);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        // Fallback to placeholder items
        const placeholderItems = Array.from({ length: 8 }, (_, index) => ({
          id: index + 1,
          name: `Delicious Pastry ${index + 1}`,
          description: "Handcrafted with premium ingredients",
          imageUrl: "/placeholder.svg",
          price: "1500",
          originalIndex: index
        }));
        setRandomMenuItems(placeholderItems);
      }
    };

    fetchMenuItems();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Touch/Swipe handlers for main carousel
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

  // Mouse drag handlers for main carousel
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

  const nextMenuSlide = () => {
    setCurrentMenuIndex((prev) => (prev + 1) % randomMenuItems.length);
  };

  const prevMenuSlide = () => {
    setCurrentMenuIndex((prev) => (prev - 1 + randomMenuItems.length) % randomMenuItems.length);
  };

  const handleMenuTouchStart = (e: React.TouchEvent) => {
    setIsMenuDragging(true);
    setMenuStartX(e.touches[0].clientX);
    setMenuCurrentX(e.touches[0].clientX);
  };

  const handleMenuTouchMove = (e: React.TouchEvent) => {
    if (!isMenuDragging) return;
    setMenuCurrentX(e.touches[0].clientX);
  };

  const handleMenuTouchEnd = () => {
    if (!isMenuDragging) return;
    
    const diff = menuStartX - menuCurrentX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextMenuSlide(); // Swipe left
      } else {
        prevMenuSlide(); // Swipe right
      }
    }
    
    setIsMenuDragging(false);
  };

  const handleMenuMouseDown = (e: React.MouseEvent) => {
    setIsMenuDragging(true);
    setMenuStartX(e.clientX);
    setMenuCurrentX(e.clientX);
  };

  const handleMenuMouseMove = (e: React.MouseEvent) => {
    if (!isMenuDragging) return;
    setMenuCurrentX(e.clientX);
  };

  const handleMenuMouseUp = () => {
    if (!isMenuDragging) return;
    
    const diff = menuStartX - menuCurrentX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextMenuSlide();
      } else {
        prevMenuSlide();
      }
    }
    
    setIsMenuDragging(false);
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentSlide]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-royal-blue">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-purple"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-screen carousel */}
      <div 
        ref={carouselRef}
        className="relative w-full h-screen cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {carouselItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                priority={index === currentSlide}
                sizes="100vw"
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-4">
              {/* Main Content */}
                 <div className="max-w-4xl mx-auto">
                   <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 md:mb-6 drop-shadow-lg text-white" style={{
                     textShadow: item.category === 'cakes' ? '0 0 10px #fbbf24, 0 0 20px #fbbf24, 0 0 30px #fbbf24, 0 0 40px #fbbf24' :
                                   item.category === 'sweets' ? '0 0 10px #ec4899, 0 0 20px #ec4899, 0 0 30px #ec4899, 0 0 40px #ec4899' :
                                   item.id === 3 ? '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6' :
                                   item.id === 4 ? '0 0 10px #06b6d4, 0 0 20px #06b6d4, 0 0 30px #06b6d4, 0 0 40px #06b6d4' :
                                   item.id === 5 ? '0 0 10px #f0abfc, 0 0 20px #f0abfc, 0 0 30px #f0abfc, 0 0 40px #f0abfc' :
                                   '0 0 10px #10b981, 0 0 20px #10b981, 0 0 30px #10b981, 0 0 40px #10b981'
                   }}>
                     {item.category === 'cakes' ? t('exquisiteCakes') :
                      item.category === 'sweets' ? t('artisanPastries') :
                      item.id === 3 ? t('traditionalDelights') :
                      item.id === 4 ? t('modernCreations') :
                      item.id === 5 ? t('frozenDelights') :
                      t('trendingSensations')}
                   </h1>
                   <p className={`text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-white/90 max-w-2xl mx-auto drop-shadow-md ${playfairDisplay.className}`} style={{ fontWeight: 400, fontStyle: 'normal', opacity: 0.95 }}>
                     {item.description}
                   </p>
                
                                   {/* Category Button */}
                   <Button
                     asChild
                     className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg text-white transition-colors shadow-lg border-2 font-bold"
                     style={{
                       backgroundColor: item.category === 'cakes' ? '#fbbf24' :
                                       item.category === 'sweets' ? '#ec4899' :
                                       item.id === 3 ? '#8b5cf6' :
                                       item.id === 4 ? '#06b6d4' :
                                       item.id === 5 ? '#f0abfc' :
                                       '#10b981',
                       borderColor: item.category === 'cakes' ? '#fbbf24' :
                                   item.category === 'sweets' ? '#ec4899' :
                                   item.id === 3 ? '#8b5cf6' :
                                   item.id === 4 ? '#06b6d4' :
                                   item.id === 5 ? '#f0abfc' :
                                   '#10b981',
                       boxShadow: item.category === 'cakes' ? '0 0 10px #fbbf24, 0 0 20px #fbbf24, 0 0 30px #fbbf24' :
                                   item.category === 'sweets' ? '0 0 10px #ec4899, 0 0 20px #ec4899, 0 0 30px #ec4899' :
                                   item.id === 3 ? '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6' :
                                   item.id === 4 ? '0 0 10px #06b6d4, 0 0 20px #06b6d4, 0 0 30px #06b6d4' :
                                   item.id === 5 ? '0 0 10px #f0abfc, 0 0 20px #f0abfc, 0 0 30px #f0abfc' :
                                   '0 0 10px #10b981, 0 0 20px #10b981, 0 0 30px #10b981'
                     }}
                   >
                     <Link href={item.menuLink}>
                       {item.category === 'cakes' ? t('viewCakes') : 
                        item.category === 'sweets' ? t('viewSweets') : 
                        item.id === 3 ? t('viewTraditional') : 
                        item.id === 4 ? t('viewModern') : 
                        item.id === 5 ? t('viewIceCream') : 
                        t('viewTrending')}
                     </Link>
                   </Button>
              </div>

              {/* Neon Dot Indicators */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex gap-3">
                  {carouselItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'scale-125' : 'scale-100'
                      }`}
                      style={{
                        backgroundColor: index === currentSlide ? 
                          (item.category === 'cakes' ? '#fbbf24' :
                           item.category === 'sweets' ? '#ec4899' :
                           item.id === 3 ? '#8b5cf6' :
                           item.id === 4 ? '#06b6d4' :
                           item.id === 5 ? '#f0abfc' :
                           '#10b981') : 'rgba(255, 255, 255, 0.3)',
                        boxShadow: index === currentSlide ? 
                          (item.category === 'cakes' ? '0 0 10px #fbbf24, 0 0 20px #fbbf24, 0 0 30px #fbbf24' :
                           item.category === 'sweets' ? '0 0 10px #ec4899, 0 0 20px #ec4899, 0 0 30px #ec4899' :
                           item.id === 3 ? '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6' :
                           item.id === 4 ? '0 0 10px #06b6d4, 0 0 20px #06b6d4, 0 0 30px #06b6d4' :
                           item.id === 5 ? '0 0 10px #f0abfc, 0 0 20px #f0abfc, 0 0 30px #f0abfc' :
                           '0 0 10px #10b981, 0 0 20px #10b981, 0 0 30px #10b981') : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Rest of the content below the carousel */}
      <div className="relative z-10 bg-white">
        {/* Logo Section with Corner Decorations */}
        <section className="py-16 px-4 relative overflow-hidden">
          {/* Moving Blurry Balls Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-48 h-48 bg-royal-purple/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-40 h-40 bg-royal-blue/45 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-56 h-56 bg-gold/35 rounded-full blur-3xl animate-pulse delay-500"></div>
            <div className="absolute bottom-40 right-1/3 w-44 h-44 bg-royal-purple/50 rounded-full blur-2xl animate-pulse delay-1500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-royal-blue/40 rounded-full blur-3xl animate-pulse delay-2000"></div>
            <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-gold/30 rounded-full blur-2xl animate-pulse delay-750"></div>
            <div className="absolute bottom-1/3 left-1/3 w-32 h-32 bg-royal-purple/35 rounded-full blur-3xl animate-pulse delay-1250"></div>
        </div>

          <div className="relative z-10">
          <ScrollFadeIn threshold={0.2} direction="up">
          <div className="relative flex justify-center mb-8">
            {/* Top Left Corner Decoration */}
            <div className="absolute top-0 left-0 w-40 h-40 md:w-48 md:h-48 pointer-events-none">
              <div className="relative w-full h-full">
                {/* Curved Corner Frame */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-0 left-0 w-20 h-20 border-l-4 border-t-4 border-gold rounded-tl-3xl"></div>
                  <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-gold/60 rounded-tl-2xl"></div>
                  <div className="absolute top-12 left-12 w-12 h-12 border-l border-t border-gold/40 rounded-tl-xl"></div>
                </div>
                {/* Ornate Swirls */}
                <div className="absolute top-3 left-3 w-10 h-10">
                  <div className="absolute top-0 left-0 w-5 h-5 border-r-2 border-b-2 border-gold rounded-br-full"></div>
                  <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-gold rounded-full"></div>
                  <div className="absolute top-4 left-4 w-2 h-2 bg-gold/80 rounded-full"></div>
                </div>
                <div className="absolute top-8 left-8 w-8 h-8">
                  <div className="absolute top-0 left-0 w-4 h-4 border-r border-b border-gold/70 rounded-br-full"></div>
                  <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-gold/60 rounded-full"></div>
                </div>
                {/* Decorative Dots */}
                <div className="absolute top-16 left-6 w-3 h-3 bg-gold rounded-full opacity-80"></div>
                <div className="absolute top-20 left-10 w-2 h-2 bg-gold rounded-full opacity-60"></div>
                <div className="absolute top-24 left-14 w-1.5 h-1.5 bg-gold rounded-full opacity-40"></div>
              </div>
            </div>

            {/* Top Right Corner Decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 md:w-48 md:h-48 pointer-events-none">
              <div className="relative w-full h-full">
                {/* Curved Corner Frame */}
                <div className="absolute top-0 right-0 w-full h-full">
                  <div className="absolute top-0 right-0 w-20 h-20 border-r-4 border-t-4 border-gold rounded-tr-3xl"></div>
                  <div className="absolute top-6 right-6 w-16 h-16 border-r-2 border-t-2 border-gold/60 rounded-tr-2xl"></div>
                  <div className="absolute top-12 right-12 w-12 h-12 border-r border-t border-gold/40 rounded-tr-xl"></div>
                </div>
                {/* Ornate Swirls */}
                <div className="absolute top-3 right-3 w-10 h-10">
                  <div className="absolute top-0 right-0 w-5 h-5 border-l-2 border-b-2 border-gold rounded-bl-full"></div>
                  <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-gold rounded-full"></div>
                  <div className="absolute top-4 right-4 w-2 h-2 bg-gold/80 rounded-full"></div>
                </div>
                <div className="absolute top-8 right-8 w-8 h-8">
                  <div className="absolute top-0 right-0 w-4 h-4 border-l border-b border-gold/70 rounded-bl-full"></div>
                  <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-gold/60 rounded-full"></div>
                </div>
                {/* Decorative Dots */}
                <div className="absolute top-16 right-6 w-3 h-3 bg-gold rounded-full opacity-80"></div>
                <div className="absolute top-20 right-10 w-2 h-2 bg-gold rounded-full opacity-60"></div>
                <div className="absolute top-24 right-14 w-1.5 h-1.5 bg-gold rounded-full opacity-40"></div>
              </div>
            </div>

            {/* Main Logo with Gold Light */}
            <div className="relative flex flex-col items-center mt-8 md:mt-0">
            <Image
                src="/logoAmanda.jpg"
                alt="Pasticeri Amanda Logo"
                width={300}
                height={300}
                className="rounded-full border-6 border-gold shadow-2xl animate-pulse-slow relative z-10"
              />
              {/* Gold Light Surrounding */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/30 via-gold/20 to-gold/30 blur-xl animate-pulse"></div>
              
              {/* Title below Logo */}
              <div className="mt-6 text-center">
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg ${dancingScript.className}`} style={{
                  textShadow: '0 0 8px #fbbf24, 0 0 16px #fbbf24, 0 0 24px #ec4899, 0 0 32px #ec4899, 0 0 40px #fbbf24, 0 0 48px #ec4899, 0 0 56px #fbbf24, 0 0 64px #ec4899'
                }}>
                  Pasticeri Amanda
                </h1>
              </div>
            </div>

            {/* Bottom Left Corner Decoration */}
            <div className="absolute bottom-0 left-0 w-40 h-40 md:w-48 md:h-48 pointer-events-none">
              <div className="relative w-full h-full">
                {/* Curved Corner Frame */}
                <div className="absolute bottom-0 left-0 w-full h-full">
                  <div className="absolute bottom-0 left-0 w-20 h-20 border-l-4 border-b-4 border-gold rounded-bl-3xl"></div>
                  <div className="absolute bottom-6 left-6 w-16 h-16 border-l-2 border-b-2 border-gold/60 rounded-bl-2xl"></div>
                  <div className="absolute bottom-12 left-12 w-12 h-12 border-l border-b border-gold/40 rounded-bl-xl"></div>
                </div>
                {/* Ornate Swirls */}
                <div className="absolute bottom-3 left-3 w-10 h-10">
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-r-2 border-t-2 border-gold rounded-tr-full"></div>
                  <div className="absolute bottom-1 left-1 w-2.5 h-2.5 bg-gold rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-gold/80 rounded-full"></div>
                </div>
                <div className="absolute bottom-8 left-8 w-8 h-8">
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-r border-t border-gold/70 rounded-tr-full"></div>
                  <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 bg-gold/60 rounded-full"></div>
                </div>
                {/* Decorative Dots */}
                <div className="absolute bottom-16 left-6 w-3 h-3 bg-gold rounded-full opacity-80"></div>
                <div className="absolute bottom-20 left-10 w-2 h-2 bg-gold rounded-full opacity-60"></div>
                <div className="absolute bottom-24 left-14 w-1.5 h-1.5 bg-gold rounded-full opacity-40"></div>
              </div>
            </div>

            {/* Bottom Right Corner Decoration */}
            <div className="absolute bottom-0 right-0 w-40 h-40 md:w-48 md:h-48 pointer-events-none">
              <div className="relative w-full h-full">
                {/* Curved Corner Frame */}
                <div className="absolute bottom-0 right-0 w-full h-full">
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-r-4 border-b-4 border-gold rounded-br-3xl"></div>
                  <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-gold/60 rounded-br-2xl"></div>
                  <div className="absolute bottom-12 right-12 w-12 h-12 border-r border-b border-gold/40 rounded-br-xl"></div>
                </div>
                {/* Ornate Swirls */}
                <div className="absolute bottom-3 right-3 w-10 h-10">
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-l-2 border-t-2 border-gold rounded-tl-full"></div>
                  <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-gold rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-gold/80 rounded-full"></div>
                </div>
                <div className="absolute bottom-8 right-8 w-8 h-8">
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-l border-t border-gold/70 rounded-tl-full"></div>
                  <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-gold/60 rounded-full"></div>
                </div>
                {/* Decorative Dots */}
                <div className="absolute bottom-16 right-6 w-3 h-3 bg-gold rounded-full opacity-80"></div>
                <div className="absolute bottom-20 right-10 w-2 h-2 bg-gold rounded-full opacity-60"></div>
                <div className="absolute bottom-24 right-14 w-1.5 h-1.5 bg-gold rounded-full opacity-40"></div>
              </div>
            </div>
          </div>
          </ScrollFadeIn>
          </div>
        </section>

        {/* Random Menu Carousel Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-royal-purple/5 to-royal-blue/5 relative overflow-hidden">
          {/* Moving Blurry Balls Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-48 h-48 bg-royal-purple/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-40 h-40 bg-royal-blue/45 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-56 h-56 bg-gold/35 rounded-full blur-3xl animate-pulse delay-500"></div>
            <div className="absolute bottom-40 right-1/3 w-44 h-44 bg-royal-purple/50 rounded-full blur-2xl animate-pulse delay-1500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-royal-blue/40 rounded-full blur-3xl animate-pulse delay-2000"></div>
            <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-gold/30 rounded-full blur-2xl animate-pulse delay-750"></div>
            <div className="absolute bottom-1/3 left-1/3 w-32 h-32 bg-royal-purple/35 rounded-full blur-3xl animate-pulse delay-1250"></div>
          </div>
          
          <div className="relative z-10">
          <div className="max-w-6xl mx-auto">
            <ScrollFadeIn threshold={0.2} delay={0}>
              <h2 className="text-3xl md:text-4xl font-bold text-royal-purple mb-8 text-center">{t('featuredMenuItems')}</h2>
            </ScrollFadeIn>
            
            {/* Menu Carousel */}
            <div 
              ref={menuCarouselRef}
              className="relative h-96 md:h-[500px] flex items-center justify-center perspective-1000 mb-8 cursor-grab active:cursor-grabbing"
              onTouchStart={handleMenuTouchStart}
              onTouchMove={handleMenuTouchMove}
              onTouchEnd={handleMenuTouchEnd}
              onMouseDown={handleMenuMouseDown}
              onMouseMove={handleMenuMouseMove}
              onMouseUp={handleMenuMouseUp}
              onMouseLeave={handleMenuMouseUp}
            >
              {randomMenuItems.map((item, index) => {
                const offset = index - currentMenuIndex;
                const absOffset = Math.abs(offset);

                let transform = '';
                let opacity = 0.3;
                let scale = 0.7;
                let zIndex = 0;
                let blur = 'blur-sm';

                if (offset === 0) {
                  // Center item
                  transform = 'translateX(0) scale(1.05)';
                  opacity = 1;
                  scale = 1.05;
                  zIndex = 10;
                  blur = '';
                } else if (absOffset === 1) {
                  // Immediate neighbors
                  transform = `translateX(${offset * 70}%) scale(0.9)`;
                  opacity = 0.7;
                  scale = 0.9;
                  zIndex = 8;
                  blur = 'blur-[1px]';
                } else if (absOffset === 2) {
                  // Next neighbors
                  transform = `translateX(${offset * 60}%) scale(0.8)`;
                  opacity = 0.5;
                  scale = 0.8;
                  zIndex = 6;
                  blur = 'blur-[2px]';
                } else if (absOffset === 3) {
                  // Further neighbors
                  transform = `translateX(${offset * 50}%) scale(0.7)`;
                  opacity = 0.3;
                  scale = 0.7;
                  zIndex = 4;
                  blur = 'blur-[3px]';
                } else {
                  // Hidden items
                  transform = `translateX(${offset * 40}%) scale(0.6)`;
                  opacity = 0;
                  scale = 0.6;
                  zIndex = 1;
                  blur = 'blur-[4px]';
                }

                return (
                  <div
                    key={item.id}
                    className={`absolute transition-all duration-500 ease-in-out cursor-pointer ${blur}`}
                    style={{
                      transform,
                      opacity,
                      zIndex,
                      width: '300px',
                      height: '400px'
                    }}
                    onClick={() => {
                      if (offset !== 0) {
                        setCurrentMenuIndex(item.originalIndex);
                      }
                    }}
                  >
                    <div className="relative w-full h-full bg-white/95 rounded-3xl shadow-2xl overflow-hidden border-2 border-gold hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:border-gold/80 group">
                      {/* Card Background Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-pink-200/10 rounded-3xl"></div>
                      
                      <div className="w-full h-64 bg-gray-100 flex items-center justify-center relative overflow-hidden">
            <Image
                          src={item.imageUrl?.startsWith("/uploads/") ? `${API_BASE}${item.imageUrl}` : item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Image Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 backdrop-blur-sm">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">{item.name}</h3>
                          <p className="text-white/90 text-sm mb-2 leading-relaxed">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-white font-bold text-xl bg-gradient-to-r from-gold to-pink-400 bg-clip-text text-transparent">ALL {item.price}</p>
                            <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center group-hover:bg-gold/40 transition-colors duration-300">
                              <div className="w-3 h-3 bg-gold rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Corner Decoration */}
                      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold rounded-tr-lg opacity-60"></div>
                      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold rounded-bl-lg opacity-60"></div>
                    </div>
                  </div>
                );
              })}


            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2">
              {randomMenuItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMenuIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentMenuIndex
                      ? 'bg-royal-purple scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to menu item ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        </section>

        {/* Action Buttons */}
        <section className="py-12 px-4 relative overflow-hidden">
          {/* Moving Blurry Balls Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-48 h-48 bg-royal-purple/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-40 h-40 bg-royal-blue/45 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-56 h-56 bg-gold/35 rounded-full blur-3xl animate-pulse delay-500"></div>
            <div className="absolute bottom-40 right-1/3 w-44 h-44 bg-royal-purple/50 rounded-full blur-2xl animate-pulse delay-1500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-royal-blue/40 rounded-full blur-3xl animate-pulse delay-2000"></div>
            <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-gold/30 rounded-full blur-2xl animate-pulse delay-750"></div>
            <div className="absolute bottom-1/3 left-1/3 w-32 h-32 bg-royal-purple/35 rounded-full blur-3xl animate-pulse delay-1250"></div>
          </div>
          
          <div className="relative z-10">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="px-8 py-3 text-lg bg-royal-purple text-white hover:bg-royal-blue transition-colors shadow-lg"
          >
            <Link href="/menu">{t('exploreOurMenu')}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="px-8 py-3 text-lg border-royal-purple text-royal-purple hover:bg-royal-purple hover:text-white transition-colors shadow-lg bg-transparent"
          >
            <Link href="/order">{t('placeCustomOrder')}</Link>
          </Button>
        </div>
          </div>
        </section>

        {/* About Us and News Section with Unified Background */}
        <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-yellow-50 to-purple-50">
          {/* Moving Blurry Balls Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-48 h-48 bg-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-40 h-40 bg-yellow-200/35 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-56 h-56 bg-purple-200/25 rounded-full blur-3xl animate-pulse delay-500"></div>
            <div className="absolute bottom-40 right-1/3 w-44 h-44 bg-pink-300/40 rounded-full blur-2xl animate-pulse delay-1500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-yellow-300/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
            <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-purple-300/20 rounded-full blur-2xl animate-pulse delay-750"></div>
            <div className="absolute bottom-1/3 left-1/3 w-32 h-32 bg-pink-200/25 rounded-full blur-3xl animate-pulse delay-1250"></div>
          </div>
          
          <div className="relative z-10">
            {/* About Us Section */}
            <section className="py-16 px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-royal-purple mb-8 text-center">{t('aboutUs')}</h2>
                
                <div className="border-2 border-gold rounded-2xl p-8 md:p-12 shadow-lg bg-white/70 relative overflow-hidden">
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                                         <Image
                       src="/donutspic.jpg"
                       alt="Donuts Background"
                       fill
                       className="object-cover opacity-40 blur-sm"
                     />
                  </div>
                  <div className="relative z-10">
                  <div className="text-center space-y-6">
                    <ScrollFadeIn threshold={0.2} delay={0}>
                      <p className={`text-lg md:text-xl text-royal-blue leading-relaxed ${playfairDisplay.className}`} style={{ fontWeight: 400, opacity: 0.9 }}>
                        {t('aboutStory')}
                      </p>
                    </ScrollFadeIn>
                    
                    <ScrollFadeIn threshold={0.2} delay={150}>
                      <p className={`text-lg md:text-xl text-royal-blue leading-relaxed ${playfairDisplay.className}`} style={{ fontWeight: 400, opacity: 0.9 }}>
                        {t('philosophyDescription1')}
                      </p>
                    </ScrollFadeIn>
                    
                    <ScrollFadeIn threshold={0.2} delay={300}>
                      <p className={`text-lg md:text-xl text-royal-blue leading-relaxed ${playfairDisplay.className}`} style={{ fontWeight: 400, opacity: 0.9 }}>
                        {t('teamDescription')}
                      </p>
                    </ScrollFadeIn>
                    
                    <div className="pt-6">
                      <Button
                        asChild
                        className="px-8 py-3 text-lg bg-royal-purple text-white hover:bg-royal-blue transition-colors shadow-lg"
                      >
                        <Link href="/about">{t('learnMoreAboutUs')}</Link>
                      </Button>
            </div>
            </div>
            </div>
          </div>
        </div>
      </section>

            {/* News Section */}
      <FeedSection />
          </div>
        </div>
      </div>
    </div>
  );
}
