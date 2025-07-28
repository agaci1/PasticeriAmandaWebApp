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

  const FLAVOURS = [
    "No Preference",
    "Chocolate",
    "Vanilla",
    "Snickers",
    "Oreo",
    "Berries",
    "Strawberry",
    "Caramel",
    "Velvet",
    "Kinder Bueno",
    "Lacta",
    "Rafaelo",
    "Tiramisu",
    "Scandal",
    "Kiss",
    "Pistachio",
    "Dubai",
    "Other"
  ]

  const [flavour, setFlavour] = useState("No Preference")
  const [customFlavour, setCustomFlavour] = useState("")

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
            title: "Images Need to be Re-uploaded",
            description: "Please re-upload your images as they couldn't be preserved during login.",
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
      handleLoginRedirect()
      return
    }
    
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
    formData.set("flavour", flavour === "Other" ? customFlavour : flavour)
  
    const token = localStorage.getItem("auth_token") // ✅ Retrieve JWT from localStorage
  
    try {
      console.log("📸 Frontend: Sending request to backend")
      console.log("📸 Frontend: FormData entries:")
      for (let [key, value] of formData.entries()) {
        console.log("📸 Frontend:", key, "=", value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value)
      }
      
      const res = await fetch("http://localhost:8080/api/orders/custom", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token to backend
        },
        body: formData, // Do NOT set Content-Type, browser does it automatically
      })
  
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`)
      }
  
      toast({
        title: "Order Submitted!",
        description: "Your custom order has been sent to the admin. You will be notified with a price soon.",
      })
  
      formRef.current?.reset()
      setCustomOrderDate(undefined)
      setUploadedImages([])
      setPreviewUrls([])
      setFlavour("No Preference")
      setCustomFlavour("")
    } catch (error: any) {
      console.error("Failed to submit custom order:", error)
      toast({
        title: "Order Submission Failed",
        description: error.message || "There was an error submitting your order.",
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
      <GradientText className="text-4xl md:text-5xl font-extrabold text-center mb-12">Custom Order Request</GradientText>

      <div className="max-w-3xl mx-auto space-y-8 text-royal-blue">
        <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
          <CardHeader>
            <CardTitle className="text-royal-purple">Custom Order Request</CardTitle>
            <CardDescription className="text-royal-blue">
              Describe your dream cake or pastry, add pictures, and select a desired date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmitCustomOrder} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="customerNameCustom">Your Name</Label>
                  <Input
                    id="customerNameCustom"
                    name="customerName"
                    placeholder="John Doe"
                    required
                    className="bg-white border-royal-blue text-royal-blue"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customerEmailCustom">Your Email</Label>
                  <Input
                    id="customerEmailCustom"
                    name="customerEmail"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                    className="bg-white border-royal-blue text-royal-blue"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customerPhoneCustom">Your Phone</Label>
                  <Input
                    id="customerPhoneCustom"
                    name="customerPhone"
                    placeholder="+355 69 123 4567"
                    required
                    className="bg-white border-royal-blue text-royal-blue"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customNote">Description</Label>
                  <Textarea
                    id="customNote"
                    name="customNote"
                    placeholder="Describe your dream cake or pastry in detail..."
                    className="bg-white border-royal-blue text-royal-blue min-h-[100px]"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="flavour">Flavour Preference</Label>
                  <Select value={flavour} onValueChange={setFlavour}>
                    <SelectTrigger className="bg-white border-royal-blue text-royal-blue">
                      <SelectValue placeholder="Select a flavour" />
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
                {flavour === "Other" && (
                  <div className="grid gap-2">
                    <Label htmlFor="customFlavour">Custom Flavour</Label>
                    <Input
                      id="customFlavour"
                      value={customFlavour}
                      onChange={(e) => setCustomFlavour(e.target.value)}
                      placeholder="Enter your custom flavour"
                      className="bg-white border-royal-blue text-royal-blue"
                      required
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label>Desired Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-white border-royal-blue text-royal-blue justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customOrderDate ? format(customOrderDate, "PPP") : "Pick a date"}
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
                  <Label htmlFor="images">Upload Images (Optional)</Label>
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
                      <span className="text-royal-blue font-semibold">Click to upload images</span>
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
                            <span className="text-white opacity-0 group-hover:opacity-100 font-semibold text-sm">Click to enlarge</span>
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
                      Login to Submit Order
                    </>
                  ) : loading ? (
                    "Submitting Order..."
                  ) : (
                    "Submit Custom Order"
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
