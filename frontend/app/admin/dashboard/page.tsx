"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientText } from "@/components/ui/gradient-text"
import { DollarSign, ShoppingCart, Users, Package, RefreshCw, Eye } from "lucide-react"
import { useEffect, useState } from "react"
import API_BASE from "@/lib/api"
import { useTranslation } from "@/contexts/TranslationContext"

interface Order {
  id: number
  userId: number
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
  }>
  totalPrice: number
  status: string
  createdAt: string
  customerName?: string
  customerEmail?: string
}

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  newOrders: number
  totalCustomers: number
  totalProducts: number
}

export default function AdminDashboardPage() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    newOrders: 0,
    totalCustomers: 0,
    totalProducts: 0
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingFeed, setUpdatingFeed] = useState(false)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all orders
      const ordersResponse = await fetch(`${API_BASE}/api/orders`)
      const orders: Order[] = await ordersResponse.json()
      
      // Fetch products count
      const productsResponse = await fetch(`${API_BASE}/api/products`)
      const products = await productsResponse.json()
      
      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
      const totalOrders = orders.length
      const newOrders = orders.filter(order => order.status === 'new').length
      
      // Get unique customers
      const uniqueCustomers = new Set(orders.map(order => order.userId)).size
      
      setStats({
        totalRevenue,
        totalOrders,
        newOrders,
        totalCustomers: uniqueCustomers,
        totalProducts: products.length
      })
      
      // Get recent orders (last 5)
      const recent = orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
      setRecentOrders(recent)
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateFeed = async () => {
    try {
      setUpdatingFeed(true)
      // Here you would typically call an API to update the feed
      // For now, we'll just simulate the action
      await new Promise(resolve => setTimeout(resolve, 2000))
      // You can add actual feed update logic here
    } catch (error) {
      console.error('Error updating feed:', error)
    } finally {
      setUpdatingFeed(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <GradientText className="text-4xl md:text-5xl font-extrabold text-center">Admin Dashboard</GradientText>
        <div className="flex justify-center items-center h-64">
          <div className="text-royal-blue text-lg">Loading dashboard data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <GradientText className="text-4xl md:text-5xl font-extrabold text-center">Admin Dashboard</GradientText>

      {/* View New Orders Button - Top */}
      <div className="flex justify-center">
        <Link href="/admin/orders/new">
          <Button className="bg-royal-purple text-white hover:bg-royal-blue transition-colors px-8 py-3 text-lg">
            <Eye className="w-5 h-5 mr-2" />
            View New Orders
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-royal-purple">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal-blue">ALL{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all orders</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-royal-purple">Total Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal-blue">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-royal-purple">New Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal-blue">{stats.newOrders}</div>
            <p className="text-xs text-muted-foreground">Pending orders</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-royal-purple">Total Products</CardTitle>
            <Package className="w-4 h-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal-blue">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Menu items</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
          <CardHeader>
            <CardTitle className="text-royal-purple">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/admin/orders">
              <Button className="w-full bg-royal-purple text-white hover:bg-royal-blue transition-colors">
                View All Orders
              </Button>
            </Link>
            <Link href="/admin/menu-management">
              <Button className="w-full bg-royal-purple text-white hover:bg-royal-blue transition-colors">
                Manage Menu Items
              </Button>
            </Link>
            <Button
              onClick={handleUpdateFeed}
              disabled={updatingFeed}
              variant="outline"
              className="w-full border-royal-purple text-royal-purple hover:bg-royal-purple hover:text-white transition-colors bg-transparent"
            >
              {updatingFeed ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Updating Feed...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Update Feed
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
          <CardHeader>
            <CardTitle className="text-royal-purple">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <ul className="space-y-2 text-royal-blue">
                {recentOrders.map((order) => (
                  <li key={order.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">Order #{order.id}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        {order.items.length} items
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">ALL{order.totalPrice}</div>
                      <div className="text-xs text-gray-600 capitalize">{order.status}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-royal-blue text-center">No orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
