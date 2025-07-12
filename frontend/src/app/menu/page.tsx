"use client" // This page needs to be a client component to fetch data on mount

import React, { useState, useEffect } from "react"
import { WavySeparator } from "@/components/wavy-separator"
import { ProductCard } from "@/components/product-card"
import Image from "next/image"
import { createClientComponentClient } from "@/lib/supabase/client"

interface Product {
  id: string
  name: string
  description: string
  image_url: string | null
  base_price: number
  price_per_person: number
  category: string
}

interface CategoryData {
  id: string
  name: string
  description: string
  products: Product[]
}

export default function MenuPage() {
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([])

  useEffect(() => {
    const fetchMenuData = async () => {
      const supabase = createClientComponentClient()
      const { data: products, error } = await supabase.from("products").select("*").order("category").order("name")

      if (error) {
        console.error("Error fetching menu products:", error.message)
        return
      }

      const groupedProducts: { [key: string]: Product[] } = {}
      products.forEach((p) => {
        if (!groupedProducts[p.category]) {
          groupedProducts[p.category] = []
        }
        groupedProducts[p.category].push(p as Product)
      })

      const categoriesOrder = [
        {
          id: "normal-cakes",
          name: "🎂 Normal Cakes",
          description:
            "Perfect for birthdays, anniversaries, or any celebration, our normal cakes are crafted to bring joy to every slice.",
        },
        {
          id: "wedding-cakes",
          name: "💍 Wedding Cakes",
          description:
            "Exquisite designs for your special day, our wedding cakes are masterpieces of elegance and taste, tailored to your dream.",
        },
        {
          id: "sweets",
          name: "🍬 Sweets",
          description: "Delightful small treats for any occasion, perfect for dessert tables or a sweet indulgence.",
        },
        {
          id: "special-orders",
          name: "💎 Special Orders",
          description:
            "Have something unique in mind? At Amanda Pastry Shop, we craft custom cakes based on your imagination. Upload an image or leave a note — we’ll bring your dessert dreams to life with elegance and precision.",
        },
      ]

      const finalCategories: CategoryData[] = categoriesOrder.map((cat) => ({
        ...cat,
        products: groupedProducts[cat.id] || [],
      }))

      setCategoriesData(finalCategories)
    }

    fetchMenuData()
  }, [])

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white text-royalPurple">
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/placeholder.svg?height=720&width=1280"
          alt="Menu Hero"
          layout="fill"
          objectFit="cover"
          className="z-0 animate-fade-in-up"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-babyPink/60 to-transparent z-10" />
        <h1 className="relative z-20 font-title text-5xl md:text-6xl font-bold text-white drop-shadow-lg animate-slide-in-left text-outline-pink">
          Our Exquisite Menu
        </h1>
      </section>

      <WavySeparator color="#F8C8DC" height={80} className="-mt-10 z-30" />

      {categoriesData.map((category, index) => (
        <React.Fragment key={category.id}>
          <section className={`py-16 px-4 md:px-6 ${index % 2 === 0 ? "bg-babyPink" : "bg-white"}`}>
            <div className="max-w-6xl mx-auto text-center space-y-8">
              <h2 className="font-title text-4xl md:text-5xl font-bold text-royalPurple animate-fade-in-up">
                {category.name}
              </h2>
              <p className="font-body text-lg text-gray-700 animate-fade-in-up delay-100">{category.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                {category.products.map((product, prodIndex) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    description={product.description}
                    imageUrl={product.image_url} // Use imageUrl
                    price={`$${product.base_price.toFixed(2)} - $${(product.base_price + product.price_per_person * 10).toFixed(2)}`} // Example price range
                    className={`animate-fade-in-up delay-${200 + prodIndex * 100}`}
                  />
                ))}
              </div>
            </div>
          </section>
          {index < categoriesData.length - 1 && (
            <WavySeparator
              color={index % 2 === 0 ? "#FFFFFF" : "#F8C8DC"}
              height={80}
              className={`z-30 ${index % 2 === 0 ? "rotate-180" : ""}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
