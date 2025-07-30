"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Lock, Search, Plus, Minus, X } from "lucide-react"
import { saveCartData, getFormData, clearFormData } from "@/lib/form-persistence"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/contexts/TranslationContext"
import API_BASE from "@/lib/api"

// Force dynamic rendering to avoid localStorage issues during build
export const dynamic = 'force-dynamic'

interface CartItem {
  id: number
  name: string
  price: number
  priceType: string
  imageUrl: string
  quantity: number
  category: string
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  priceType: string
  category: string
  imageUrl: string
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [checkoutInfo, setCheckoutInfo] = useState({ name: "", surname: "", phone: "", email: "", deliveryDateTime: "" })
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [infoError, setInfoError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedQuantities, setSelectedQuantities] = useState<{[key: number]: number}>({})
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
    
    // Set email from localStorage after component mounts
    const userEmail = localStorage.getItem("user_email");
    if (userEmail) {
      setCheckoutInfo(prev => ({ ...prev, email: userEmail }));
    }

    // Fetch products
    fetchProducts();
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

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

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
    if (!checkoutInfo.name || !checkoutInfo.surname || !checkoutInfo.phone || !checkoutInfo.email || !checkoutInfo.deliveryDateTime) {
      setInfoError("All fields are required.")
      return
    }
    setInfoError("")
    setIsSubmitting(true)
    try {
      const cartOrderData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          priceType: item.priceType,
          quantity: item.quantity
        })),
        name: checkoutInfo.name,
        surname: checkoutInfo.surname,
        phone: checkoutInfo.phone,
        email: checkoutInfo.email,
        deliveryDateTime: checkoutInfo.deliveryDateTime
      }
      
      const res = await fetch(`${API_BASE}/api/orders/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("auth_token")}` },
        body: JSON.stringify(cartOrderData),
      })
      
      if (!res.ok) {
        const errorData = await res.text()
        console.error("Order placement failed:", errorData)
        throw new Error("Failed to place order.")
      }
      
      alert(t("orderPlaced") + " " + t("thankYou"))
      setCart([])
      localStorage.removeItem("cart")
      setShowInfoModal(false)
    } catch (err) {
      console.error("Order placement error:", err)
      setInfoError(t("orderError") + " " + t("orderErrorMessage"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddItems = () => {
    setShowProductModal(true);
    // Initialize selected quantities with current cart items
    const initialQuantities: {[key: number]: number} = {};
    cart.forEach(item => {
      initialQuantities[item.id] = item.quantity;
    });
    setSelectedQuantities(initialQuantities);
  };

  const handleQuantityChange = (productId: number, change: number) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change)
    }));
  };

  const handleAddToCart = () => {
    const newCartItems: CartItem[] = [];
    
    Object.entries(selectedQuantities).forEach(([productId, quantity]) => {
      if (quantity > 0) {
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
          newCartItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            priceType: product.priceType,
            imageUrl: product.imageUrl,
            quantity: quantity,
            category: product.category
          });
        }
      }
    });

    setCart(newCartItems);
    localStorage.setItem("cart", JSON.stringify(newCartItems));
    setShowProductModal(false);
    setSelectedQuantities({});
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white" style={{
          textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
        }}>
          🛒 {t("shoppingCart")}
        </h1>
        <p className="text-royal-blue text-xl">{t("reviewSelections")}</p>
      </div>
      
      {cart.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-royal-purple mb-4">{t("cartEmpty")}</h2>
          <p className="text-royal-blue text-lg mb-8">{t("addDeliciousTreats")}</p>
          <Button 
            onClick={handleAddItems}
            className="bg-gradient-to-r from-royal-purple to-royal-blue text-white hover:from-royal-blue hover:to-royal-purple text-lg px-8 py-3 rounded-full"
          >
            🍰 {t("addItems")}
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-royal-purple">{t("cartItems")}</CardTitle>
                <Button 
                  onClick={handleAddItems}
                  className="bg-royal-purple hover:bg-royal-blue text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("addItems")}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white/50 rounded-lg border border-gold/20 min-w-0">
                    <img
                      src={item.imageUrl ? `${API_BASE}${item.imageUrl}` : "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-royal-blue truncate text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">ALL{item.price}{item.priceType && item.priceType !== "Total" ? item.priceType : ""}</p>
                      
                      {/* Quantity controls - moved here for better mobile layout */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-medium text-royal-blue">Sasia:</span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="w-8 h-8 p-0 bg-white hover:bg-gray-50 border-royal-purple text-royal-purple"
                          >
                            -
                          </Button>
                          <span className="w-12 text-center font-semibold text-lg bg-white px-2 py-1 rounded border border-royal-purple/20">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 p-0 bg-white hover:bg-gray-50 border-royal-purple text-royal-purple"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0 w-full sm:w-auto">
                      <p className="font-semibold text-royal-purple text-lg">ALL{(item.price * item.quantity).toFixed(2)}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1"
                      >
                        {t("remove")}
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
                <CardTitle className="text-royal-purple">{t("orderSummary")}</CardTitle>
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
                    <span></span>
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
                      {t("login")} {t("toCheckout")}
                    </>
                  ) : (
                    t("proceedToCheckout")
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Product Selection Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-royal-purple text-2xl">{t("selectProducts")}</DialogTitle>
          </DialogHeader>
          
          {/* Search and Filter */}
          <div className="space-y-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t("searchProducts")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-royal-blue"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === "all" ? "default" : "outline"}
                className={`cursor-pointer ${selectedCategory === "all" ? "bg-royal-purple text-white" : "border-royal-purple text-royal-purple"}`}
                onClick={() => setSelectedCategory("all")}
              >
                {t("all")}
              </Badge>
              <Badge
                variant={selectedCategory === "cakes" ? "default" : "outline"}
                className={`cursor-pointer ${selectedCategory === "cakes" ? "bg-royal-purple text-white" : "border-royal-purple text-royal-purple"}`}
                onClick={() => setSelectedCategory("cakes")}
              >
                {t("cakes")}
              </Badge>
              <Badge
                variant={selectedCategory === "sweets" ? "default" : "outline"}
                className={`cursor-pointer ${selectedCategory === "sweets" ? "bg-royal-purple text-white" : "border-royal-purple text-royal-purple"}`}
                onClick={() => setSelectedCategory("sweets")}
              >
                {t("sweets")}
              </Badge>
              <Badge
                variant={selectedCategory === "other" ? "default" : "outline"}
                className={`cursor-pointer ${selectedCategory === "other" ? "bg-royal-purple text-white" : "border-royal-purple text-royal-purple"}`}
                onClick={() => setSelectedCategory("other")}
              >
                {t("other")}
              </Badge>
            </div>
          </div>

          {/* Product List */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-4 bg-white/50 rounded-lg border border-gold/20">
                  <img
                    src={product.imageUrl ? `${API_BASE}${product.imageUrl}` : "/placeholder.svg"}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-royal-blue text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{product.description}</p>
                    <p className="text-sm font-medium text-royal-purple">ALL{product.price}{product.priceType && product.priceType !== "Total" ? product.priceType : ""}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(product.id, -1)}
                      className="w-8 h-8 p-0 bg-white hover:bg-gray-50 border-royal-purple text-royal-purple"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-12 text-center font-semibold text-lg bg-white px-2 py-1 rounded border border-royal-purple/20">
                      {selectedQuantities[product.id] || 0}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(product.id, 1)}
                      className="w-8 h-8 p-0 bg-white hover:bg-gray-50 border-royal-purple text-royal-purple"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowProductModal(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleAddToCart}
              className="bg-royal-purple hover:bg-royal-blue"
            >
              {t("addToCart")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-royal-purple">{t("checkoutInformation")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-royal-blue mb-1">{t("firstName")}</label>
                <Input
                  name="name"
                  value={checkoutInfo.name}
                  onChange={handleInfoChange}
                  className="bg-white border-royal-blue text-royal-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-royal-blue mb-1">{t("lastName")}</label>
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
              <label className="block text-sm font-medium text-royal-blue mb-1">{t("phone")}</label>
              <Input
                name="phone"
                value={checkoutInfo.phone}
                onChange={handleInfoChange}
                className="bg-white border-royal-blue text-royal-blue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-royal-blue mb-1">{t("email")}</label>
              <Input
                name="email"
                type="email"
                value={checkoutInfo.email}
                onChange={handleInfoChange}
                className="bg-white border-royal-blue text-royal-blue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-royal-blue mb-1">🚚 Data dhe Ora e Dorëzimit</label>
              <Input
                name="deliveryDateTime"
                type="datetime-local"
                value={checkoutInfo.deliveryDateTime}
                onChange={handleInfoChange}
                className="bg-white border-royal-blue text-royal-blue"
                required
                min={new Date().toISOString().slice(0, 16)}
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
              {t("cancel")}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="bg-royal-purple hover:bg-royal-blue"
            >
              {isSubmitting ? t("processing") : t("confirmOrder")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 