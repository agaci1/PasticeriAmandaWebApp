"use client"
import React, { useEffect, useState } from "react"
import { authenticatedFetch, getAuthToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Pencil, Trash2, PlusCircle, Upload, X } from "lucide-react"
import Image from "next/image"
import API_BASE from "@/lib/api"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  priceType: string // '/person', '/kg', or 'ALL'
  imageUrl: string
  category: string
}

const priceTypeOptions = [
  { value: "/person", label: "/person" },
  { value: "/kg", label: "/kg" },
  { value: "Total", label: "Total" },
]

export default function AdminOtherMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuItem | null>(null)
  const [priceType, setPriceType] = useState<string>("ALL")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      const res = await authenticatedFetch("/api/products")
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data: MenuItem[] = await res.json()
      setMenuItems(data.filter(item => item.category.toLowerCase() === "other"))
    } catch (err) {
      setError("Failed to load items. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMenuItems() }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)
    
    const token = getAuthToken()
    console.log('Uploading image with token:', token ? 'Present' : 'Missing')
    
    try {
      const res = await fetch(`${API_BASE}/api/products/upload-image`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Don't set Content-Type for FormData - browser will set it automatically with boundary
        },
        body: formData,
      })
      
      console.log('Upload response status:', res.status)
      
      if (!res.ok) {
        const errorData = await res.json()
        console.error('Upload error response:', errorData)
        throw new Error(errorData.error || `Failed to upload image: ${res.status}`)
      }
      
      const data = await res.json()
      console.log('Upload success:', data)
      return data.imageUrl
    } catch (error) {
      console.error('Image upload error:', error)
      throw error
    }
  }

  const handleAddEditMenuItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null) // Clear previous errors
    
    try {
      const formData = new FormData(event.currentTarget)
      let imageUrl = currentMenuItem?.imageUrl || ""
      
      // Upload new image if selected
      if (selectedImage) {
        setUploadingImage(true)
        try {
          imageUrl = await uploadImage(selectedImage)
        } catch (uploadError: any) {
          setError(`Failed to upload image: ${uploadError.message}`)
          setUploadingImage(false)
          setIsSubmitting(false)
          return
        }
        setUploadingImage(false)
      }
      
      const itemData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: Number.parseFloat(formData.get("price") as string),
        priceType: formData.get("priceType") as string,
        imageUrl: imageUrl,
        category: "other",
      }
      
      let res
      if (currentMenuItem) {
        res = await authenticatedFetch(`/api/products/${currentMenuItem.id}`, {
          method: "PUT",
          body: JSON.stringify(itemData),
        })
      } else {
        res = await authenticatedFetch("/api/products", {
          method: "POST",
          body: JSON.stringify(itemData),
        })
      }
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
      }
      
      setIsDialogOpen(false)
      setCurrentMenuItem(null)
      setPriceType("ALL")
      setSelectedImage(null)
      setImagePreview(null)
      fetchMenuItems()
    } catch (error: any) {
      console.error('Error saving item:', error)
      setError(error.message || "There was an error saving the item. Please try again.")
    } finally {
      setIsSubmitting(false)
      setUploadingImage(false)
    }
  }

  const handleDeleteMenuItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return
    try {
      const res = await authenticatedFetch(`/api/products/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      fetchMenuItems()
    } catch (error) {
      setError("There was an error deleting the item. Please try again.")
    }
  }

  const openEditDialog = (item: MenuItem) => {
    setCurrentMenuItem(item)
    setPriceType(item.priceType || "ALL")
    setSelectedImage(null)
    setImagePreview(item.imageUrl || null)
    setIsDialogOpen(true)
  }
  
  const openAddDialog = () => {
    setCurrentMenuItem(null)
    setPriceType("ALL")
    setSelectedImage(null)
    setImagePreview(null)
    setIsDialogOpen(true)
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-royal-purple text-white hover:bg-royal-blue transition-colors">
              <PlusCircle className="w-4 h-4 mr-2" /> Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white border-gold text-royal-blue">
            <DialogHeader>
              <DialogTitle className="text-royal-purple">
                {currentMenuItem ? "Edit Item" : "Add New Item"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEditMenuItem} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" defaultValue={currentMenuItem?.name || ""} required className="col-span-3 bg-white border-royal-blue" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" name="description" defaultValue={currentMenuItem?.description || ""} required className="col-span-3 bg-white border-royal-blue" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price (ALL)</Label>
                <Input id="price" name="price" type="number" step="0.01" defaultValue={currentMenuItem?.price || ""} required className="col-span-2 bg-white border-royal-blue" />
                <select
                  id="priceType"
                  name="priceType"
                  value={priceType}
                  onChange={e => setPriceType(e.target.value)}
                  className="col-span-1 bg-white border-royal-blue rounded px-2 py-1"
                  required
                >
                  {priceTypeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Image Upload Section */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Image</Label>
                <div className="col-span-3 space-y-2">
                                     {/* Image Preview */}
                   {imagePreview && (
                    <div className="relative inline-block">
                      <Image
                        src={imagePreview.startsWith('blob:') ? imagePreview : `${API_BASE}${imagePreview}`}
                        alt="Preview"
                        width={120}
                        height={120}
                        className="rounded-lg object-contain border border-gray-300 bg-white"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {/* File Input */}
                  <div className="flex items-center gap-2">
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="col-span-3 bg-white border-royal-blue"
                    />
                    <Upload className="h-4 w-4 text-gray-500" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload a photo from your phone or device
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="bg-royal-purple text-white hover:bg-royal-blue transition-colors"
                  disabled={isSubmitting || uploadingImage}
                >
                  {isSubmitting || uploadingImage ? "Saving..." : (currentMenuItem ? "Save Changes" : "Add Item")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-royal-purple"></div>
        </div>
      ) : (
                <div className="grid gap-4">
          {menuItems.map((item) => (
            <Card key={item.id} className="bg-white border-gold">
              <div className="flex items-start gap-4 p-4">
                {/* Image Section */}
                {item.imageUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={`${API_BASE}${item.imageUrl}`}
                      alt={item.name}
                      width={120}
                      height={90}
                      className="rounded-lg object-contain border border-gray-200 bg-white cursor-pointer"
                      onClick={() => setEnlargedImage(`${API_BASE}${item.imageUrl}`)}
                    />
                  </div>
                )}
                
                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-royal-purple text-lg">{item.name}</CardTitle>
                      <p className="text-royal-blue mt-1 text-sm">{item.description}</p>
                      <p className="text-lg font-semibold text-royal-blue mt-2">
                        {item.price} ALL {item.priceType}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                        className="border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Image Modal */}
      <Dialog open={!!enlargedImage} onOpenChange={open => !open && setEnlargedImage(null)}>
        <DialogContent className="max-w-2xl bg-white flex flex-col items-center justify-center">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {enlargedImage && (
            <img
              src={enlargedImage}
              alt="Full Size"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg border"
              style={{ background: 'white' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 