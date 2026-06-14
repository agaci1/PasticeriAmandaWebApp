"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, UploadCloud, Lock, X } from "lucide-react"
import { format } from "date-fns"
import { useState, useRef, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { saveCustomOrderData, getFormData, clearFormData } from "@/lib/form-persistence"
import { useAuth } from "@/hooks/use-auth"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useTranslation } from "@/contexts/TranslationContext"
import API_BASE from "@/lib/api"
import {
  countPendingCustomOrders,
  orderWasSavedDespiteError,
} from "@/lib/order-submit"
import { cn } from "@/lib/utils"

const fieldClass = "luxury-input w-full"
const selectTriggerClass =
  "luxury-input flex h-11 w-full items-center justify-between [&>span]:line-clamp-1"

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
    t("other"),
  ]

  const [flavour, setFlavour] = useState(t("noPreference"))
  const [customFlavour, setCustomFlavour] = useState("")

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
      [t("other")]: "Other",
    }

    return flavourMap[albanianFlavour] || albanianFlavour
  }

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const savedData = getFormData()
      if (savedData && savedData.type === "custom_order") {
        if (formRef.current) {
          const form = formRef.current
          if (savedData.customerName) {
            ;(form.querySelector('[name="customerName"]') as HTMLInputElement).value = savedData.customerName
          }
          if (savedData.customerEmail) {
            ;(form.querySelector('[name="customerEmail"]') as HTMLInputElement).value = savedData.customerEmail
          }
          if (savedData.customerPhone) {
            ;(form.querySelector('[name="customerPhone"]') as HTMLInputElement).value = savedData.customerPhone
          }
          if (savedData.customNote) {
            ;(form.querySelector('[name="customNote"]') as HTMLTextAreaElement).value = savedData.customNote
          }
        }
        if (savedData.flavour) setFlavour(savedData.flavour)
        if (savedData.customFlavour) setCustomFlavour(savedData.customFlavour)
        if (savedData.customOrderDate) setCustomOrderDate(new Date(savedData.customOrderDate))
        if (savedData.uploadedImages && savedData.uploadedImages.length > 0) {
          toast({
            title: t("imagesNeedReupload"),
            description: t("imagesReuploadMessage"),
            variant: "destructive",
          })
        }
        clearFormData()
      }
    }
  }, [isAuthenticated, isLoading, toast, t])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedImages(files)
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)))
  }

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
    setPreviewUrls(previewUrls.filter((_, i) => i !== index))
  }

  const handleLoginRedirect = () => {
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
    router.push(`/auth/login?redirect=${encodeURIComponent("/order")}`)
  }

  const handleSubmitCustomOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isAuthenticated) {
      handleLoginRedirect()
      return
    }

    setLoading(true)

    const formData = new FormData(event.currentTarget)
    formData.set("productName", "Custom Order")
    formData.set("numberOfPersons", "1")
    formData.set("customerPhone", formData.get("customerPhone")?.toString() || "")

    if (customOrderDate) {
      formData.set("orderDate", format(customOrderDate, "yyyy-MM-dd"))
    }

    uploadedImages.forEach((file) => {
      formData.append("uploadedImages", file)
    })

    const englishFlavour = flavour === t("other") ? customFlavour : convertFlavourToEnglish(flavour)
    formData.set("flavour", englishFlavour)

    const token = localStorage.getItem("auth_token")
    if (!token) {
      handleLoginRedirect()
      return
    }

    const pendingBefore = await countPendingCustomOrders(token)

    const showOrderSuccess = () => {
      toast({
        title: "Order Submitted!",
        description:
          "Your custom order has been sent to the admin. You will be notified with a price soon.",
      })

      formRef.current?.reset()
      setCustomOrderDate(undefined)
      setUploadedImages([])
      setPreviewUrls([])
      setFlavour(t("noPreference"))
      setCustomFlavour("")
      router.push("/order-history")
    }

    try {
      const res = await fetch(`${API_BASE}/api/orders/custom`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const message =
          (errorData as { message?: string }).message || `HTTP error! status: ${res.status}`

        if (await orderWasSavedDespiteError(token, pendingBefore)) {
          showOrderSuccess()
          return
        }

        throw new Error(message)
      }

      const contentType = res.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        await res.json()
      } else {
        await res.text()
      }

      showOrderSuccess()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t("orderErrorMessage")

      if (await orderWasSavedDespiteError(token, pendingBefore)) {
        showOrderSuccess()
        return
      }

      toast({
        title: t("orderError"),
        description: message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-cream">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-antique-gold/30 border-t-antique-gold" />
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-cream">
      <div className="pointer-events-none absolute inset-0 vintage-paper opacity-70" />

      <div className="container relative z-10 mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <header className="mb-10 text-center md:mb-14">
          <p className="mb-2 font-script text-xl text-antique-gold md:text-2xl">Pastiçeri Amanda</p>
          <h1 className="font-display text-4xl font-light text-charcoal md:text-5xl">{t("orderTitle")}</h1>
          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-antique-gold to-transparent" />
          <p className="mx-auto mt-6 max-w-2xl font-serif text-base leading-relaxed text-charcoal/75 md:text-lg">
            {t("orderSubtitle")}
          </p>
        </header>

        <div className="luxury-panel p-6 md:p-10">
          <div className="mb-8 border-b border-antique-gold/20 pb-6">
            <h2 className="font-display text-2xl font-light text-charcoal md:text-3xl">{t("customOrder")}</h2>
            <p className="mt-2 font-serif text-sm text-charcoal/60 md:text-base">
              {t("orderSubtitle")}
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmitCustomOrder} className="space-y-10">
            <fieldset className="space-y-5">
              <legend className="mb-1 font-serif text-sm uppercase tracking-[0.25em] text-antique-gold-dark">
                Your Details
              </legend>

              <div className="grid gap-2">
                <Label htmlFor="customerNameCustom" className="luxury-label">
                  {t("customerName")}
                </Label>
                <Input
                  id="customerNameCustom"
                  name="customerName"
                  placeholder={t("customerName")}
                  required
                  className={fieldClass}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="customerEmailCustom" className="luxury-label">
                  {t("customerEmail")}
                </Label>
                <Input
                  id="customerEmailCustom"
                  name="customerEmail"
                  type="email"
                  placeholder={t("customerEmail")}
                  required
                  className={fieldClass}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="customerPhoneCustom" className="luxury-label">
                  {t("customerPhone")}
                </Label>
                <Input
                  id="customerPhoneCustom"
                  name="customerPhone"
                  placeholder={t("customerPhone")}
                  required
                  className={fieldClass}
                />
              </div>
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="mb-1 font-serif text-sm uppercase tracking-[0.25em] text-antique-gold-dark">
                Order Details
              </legend>

              <div className="grid gap-2">
                <Label htmlFor="customNote" className="luxury-label">
                  {t("description")}
                </Label>
                <Textarea
                  id="customNote"
                  name="customNote"
                  placeholder={t("description")}
                  className={cn(fieldClass, "min-h-[120px] resize-y")}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="flavour" className="luxury-label">
                  {t("flavour")}
                </Label>
                <Select value={flavour} onValueChange={setFlavour}>
                  <SelectTrigger id="flavour" className={selectTriggerClass}>
                    <SelectValue placeholder={t("flavour")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-antique-gold/30 font-serif">
                    {FLAVOURS.map((flavourOption) => (
                      <SelectItem key={flavourOption} value={flavourOption} className="font-serif">
                        {flavourOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {flavour === t("other") && (
                <div className="grid gap-2">
                  <Label htmlFor="customFlavour" className="luxury-label">
                    {t("customFlavour")}
                  </Label>
                  <Input
                    id="customFlavour"
                    value={customFlavour}
                    onChange={(e) => setCustomFlavour(e.target.value)}
                    placeholder={t("customFlavour")}
                    className={fieldClass}
                    required
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label className="luxury-label">{t("orderDate")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        selectTriggerClass,
                        "justify-start text-left font-normal",
                        !customOrderDate && "text-charcoal/45"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-antique-gold" />
                      {customOrderDate ? format(customOrderDate, "PPP") : t("selectDate")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto rounded-none border-antique-gold/30 p-0" align="start">
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
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="mb-1 font-serif text-sm uppercase tracking-[0.25em] text-antique-gold-dark">
                Reference Images
              </legend>

              <div className="grid gap-2">
                <Label htmlFor="images" className="luxury-label">
                  {t("uploadImages")}
                </Label>
                <div className="group cursor-pointer border border-dashed border-antique-gold/40 bg-cream-dark/20 px-6 py-10 text-center transition-colors hover:border-antique-gold/70 hover:bg-antique-gold/5">
                  <UploadCloud className="mx-auto mb-4 h-10 w-10 text-antique-gold/70 transition-colors group-hover:text-antique-gold" />
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <span className="font-serif text-sm uppercase tracking-wider text-charcoal">
                      {t("dragAndDrop")}
                    </span>
                    <p className="mt-2 font-serif text-xs text-charcoal/50">PNG, JPG, GIF up to 10MB each</p>
                  </label>
                </div>

                {previewUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                    {previewUrls.map((url, index) => (
                      <div key={url} className="group relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-32 w-full cursor-pointer border border-antique-gold/30 bg-cream object-contain transition-colors group-hover:border-antique-gold"
                          onClick={() => setEnlargedImage(url)}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center border border-antique-gold/50 bg-charcoal font-serif text-sm text-cream transition-colors hover:bg-antique-gold hover:text-charcoal"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-charcoal/0 transition-colors group-hover:bg-charcoal/15">
                          <span className="font-serif text-xs uppercase tracking-wider text-cream opacity-0 transition-opacity group-hover:opacity-100">
                            {t("clickToEnlarge")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </fieldset>

            <div className="border-t border-antique-gold/20 pt-8">
              <Button type="submit" className="btn-luxury h-auto w-full py-4 text-sm" disabled={loading}>
                {!isAuthenticated ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    {t("login")} {t("toSubmitOrder")}
                  </>
                ) : loading ? (
                  t("submittingOrder")
                ) : (
                  t("submitOrder")
                )}
              </Button>

              {!isAuthenticated && (
                <p className="mt-4 text-center font-serif text-xs text-charcoal/50">
                  Sign in to submit your bespoke order — your details will be saved.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      <Dialog open={!!enlargedImage} onOpenChange={(open) => !open && setEnlargedImage(null)}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden rounded-none border-antique-gold/30 bg-charcoal p-0">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={enlargedImage || ""}
              alt="Enlarged reference"
              className="max-h-[80vh] w-full object-contain bg-cream"
            />
            <Button
              type="button"
              onClick={() => setEnlargedImage(null)}
              className="absolute right-3 top-3 h-9 w-9 rounded-none border border-antique-gold/50 bg-charcoal/80 p-0 text-cream hover:bg-antique-gold hover:text-charcoal"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
