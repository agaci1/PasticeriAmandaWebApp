"use client"

import { Calendar } from "@/components/ui/calendar"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GradientText } from "@/components/ui/gradient-text"
import { useEffect, useState } from "react"
import { authenticatedFetch } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Search } from "lucide-react"
import { format } from "date-fns"

interface Order {
  id: string
  customerName: string
  customerEmail: string
  orderType: "MENU_ITEM" | "CUSTOM"
  description: string
  status: string // Should be 'COMPLETED'
  price: number | null
  orderDate: string
  completionDate: string // New field for completed orders
}

export default function AdminCompletedOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterMonth, setFilterMonth] = useState<Date | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const { toast } = useToast()

  const fetchCompletedOrders = async () => {
    try {
      setLoading(true)
      const res = await authenticatedFetch("/api/admin/orders/completed") // Assuming /api/admin/orders/completed
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data: Order[] = await res.json()
      setOrders(data)
    } catch (err) {
      console.error("Failed to fetch completed orders:", err)
      setError("Failed to load completed orders. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load completed orders.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompletedOrders()
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesMonth =
      !filterMonth ||
      (new Date(order.completionDate).getMonth() === filterMonth.getMonth() &&
        new Date(order.completionDate).getFullYear() === filterMonth.getFullYear())
    const matchesSearch =
      searchTerm === "" ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesMonth && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] text-royal-blue">
        <p>Loading completed orders...</p>
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
    <div className="space-y-8">
      <GradientText className="text-4xl md:text-5xl font-extrabold text-center">Completed Orders</GradientText>

      <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
        <CardHeader>
          <CardTitle className="text-royal-purple">Filter Completed Orders</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-8 bg-white border-royal-blue text-royal-blue"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal bg-white border-royal-blue ${
                  !filterMonth && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gold" />
                {filterMonth ? format(filterMonth, "MMM yyyy") : <span>Filter by Completion Month</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border-gold">
              <Calendar
                mode="single"
                selected={filterMonth}
                onSelect={setFilterMonth}
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={2023}
                toYear={new Date().getFullYear() + 1}
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
        <CardHeader>
          <CardTitle className="text-royal-purple">Completed Orders List</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-royal-purple/10 text-royal-purple">
                    <TableHead className="w-[100px]">Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Completion Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="text-royal-blue hover:bg-gold/10">
                      <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.orderType === "CUSTOM" ? "Custom" : "Menu"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{order.description}</TableCell>
                      <TableCell className="text-right">${order.price?.toFixed(2) || "N/A"}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(order.completionDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-royal-blue text-lg py-8">
              No completed orders found matching your criteria.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
