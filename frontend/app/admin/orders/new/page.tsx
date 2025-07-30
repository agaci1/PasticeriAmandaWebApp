'use client'

import React, { useEffect, useState } from "react"
import { authenticatedFetch } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useTranslation } from "@/contexts/TranslationContext"
import API_BASE from "@/lib/api"

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

export default function AdminNewOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [priceInputs, setPriceInputs] = useState<{ [id: number]: string }>({})
  const [setPriceId, setSetPriceId] = useState<number | null>(null)
  const [viewOrder, setViewOrder] = useState<Order | null>(null)
  const [actionLoading, setActionLoading] = useState<{ [id: number]: boolean }>({})
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
      setOrders(data.filter(o => o.status === "pending-quote"))
    } catch {
      setError("Failed to load new orders.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleSetPrice = async (id: number) => {
    const price = priceInputs[id]
    if (!price) return
    setActionLoading(prev => ({ ...prev, [id]: true }))
    try {
      await authenticatedFetch(`/api/orders/${id}/set-price`, {
        method: "PUT",
        body: JSON.stringify({ price: parseFloat(price) }),
        headers: { "Content-Type": "application/json" },
      })
      setPriceInputs(inputs => ({ ...inputs, [id]: "" }))
      setSetPriceId(null)
      fetchOrders()
    } catch (error) {
      console.error("Failed to set price:", error)
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }))
    }
  }

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
    return url.startsWith('/uploads/') ? `${API_BASE}${url}` : url
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-[calc(100vh-4rem)]">
      <div className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-royal-purple mb-2">New Orders</h1>
        <p className="text-royal-blue text-lg">Custom orders awaiting price confirmation</p>
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
          <div className="text-6xl mb-4">📋</div>
          <p className="text-royal-blue text-xl">No new orders at the moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gold/20 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-600 to-orange-600 text-white p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{order.customerName}</h3>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                    #{order.id}
                  </span>
                </div>
                <p className="text-sm opacity-90">{order.customerEmail}</p>
                <p className="text-sm opacity-90">{order.customerPhone}</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Order Type Badge */}
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    getOrderType(order) === "Custom" 
                      ? "bg-purple-100 text-purple-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {getOrderType(order)} Order
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Product Info */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Product:</h4>
                  <p className="text-gray-600">{order.productName}</p>
                </div>

                {/* Flavour Info */}
                {order.flavour && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Shija:</h4>
                    <p className="text-gray-600">{convertFlavourToAlbanian(order.flavour)}</p>
                  </div>
                )}

                {/* Custom Note */}
                {order.customNote && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Shënim:</h4>
                    <p className="text-gray-600 text-sm">{order.customNote}</p>
                  </div>
                )}

                {/* Images */}
                {order.imageUrls && getImageUrls(order.imageUrls).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Imazhe:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {getImageUrls(order.imageUrls).slice(0, 4).map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={getFullImageUrl(url)}
                            alt={`Order image ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg cursor-pointer"
                            onClick={() => setEnlargedImage(getFullImageUrl(url))}
                          />
                          {getImageUrls(order.imageUrls!).length > 4 && index === 3 && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                +{getImageUrls(order.imageUrls!).length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  {/* Set Price */}
                  {setPriceId === order.id ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Çmimi (ALL)"
                        value={priceInputs[order.id] || ""}
                        onChange={(e) => setPriceInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-purple"
                      />
                      <Button
                        onClick={() => handleSetPrice(order.id)}
                        disabled={actionLoading[order.id]}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                      >
                        {actionLoading[order.id] ? "..." : "Vendos"}
                      </Button>
                      <Button
                        onClick={() => {
                          setSetPriceId(null)
                          setPriceInputs(prev => ({ ...prev, [order.id]: "" }))
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                      >
                        Anulo
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setSetPriceId(order.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      Vendos Çmimin
                    </Button>
                  )}

                  {/* View Details */}
                  <Button
                    onClick={() => setViewOrder(order)}
                    variant="outline"
                    className="w-full border-royal-purple text-royal-purple hover:bg-royal-purple hover:text-white"
                  >
                    Shiko Detajet
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
          {viewOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-royal-purple">
                  Order #{viewOrder.id} - {viewOrder.customerName}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {viewOrder.customerEmail} • {viewOrder.customerPhone}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">Product:</h4>
                    <p className="text-gray-600">{viewOrder.productName}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Order Date:</h4>
                    <p className="text-gray-600">{new Date(viewOrder.orderDate).toLocaleDateString()}</p>
                  </div>
                  {viewOrder.flavour && (
                    <div>
                      <h4 className="font-semibold text-gray-800">Shija:</h4>
                      <p className="text-gray-600">{convertFlavourToAlbanian(viewOrder.flavour)}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-800">Status:</h4>
                    <p className="text-gray-600">{viewOrder.status}</p>
                  </div>
                </div>

                {/* Custom Note */}
                {viewOrder.customNote && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Shënim i Personalizuar:</h4>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{viewOrder.customNote}</p>
                  </div>
                )}

                {/* Images */}
                {viewOrder.imageUrls && getImageUrls(viewOrder.imageUrls).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Imazhe të Porosisë:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {getImageUrls(viewOrder.imageUrls).map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={getFullImageUrl(url)}
                            alt={`Order image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg cursor-pointer"
                            onClick={() => setEnlargedImage(getFullImageUrl(url))}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 font-semibold text-sm">
                              Kliko për të zmadhuar
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
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
              className="w-full h-auto max-h-[80vh] object-contain bg-white"
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