"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientText } from "@/components/ui/gradient-text"
import Image from "next/image"
import { useEffect, useState, useMemo } from "react"
import { authenticatedFetch } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { useTranslation } from "@/contexts/TranslationContext"
import API_BASE from "@/lib/api"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  priceType?: string
  imageUrl: string
  category: string
}

// Backend Product interface (what we receive from API)
interface BackendProduct {
  id: number | string  // Backend returns Long, which can be number or string
  name: string
  description: string
  price: number
  priceType?: string
  imageUrl: string
  category: string
}

type CategoryFilter = 'cakes' | 'sweets' | 'other'

// Pure function to get category - moved outside component for better performance
const getItemCategory = (item: MenuItem): CategoryFilter => {
  if (!item.category) {
    return 'other'
  }
  
  const category = item.category.toLowerCase().trim();
  
  // Check for cakes category
  if (category === 'cakes' || category === 'cake' || category.includes('cake') || category.includes('pastry')) {
    return 'cakes';
  }
  
  // Check for sweets category
  if (category === 'sweets' || category === 'sweet' || 
      category.includes('sweet') || category.includes('candy') || 
      category.includes('chocolate') || category.includes('dessert')) {
    return 'sweets';
  }
  
  // Default to other
  return 'other';
};

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('cakes')
  const { toast } = useToast()
  const router = useRouter()
  const loggedIn = isAuthenticated()
  const { t } = useTranslation()

  // Helper function to normalize image URL
  const getImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl) {
      return "/placeholder.svg?height=300&width=400"
    }
    
    // If URL already starts with http/https, use it as-is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    
    // If URL starts with /uploads/, prepend API_BASE
    if (imageUrl.startsWith('/uploads/')) {
      return `${API_BASE}${imageUrl}`
    }
    
    // If it doesn't start with /, add it
    const normalizedUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
    return `${API_BASE}${normalizedUrl}`
  }

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await authenticatedFetch("/api/products")
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const backendData: BackendProduct[] = await res.json()
        
        // Convert backend data to frontend format
        // Ensure IDs are strings and handle image URLs properly
        const normalizedData: MenuItem[] = backendData.map((product) => ({
          id: String(product.id), // Convert Long/number to string
          name: product.name || '',
          description: product.description || '',
          price: product.price || 0,
          priceType: product.priceType,
          imageUrl: product.imageUrl || '',
          category: product.category || 'other',
        }))
        
        setMenuItems(normalizedData)
      } catch (err) {
        console.error("Failed to fetch menu items:", err)
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        setError(errorMessage)
        toast({
          title: t("error"),
          description: t("failedToLoadMenuItems"),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
    // Remove toast from dependencies to prevent unnecessary re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddToCart = (item: MenuItem) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i: any) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        priceType: item.priceType,
        imageUrl: item.imageUrl,
        quantity: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    toast({ title: t("itemAddedToCart"), description: `${item.name} ${t("itemAddedDescription")}` });
  };

  // Filter menu items based on active filter - memoized for performance
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      return getItemCategory(item) === activeFilter;
    });
  }, [menuItems, activeFilter]);

  // Get card styling based on category
  const getCardStyling = (category: CategoryFilter) => {
    switch (category) {
      case 'cakes':
        return {
          borderColor: 'border-purple-500',
          titleColor: 'text-purple-700',
          categoryColor: 'text-purple-600',
          buttonColor: 'bg-purple-600 hover:bg-purple-700',
          shadowColor: 'hover:shadow-purple-200'
        };
      case 'sweets':
        return {
          borderColor: 'border-yellow-500',
          titleColor: 'text-yellow-700',
          categoryColor: 'text-yellow-600',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
          shadowColor: 'hover:shadow-yellow-200'
        };
      case 'other':
        return {
          borderColor: 'border-pink-500',
          titleColor: 'text-pink-700',
          categoryColor: 'text-pink-600',
          buttonColor: 'bg-pink-600 hover:bg-pink-700',
          shadowColor: 'hover:shadow-pink-200'
        };
    }
  };

  const categoryButtons = [
    {
      id: 'cakes' as CategoryFilter,
      label: t('cakes'),
      color: 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900',
      borderColor: 'border-purple-600',
      textColor: 'text-white'
    },
    {
      id: 'sweets' as CategoryFilter,
      label: t('sweets'),
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
      borderColor: 'border-yellow-500',
      textColor: 'text-white'
    },
    {
      id: 'other' as CategoryFilter,
      label: t('other'),
      color: 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
      borderColor: 'border-pink-500',
      textColor: 'text-white'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] text-royal-blue">
        <p>{t("loadingMenu")}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-white" style={{
        textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
      }}>
        {t("ourDeliciousMenu")}
      </h1>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categoryButtons.map((button) => (
          <Button
            key={button.id}
            onClick={() => setActiveFilter(button.id)}
            className={`px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg border-2 ${button.color} ${button.borderColor} ${button.textColor} ${
              activeFilter === button.id 
                ? 'ring-4 ring-offset-2 ring-offset-white ring-opacity-50 scale-105' 
                : 'hover:shadow-xl'
            }`}
          >
            {button.label}
          </Button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-center mb-8">
        <p className="text-lg text-royal-blue">
          {t("showingItems", { count: filteredItems.length, category: categoryButtons.find(b => b.id === activeFilter)?.label || '' })}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const itemCategory = getItemCategory(item);
            const styling = getCardStyling(itemCategory);
            const imageSrc = getImageUrl(item.imageUrl);
            
            return (
              <Card
                key={item.id}
                className={`overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 ${styling.borderColor} hover:scale-105 ${styling.shadowColor}`}
              >
                <div className="relative w-full h-32 sm:h-40 md:h-48 bg-gray-100">
                  <Image
                    src={imageSrc}
                    alt={item.name || 'Menu item'}
                    fill
                    className="rounded-t-lg object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    loading="lazy"
                    onError={(e) => {
                      console.error("Failed to load image:", imageSrc, "Original URL:", item.imageUrl);
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg?height=300&width=400";
                    }}
                  />
                </div>
                <CardHeader className="text-center p-3 sm:p-4">
                  <CardTitle className={`text-sm sm:text-base md:text-xl ${styling.titleColor}`}>{item.name}</CardTitle>
                  <p className={`text-xs sm:text-sm ${styling.categoryColor}`}>{item.category}</p>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-4 p-3 sm:p-4">
                                     <p className="text-royal-blue text-xs sm:text-sm md:text-base font-medium text-center" style={{
                     display: '-webkit-box',
                     WebkitLineClamp: 4,
                     WebkitBoxOrient: 'vertical',
                     overflow: 'hidden',
                     lineHeight: '1.3em',
                     maxHeight: '5.2em'
                   }}>{item.description}</p>
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent text-sm sm:text-lg md:text-xl font-bold whitespace-nowrap">
                      ALL{item.price}{item.priceType && item.priceType !== "Total" ? item.priceType : ""}
                    </span>
                    
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-royal-blue text-lg mb-4">
              {t("noItemsFound", { category: categoryButtons.find(b => b.id === activeFilter)?.label || '' })}
            </p>
            <p className="text-royal-blue text-sm">
              {t("tryAnotherCategory")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
