'use client'

import React, { useEffect, useState } from "react"
import { authenticatedFetch } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useTranslation } from "@/contexts/TranslationContext"

interface Order {
  id: number
  customerName: string
  customerEmail: string
  customerPhone: string
  productName: string
  numberOfPersons: number
  totalPrice: number | null
  orderDate: string
  status: string
  customNote?: string
  flavour?: string
  imageUrls?: string
}

export default function AdminCompletedOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewOrder, setViewOrder] = useState<Order | null>(null)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const { t } = useTranslation()

  // Function to convert English flavor names to Albanian for display
  const convertFlavourToAlbanian = (englishFlavour: string): string => {
    const flavourMap: { [key: string]: string } = {
      "No Preference": t("noPreference"),
      "Chocolate": t("chocolate"),
      "Vanilla": t("vanilla"),
      "Snickers": t("snickers"),
      "Oreo": t("oreo"),
      "Berries": t("berries"),
      "Strawberry": t("strawberry"),
      "Caramel": t("caramel"),
      "Velvet": t("velvet"),
      "Kinder Bueno": t("kinderBueno"),
      "Lacta": t("lacta"),
      "Rafaelo": t("rafaelo"),
      "Tiramisu": t("tiramisu"),
      "Scandal": t("scandal"),
      "Kiss": t("kiss"),
      "Pistachio": t("pistachio"),
      "Dubai": t("dubai"),
      "Other": t("other")
    }
    
    return flavourMap[englishFlavour] || englishFlavour
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await authenticatedFetch("/api/orders")
      const data: Order[] = await res.json()
      setOrders(data.filter(o => o.status === "completed"))
    } catch {
      setError("Failed to load completed orders.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const getOrderType = (order: Order) => {
    if (order.productName === "Custom Order" || order.customNote || order.imageUrls) {
      return "Custom"
    }
    return "Menu"
  }

  const getImageUrls = (imageUrls: string) => {
    if (!imageUrls) return []
    return imageUrls.split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0) // Filter out empty URLs
  }

  const getFullImageUrl = (url: string) => {
    return url.startsWith('/uploads/') ? `http://localhost:8081${url}` : url
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-[calc(100vh-4rem)]">
      <div className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-royal-purple mb-2">Completed Orders</h1>
        <p className="text-royal-blue text-lg">Successfully fulfilled customer orders</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-purple"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-royal-blue text-xl">No completed orders yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gold/20 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{order.customerName}</h3>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                    #{order.id}
                  </span>
                </div>
                <p className="text-white/90 text-sm">{order.customerPhone}</p>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-royal-blue font-semibold">Product:</span>
                    <span className="text-gray-700">{order.productName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-royal-blue font-semibold">Quantity:</span>
                    <span className="text-gray-700">{order.numberOfPersons}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-royal-blue font-semibold">Price:</span>
                    <span className="text-gray-700 font-bold">ALL{order.totalPrice || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-royal-blue font-semibold">Date:</span>
                    <span className="text-gray-700">{order.orderDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-royal-blue font-semibold">Type:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      getOrderType(order) === 'Custom' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {getOrderType(order)}
                    </span>
                  </div>
                  {order.flavour && (
                    <div className="flex justify-between items-center">
                      <span className="text-royal-blue font-semibold">Shija:</span>
                                              <span className="text-gray-700 font-medium">{convertFlavourToAlbanian(order.flavour)}</span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setViewOrder(order)}
                    className="flex-1 border-royal-purple text-royal-purple hover:bg-royal-purple hover:text-white transition-colors"
                  >
                    👁️ View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Order Details Dialog */}
      <Dialog open={!!viewOrder} onOpenChange={open => !open && setViewOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-royal-purple">Order Details</DialogTitle>
            <DialogDescription className="text-royal-blue">Complete information for order #{viewOrder?.id}</DialogDescription>
          </DialogHeader>
          {viewOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">👤 Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><span className="font-semibold">Name:</span> {viewOrder.customerName}</div>
                  <div><span className="font-semibold">Email:</span> {viewOrder.customerEmail}</div>
                  <div><span className="font-semibold">Phone:</span> {viewOrder.customerPhone}</div>
                  <div><span className="font-semibold">Order ID:</span> #{viewOrder.id}</div>
                </div>
              </div>
              
              {/* Order Details */}
              <div className="bg-white border border-gold/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-royal-purple mb-4">📋 Order Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><span className="font-semibold text-royal-blue">Product:</span> {viewOrder.productName}</div>
                  <div><span className="font-semibold text-royal-blue">Quantity:</span> {viewOrder.numberOfPersons}</div>
                  <div><span className="font-semibold text-royal-blue">Price:</span> ALL{viewOrder.totalPrice || 'N/A'}</div>
                  <div><span className="font-semibold text-royal-blue">Date:</span> {viewOrder.orderDate}</div>
                  <div><span className="font-semibold text-royal-blue">Type:</span> 
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      getOrderType(viewOrder) === 'Custom' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {getOrderType(viewOrder)}
                    </span>
                  </div>
                  {viewOrder.flavour && (
                    <div><span className="font-semibold text-royal-blue">Shija:</span> 
                                              <span className="ml-2 text-gray-700 font-medium">{convertFlavourToAlbanian(viewOrder.flavour)}</span>
                    </div>
                  )}
                  <div><span className="font-semibold text-royal-blue">Status:</span> 
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800`}>
                      {viewOrder.status}
                    </span>
                  </div>
                </div>
                {viewOrder.customNote && (
                  <div className="mt-4">
                    <span className="font-semibold text-royal-blue">Description:</span>
                    <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-700">{viewOrder.customNote}</p>
                  </div>
                )}
              </div>
              
              {/* Images Section */}
              {viewOrder.imageUrls && getImageUrls(viewOrder.imageUrls).length > 0 && (
                <div className="bg-white border border-gold/20 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-royal-purple mb-4">📸 Order Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getImageUrls(viewOrder.imageUrls).map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={getFullImageUrl(url)}
                          alt={`Order Image ${idx + 1}`}
                          className="w-full h-48 object-cover rounded-lg border-2 border-gold/30 hover:border-royal-purple transition-all duration-300 cursor-pointer"
                          onClick={() => setEnlargedImage(getFullImageUrl(url))}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 font-semibold">Click to enlarge</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Enlargement Dialog */}
      <Dialog open={!!enlargedImage} onOpenChange={open => !open && setEnlargedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <div className="relative">
            <img
              src={enlargedImage || ''}
              alt="Enlarged Image"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <Button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              size="sm"
            >
              ✕
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 