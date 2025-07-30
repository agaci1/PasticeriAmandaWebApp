"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, UploadCloud, Lock } from "lucide-react"
import { format } from "date-fns"
import { useState, useRef, useEffect } from "react"
import { authenticatedFetch } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { GradientText } from "@/components/ui/gradient-text"
import { saveCustomOrderData, getFormData, clearFormData } from "@/lib/form-persistence"
import { useAuth } from "@/hooks/use-auth"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useTranslation } from "@/contexts/TranslationContext"
import API_BASE from "@/lib/api"

export default function OrderPage() {
  const [customOrderDate, setCustomOrderDate] = useState<Date | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const { t } = useTranslation()

  const FLAVOURS = [
    t("noPreference"),
    t("chocolate"),
    t("vanilla"),
    t("snickers"),
    t("oreo"),
    t("berries"),
    t("strawberry"),
    t("caramel"),
    t("velvet"),
    t("kinderBueno"),
    t("lacta"),
    t("rafaelo"),
    t("tiramisu"),
    t("scandal"),
    t("kiss"),
    t("pistachio"),
    t("dubai"),
    t("other")
  ]

  const [flavour, setFlavour] = useState(t("noPreference"))
  const [customFlavour, setCustomFlavour] = useState("")

  // Function to convert Albanian flavor names to English for backend
  const convertFlavourToEnglish = (albanianFlavour: string): string => {
    const flavourMap: { [key: string]: string } = {
      [t("noPreference")]: "No Preference",
      [t("chocolate")]: "Chocolate",
      [t("vanilla")]: "Vanilla",
      [t("snickers")]: "Snickers",
      [t("oreo")]: "Oreo",
      [t("berries")]: "Berries",
      [t("strawberry")]: "Strawberry",
      [t("caramel")]: "Caramel",
      [t("velvet")]: "Velvet",
      [t("kinderBueno")]: "Kinder Bueno",
      [t("lacta")]: "Lacta",
      [t("rafaelo")]: "Rafaelo",
      [t("tiramisu")]: "Tiramisu",
      [t("scandal")]: "Scandal",
      [t("kiss")]: "Kiss",
      [t("pistachio")]: "Pistachio",
      [t("dubai")]: "Dubai",
      [t("other")]: "Other"
    }
    
    return flavourMap[albanianFlavour] || albanianFlavour
  }

  // Restore form data after login
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const savedData = getFormData()
      if (savedData && savedData.type === 'custom_order') {
        // Restore form data
        if (formRef.current) {
          const form = formRef.current
          if (savedData.customerName) {
            (form.querySelector('[name="customerName"]') as HTMLInputElement).value = savedData.customerName
          }
          if (savedData.customerEmail) {
            (form.querySelector('[name="customerEmail"]') as HTMLInputElement).value = savedData.customerEmail
          }
          if (savedData.customerPhone) {
            (form.querySelector('[name="customerPhone"]') as HTMLInputElement).value = savedData.customerPhone
          }
          if (savedData.customNote) {
            (form.querySelector('[name="customNote"]') as HTMLTextAreaElement).value = savedData.customNote
          }
        }
        if (savedData.flavour) {
          setFlavour(savedData.flavour)
        }
        if (savedData.customFlavour) {
          setCustomFlavour(savedData.customFlavour)
        }
        if (savedData.customOrderDate) {
          setCustomOrderDate(new Date(savedData.customOrderDate))
        }
        // Note: File objects can't be serialized, so we can't restore uploaded images
        // But we can show a message to the user
        if (savedData.uploadedImages && savedData.uploadedImages.length > 0) {
          toast({
            title: t("imagesNeedReupload"),
            description: t("imagesReuploadMessage"),
            variant: "destructive",
          })
        }
        // Clear the saved data
        clearFormData()
      }
    }
  }, [isAuthenticated, isLoading, toast])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedImages(files)
    setPreviewUrls(files.map(file => URL.createObjectURL(file)))
  }

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index)
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index)
    setUploadedImages(newImages)
    setPreviewUrls(newPreviewUrls)
  }

  const handleLoginRedirect = () => {
    // Save current form data before redirecting
    if (formRef.current) {
      const formData = new FormData(formRef.current)
      saveCustomOrderData({
        customerName: formData.get("customerName")?.toString(),
        customerEmail: formData.get("customerEmail")?.toString(),
        customerPhone: formData.get("customerPhone")?.toString(),
        customNote: formData.get("customNote")?.toString(),
        flavour,
        customFlavour,
        customOrderDate: customOrderDate ? format(customOrderDate, "yyyy-MM-dd") : undefined,
        uploadedImages: uploadedImages.length > 0 ? uploadedImages : undefined,
        previewUrls: previewUrls.length > 0 ? previewUrls : undefined,
      })
    }
    
    // Redirect to login with return URL
    router.push(`/auth/login?redirect=${encodeURIComponent('/order')}`)
  }

  const handleSubmitCustomOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      handleLoginRedirect()
      return
    }
    
    console.log("Starting custom order submission...");
    setLoading(true)
  
    const formData = new FormData(event.currentTarget)
    // Override some values
    formData.set("productName", "Custom Order")
    formData.set("numberOfPersons", "1")
    formData.set("customerPhone", formData.get("customerPhone")?.toString() || "")

    
    if (customOrderDate) {
      formData.set("orderDate", format(customOrderDate, "yyyy-MM-dd"))
    }
    // Add all images
    console.log("📸 Frontend: Adding", uploadedImages.length, "images to form data")
    uploadedImages.forEach((file, idx) => {
      console.log("📸 Frontend: Adding file", idx + 1, ":", file.name, "(", file.size, "bytes)")
      formData.append("uploadedImages", file)
    })
    
    // Convert Albanian flavor to English for backend
    const englishFlavour = flavour === t("other") ? customFlavour : convertFlavourToEnglish(flavour)
    formData.set("flavour", englishFlavour)
  
    const token = localStorage.getItem("auth_token") // ✅ Retrieve JWT from localStorage
    console.log("Auth token present:", !!token);

    try {
      console.log("📸 Frontend: Sending request to backend")
      console.log("📸 Frontend: FormData entries:")
      for (let [key, value] of formData.entries()) {
        console.log("📸 Frontend:", key, "=", value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value)
      }
      
      const res = await fetch(`${API_BASE}/api/orders/custom`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token to backend
        },
        body: formData, // Do NOT set Content-Type, browser does it automatically
      })
  
      console.log("Response status:", res.status);
      console.log("Response headers:", Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        const errorData = await res.json()
        console.error("Backend error response:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`)
      }

      // Check if response has content before trying to parse as JSON
      const contentType = res.headers.get("content-type");
      let responseData;
      if (contentType && contentType.includes("application/json")) {
        responseData = await res.json();
        console.log("Order submitted successfully:", responseData);
      } else {
        const textResponse = await res.text();
        console.log("Order submitted successfully:", textResponse);
      }
      
      toast({
        title: "Order Submitted!",
        description: "Your custom order has been sent to the admin. You will be notified with a price soon.",
      })
  
      // Reset form and state
      formRef.current?.reset()
      setCustomOrderDate(undefined)
      setUploadedImages([])
      setPreviewUrls([])
      setFlavour(t("noPreference"))
      setCustomFlavour("")
      
      // Navigate to order history or home page
      router.push("/order-history")
      
    } catch (error: any) {
      console.error("Failed to submit custom order:", error)
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      toast({
        title: t("orderError"),
        description: error.message || t("orderErrorMessage"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }  

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
              <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-white" style={{
          textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
        }}>
          {t("orderTitle")}
        </h1>

      <div className="max-w-3xl mx-auto space-y-8 text-royal-blue">
        <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
          <CardHeader>
            <CardTitle className="text-royal-purple">{t("customOrder")}</CardTitle>
            <CardDescription className="text-royal-blue">
              {t("orderSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmitCustomOrder} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="customerNameCustom">{t("customerName")}</Label>
                  <Input
                    id="customerNameCustom"
                    name="customerName"
                    placeholder={t("customerName")}
                    required
                    className="bg-white border-royal-blue text-royal-blue"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customerEmailCustom">{t("customerEmail")}</Label>
                  <Input
                    id="customerEmailCustom"
                    name="customerEmail"
                    type="email"
                    placeholder={t("customerEmail")}
                    required
                    className="bg-white border-royal-blue text-royal-blue"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customerPhoneCustom">{t("customerPhone")}</Label>
                  <Input
                    id="customerPhoneCustom"
                    name="customerPhone"
                    placeholder={t("customerPhone")}
                    required
                    className="bg-white border-royal-blue text-royal-blue"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customNote">{t("description")}</Label>
                  <Textarea
                    id="customNote"
                    name="customNote"
                    placeholder={t("description")}
                    className="bg-white border-royal-blue text-royal-blue min-h-[100px]"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="flavour">{t("flavour")}</Label>
                  <Select value={flavour} onValueChange={setFlavour}>
                    <SelectTrigger className="bg-white border-royal-blue text-royal-blue">
                      <SelectValue placeholder={t("flavour")} />
                    </SelectTrigger>
                    <SelectContent>
                      {FLAVOURS.map((flavourOption) => (
                        <SelectItem key={flavourOption} value={flavourOption}>
                          {flavourOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {flavour === t("other") && (
                  <div className="grid gap-2">
                                      <Label htmlFor="customFlavour">{t("customFlavour")}</Label>
                  <Input
                    id="customFlavour"
                    value={customFlavour}
                    onChange={(e) => setCustomFlavour(e.target.value)}
                    placeholder={t("customFlavour")}
                      className="bg-white border-royal-blue text-royal-blue"
                      required
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label>{t("orderDate")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-white border-royal-blue text-royal-blue justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customOrderDate ? format(customOrderDate, "PPP") : t("selectDate")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={customOrderDate}
                        onSelect={setCustomOrderDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="images">{t("uploadImages")}</Label>
                  <div className="border-2 border-dashed border-royal-blue rounded-lg p-6 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-royal-blue mb-4" />
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label htmlFor="images" className="cursor-pointer">
                      <span className="text-royal-blue font-semibold">{t("dragAndDrop")}</span>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                    </label>
                  </div>
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-contain rounded-lg border border-royal-blue bg-white cursor-pointer"
                            onClick={() => setEnlargedImage(url)}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 font-semibold text-sm">{t("clickToEnlarge")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-royal-purple text-white hover:bg-royal-blue transition-colors py-3 text-lg font-semibold"
                  disabled={loading}
                >
                  {!isAuthenticated ? (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      {t("login")} {t("toSubmitOrder")}
                    </>
                  ) : loading ? (
                    t("submittingOrder")
                  ) : (
                    t("submitOrder")
                  )}
                </Button>
            </form>
          </CardContent>
        </Card>
      </div>

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
