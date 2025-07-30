"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAdmin, isAuthenticated } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Package2, ClipboardList, Utensils, ListOrdered } from "lucide-react"
import Link from "next/link"
import { GradientText } from "@/components/ui/gradient-text"

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Check authentication and admin status
    if (!isAuthenticated()) {
      router.push("/auth/login")
      return
    }
    
    if (!isAdmin()) {
      router.push("/")
      return
    }
  }, [router])

  const adminLinks = [
    {
      title: "Dashboard",
      description: "View overview and statistics",
      href: "/admin/dashboard",
      icon: Package2,
      color: "bg-blue-500"
    },
    {
      title: "Orders",
      description: "Manage customer orders",
      href: "/admin/orders/new",
      icon: ClipboardList,
      color: "bg-green-500"
    },
    {
      title: "Menu Management",
      description: "Manage products and categories",
      href: "/admin/menu-management",
      icon: Utensils,
      color: "bg-purple-500"
    },
    {
      title: "Feed Management",
      description: "Manage social media feed",
      href: "/admin/feed",
      icon: ListOrdered,
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-white" style={{
          textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
        }}>
          Admin Panel
        </h1>
        <p className="text-gray-600 text-lg">Welcome to the Pasticeri Amanda administration panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-200">
              <div className={`w-12 h-12 rounded-lg ${link.color} flex items-center justify-center mb-4`}>
                <link.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{link.title}</h3>
              <p className="text-gray-600">{link.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button asChild className="bg-royal-purple hover:bg-royal-blue">
          <Link href="/">← Back to Website</Link>
        </Button>
      </div>
    </div>
  )
} 