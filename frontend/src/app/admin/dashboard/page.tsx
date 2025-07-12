import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCartIcon } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
  const supabase = createServerClient()

  // Fetch some dummy stats for the dashboard
  const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })
  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

  return (
    <div className="space-y-8">
      <h1 className="font-title text-4xl font-bold text-royalPurple text-outline-royal-purple">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-royalBlue">Total Orders</CardTitle>
            <ShoppingCartIcon className="h-6 w-6 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-royalPurple">{totalOrders || 0}</div>
            <p className="text-xs text-gray-500">All time orders</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg animate-fade-in-up delay-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-royalBlue">Pending Orders</CardTitle>
            <Package className="h-6 w-6 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-royalPurple">{pendingOrders || 0}</div>
            <p className="text-xs text-gray-500">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg animate-fade-in-up delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-royalBlue">Total Products</CardTitle>
            <DollarSign className="h-6 w-6 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-royalPurple">{totalProducts || 0}</div>
            <p className="text-xs text-gray-500">Items on your menu</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg animate-fade-in-up delay-300">
        <CardHeader>
          <CardTitle className="font-title text-2xl text-royalPurple">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Link href="/admin/orders" passHref>
            <Button className="w-full bg-royalBlue text-white hover:bg-gold">Manage Customer Orders</Button>
          </Link>
          <Link href="/admin/menu" passHref>
            <Button className="w-full bg-royalBlue text-white hover:bg-gold">Edit Menu Items</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
