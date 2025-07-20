import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientText } from "@/components/ui/gradient-text"
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <GradientText className="text-4xl md:text-5xl font-extrabold text-center">Admin Dashboard</GradientText>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-royal-purple">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal-blue">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-royal-purple">New Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal-blue">+1,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-royal-purple">Customers</CardTitle>
            <Users className="w-4 h-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal-blue">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-royal-purple">Total Products</CardTitle>
            <Package className="w-4 h-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal-blue">150</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
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
                View Orders in Progress
              </Button>
            </Link>
            <Link href="/admin/menu-management">
              <Button className="w-full bg-royal-purple text-white hover:bg-royal-blue transition-colors">
                Manage Menu Items
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full border-royal-purple text-royal-purple hover:bg-royal-purple hover:text-white transition-colors bg-transparent"
            >
              Generate Sales Report
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
          <CardHeader>
            <CardTitle className="text-royal-purple">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-royal-blue">
              <li>
                <span className="font-semibold">New Order #1023</span> from Jane Doe - Custom Cake
              </li>
              <li>
                <span className="font-semibold">Menu Update:</span> Added "Lavender Macarons"
              </li>
              <li>
                <span className="font-semibold">Order #1020</span> marked as Completed
              </li>
              <li>
                <span className="font-semibold">New Client Signup:</span> John Smith
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
