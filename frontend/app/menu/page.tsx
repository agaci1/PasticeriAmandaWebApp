"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientText } from "@/components/ui/gradient-text"
import Image from "next/image"
import { useEffect, useState } from "react"
import { authenticatedFetch } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { useTranslation } from "@/contexts/TranslationContext"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  priceType?: string
  imageUrl: string
  category: string
}

type CategoryFilter = 'cakes' | 'sweets' | 'other'

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('cakes')
  const { toast } = useToast()
  const router = useRouter()
  const loggedIn = isAuthenticated()
  const { t } = useTranslation()

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        const res = await authenticatedFetch("/api/products") // Assuming /api/products endpoint for menu items
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data: MenuItem[] = await res.json()
        setMenuItems(data)
      } catch (err) {
        console.error("Failed to fetch menu items:", err)
        setError(t("failedToLoadMenu"))
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
  }, [toast])

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

  // Get category for an item
  const getItemCategory = (item: MenuItem): CategoryFilter => {
    const category = item.category.toLowerCase();
    if (category.includes('cake') || category.includes('pastry')) {
      return 'cakes';
    } else if (category.includes('sweet') || category.includes('candy') || category.includes('chocolate') || category.includes('dessert')) {
      return 'sweets';
    } else {
      return 'other';
    }
  };

  // Filter menu items based on active filter
  const filteredItems = menuItems.filter(item => {
    return getItemCategory(item) === activeFilter;
  });

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
      <GradientText className="text-4xl md:text-5xl font-extrabold text-center mb-8">{t("ourDeliciousMenu")}</GradientText>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const itemCategory = getItemCategory(item);
            const styling = getCardStyling(itemCategory);
            
            return (
              <Card
                key={item.id}
                className={`overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 ${styling.borderColor} hover:scale-105 ${styling.shadowColor}`}
              >
                <div className="relative w-full h-48">
                  <Image
                    src={item.imageUrl ? `http://localhost:8081${item.imageUrl}` : "/placeholder.svg?height=300&width=400"}
                    alt={item.name}
                    fill
                    className="rounded-t-lg object-cover"
                    onError={(e) => {
                      console.error("Failed to load image:", item.imageUrl);
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg?height=300&width=400";
                    }}
                    onLoad={() => {
                      console.log("Image loaded successfully:", item.imageUrl);
                    }}
                  />
                </div>
                <CardHeader className="text-center">
                  <CardTitle className={`text-xl ${styling.titleColor}`}>{item.name}</CardTitle>
                  <p className={`text-sm ${styling.categoryColor}`}>{item.category}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-royal-blue text-base font-medium text-center">{item.description}</p>
                  <div className="flex flex-col items-center gap-3">
                    <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent text-xl font-bold whitespace-nowrap">
                      ALL{item.price}{item.priceType && item.priceType !== "Total" ? item.priceType : ""}
                    </span>
                    <Button
                      onClick={() => loggedIn ? handleAddToCart(item) : router.push("/auth/login")}
                      className={`${styling.buttonColor} text-white transition-colors`}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {loggedIn ? t("addToCart") : t("login")}
                    </Button>
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
