"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { saveCartData, getFormData, clearFormData } from "@/lib/form-persistence"
import { useAuth } from "@/hooks/use-auth"

// Force dynamic rendering to avoid localStorage issues during build
export const dynamic = 'force-dynamic'

interface CartItem {
  id: number
  name: string
  price: number
  priceType: string
  imageUrl: string
  quantity: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [checkoutInfo, setCheckoutInfo] = useState({ name: "", surname: "", phone: "", email: "" })
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [infoError, setInfoError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
    
    // Set email from localStorage after component mounts
    const userEmail = localStorage.getItem("user_email");
    if (userEmail) {
      setCheckoutInfo(prev => ({ ...prev, email: userEmail }));
    }
  }, []);

  // Restore form data after login
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const savedData = getFormData()
      if (savedData && savedData.type === 'cart') {
        // Restore checkout info
        setCheckoutInfo(prev => ({
          ...prev,
          name: savedData.name || prev.name,
          surname: savedData.surname || prev.surname,
          phone: savedData.phone || prev.phone,
          email: savedData.email || prev.email,
        }))
        // Clear the saved data
        clearFormData()
      }
    }
  }, [isAuthenticated, isLoading])

  const updateQuantity = (id: number, quantity: number) => {
    const updated = cart.map(item => item.id === id ? { ...item, quantity } : item)
    setCart(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const removeItem = (id: number) => {
    const updated = cart.filter(item => item.id !== id)
    setCart(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckoutInfo({ ...checkoutInfo, [e.target.name]: e.target.value })
  }

  const handleLoginRedirect = () => {
    // Save current checkout info before redirecting
    saveCartData({
      name: checkoutInfo.name,
      surname: checkoutInfo.surname,
      phone: checkoutInfo.phone,
      email: checkoutInfo.email,
    })
    
    // Redirect to login with return URL
    router.push(`/auth/login?redirect=${encodeURIComponent('/cart')}`)
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      handleLoginRedirect()
      return
    }
    
    // Always set email from localStorage if available
    setCheckoutInfo(info => ({ ...info, email: localStorage.getItem("user_email") || info.email }))
    setShowInfoModal(true)
  }

  const handleConfirm = async () => {
    if (!checkoutInfo.name || !checkoutInfo.surname || !checkoutInfo.phone || !checkoutInfo.email) {
      setInfoError("All fields are required.")
      return
    }
    setInfoError("")
    setIsSubmitting(true)
    try {
      const res = await fetch("http://localhost:8080/api/orders/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("auth_token")}` },
        body: JSON.stringify({
          items: cart,
          ...checkoutInfo,
        }),
      })
      if (!res.ok) throw new Error("Failed to place order.")
      alert("Order confirmed! You will receive a confirmation email.")
      setCart([])
      localStorage.removeItem("cart")
      setShowInfoModal(false)
    } catch (err) {
      setInfoError("Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-4rem)]">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-purple"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-4rem)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-royal-purple mb-4">🛒 Your Cart</h1>
        <p className="text-royal-blue text-xl">Review your delicious selections</p>
      </div>
      
      {cart.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-royal-purple mb-4">Your cart is empty</h2>
          <p className="text-royal-blue text-lg mb-8">Add some delicious treats to get started!</p>
          <Button 
            onClick={() => window.location.href = "/menu"} 
            className="bg-gradient-to-r from-royal-purple to-royal-blue text-white hover:from-royal-blue hover:to-royal-purple text-lg px-8 py-3 rounded-full"
          >
            🍰 Browse Menu
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
              <CardHeader>
                <CardTitle className="text-royal-purple">Cart Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-white/50 rounded-lg border border-gold/20">
                    <img
                      src={item.imageUrl ? `http://localhost:8080${item.imageUrl}` : "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-royal-blue">{item.name}</h3>
                      <p className="text-sm text-gray-600">ALL{item.price} per {item.priceType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="w-8 h-8 p-0"
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 p-0"
                      >
                        +
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-royal-purple">ALL{(item.price * item.quantity).toFixed(2)}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
              <CardHeader>
                <CardTitle className="text-royal-purple">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>ALL{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-royal-purple">ALL{total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-royal-purple to-royal-blue text-white hover:from-royal-blue hover:to-royal-purple py-3 text-lg font-semibold"
                  disabled={cart.length === 0}
                >
                  {!isAuthenticated ? (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Login to Checkout
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-royal-purple">Checkout Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-royal-blue mb-1">Name</label>
                <Input
                  name="name"
                  value={checkoutInfo.name}
                  onChange={handleInfoChange}
                  className="bg-white border-royal-blue text-royal-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-royal-blue mb-1">Surname</label>
                <Input
                  name="surname"
                  value={checkoutInfo.surname}
                  onChange={handleInfoChange}
                  className="bg-white border-royal-blue text-royal-blue"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-royal-blue mb-1">Phone</label>
              <Input
                name="phone"
                value={checkoutInfo.phone}
                onChange={handleInfoChange}
                className="bg-white border-royal-blue text-royal-blue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-royal-blue mb-1">Email</label>
              <Input
                name="email"
                type="email"
                value={checkoutInfo.email}
                onChange={handleInfoChange}
                className="bg-white border-royal-blue text-royal-blue"
                required
              />
            </div>
            {infoError && (
              <p className="text-red-600 text-sm">{infoError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowInfoModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="bg-royal-purple hover:bg-royal-blue"
            >
              {isSubmitting ? "Processing..." : "Confirm Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 