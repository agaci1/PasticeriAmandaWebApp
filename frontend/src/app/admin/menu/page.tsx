"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { fetchAllProducts, addProduct, updateProduct, deleteProduct } from "@/actions/admin"
import { useActionState } from "react-dom"

interface Product {
  id: string
  category: string
  name: string
  description: string | null
  image_url: string | null
  base_price: number
  price_per_person: number
}

export default function AdminMenuPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const [addState, addAction, isAddPending] = useActionState(addProduct, null)
  const [updateState, updateAction, isUpdatePending] = useActionState(updateProduct, null)

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      const { products: fetchedProducts, message } = await fetchAllProducts()
      if (fetchedProducts) {
        setProducts(fetchedProducts as Product[])
      } else {
        console.error(message)
      }
      setLoading(false)
    }
    loadProducts()
  }, [addState, updateState]) // Re-fetch products after add or update

  useEffect(() => {
    if (addState?.success === false) {
      alert(addState.message)
    } else if (addState?.success === true) {
      alert(addState.message)
      setIsAddDialogOpen(false)
      setFile(null)
    }
  }, [addState])

  useEffect(() => {
    if (updateState?.success === false) {
      alert(updateState.message)
    } else if (updateState?.success === true) {
      alert(updateState.message)
      setIsEditDialogOpen(false)
      setFile(null)
    }
  }, [updateState])

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product)
    setIsEditDialogOpen(true)
    setFile(null)
  }

  const handleDeleteClick = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const { success, message } = await deleteProduct(id)
      if (success) {
        alert(message)
        setProducts(products.filter((p) => p.id !== id)) // Optimistic update
      } else {
        alert(message)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null)
  }

  if (loading) {
    return <div className="text-center font-body text-royalPurple">Loading menu...</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="font-title text-4xl font-bold text-royalPurple text-outline-royal-purple">Manage Menu Items</h1>

      <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gold text-white hover:bg-royalPurple">
        Add New Product
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-title text-2xl text-royalBlue">Current Menu</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="font-body text-center text-gray-600">No products found. Add some!</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-babyPink text-royalPurple">
                    <TableHead className="font-semibold">Image</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Base Price</TableHead>
                    <TableHead className="font-semibold">Per Person</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-lightAccent">
                      <TableCell>
                        {product.image_url && (
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-body text-sm">{product.name}</TableCell>
                      <TableCell className="font-body text-sm">{product.category}</TableCell>
                      <TableCell className="font-body text-sm">${product.base_price.toFixed(2)}</TableCell>
                      <TableCell className="font-body text-sm">${product.price_per_person.toFixed(2)}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(product)}
                          className="border-royalBlue text-royalBlue hover:bg-royalBlue hover:text-white"
                        >
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(product.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white p-6 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="font-title text-2xl text-royalPurple">Add New Product</DialogTitle>
            <DialogDescription className="font-body text-gray-700">
              Fill in the details for the new menu item.
            </DialogDescription>
          </DialogHeader>
          <form action={addAction} className="space-y-4">
            <div>
              <Label htmlFor="add-category" className="font-semibold text-royalBlue mb-1 block">
                Category
              </Label>
              <Select name="category" required>
                <SelectTrigger
                  id="add-category"
                  className="w-full font-body h-10 border-lightAccent focus:border-babyPink"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal-cakes">Normal Cakes</SelectItem>
                  <SelectItem value="wedding-cakes">Wedding Cakes</SelectItem>
                  <SelectItem value="sweets">Sweets</SelectItem>
                  <SelectItem value="special-orders">Special Orders</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="add-name" className="font-semibold text-royalBlue mb-1 block">
                Name
              </Label>
              <Input
                id="add-name"
                name="name"
                type="text"
                required
                className="font-body h-10 border-lightAccent focus:border-babyPink"
              />
            </div>
            <div>
              <Label htmlFor="add-description" className="font-semibold text-royalBlue mb-1 block">
                Description
              </Label>
              <Textarea
                id="add-description"
                name="description"
                rows={3}
                className="font-body border-lightAccent focus:border-babyPink"
              />
            </div>
            <div>
              <Label htmlFor="add-base-price" className="font-semibold text-royalBlue mb-1 block">
                Base Price
              </Label>
              <Input
                id="add-base-price"
                name="basePrice"
                type="number"
                step="0.01"
                required
                className="font-body h-10 border-lightAccent focus:border-babyPink"
              />
            </div>
            <div>
              <Label htmlFor="add-price-per-person" className="font-semibold text-royalBlue mb-1 block">
                Price Per Person
              </Label>
              <Input
                id="add-price-per-person"
                name="pricePerPerson"
                type="number"
                step="0.01"
                required
                className="font-body h-10 border-lightAccent focus:border-babyPink"
              />
            </div>
            <div>
              <Label htmlFor="add-image" className="font-semibold text-royalBlue mb-1 block">
                Product Image
              </Label>
              <Input
                id="add-image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="font-body h-10 border-lightAccent focus:border-babyPink"
              />
            </div>
            <Button type="submit" className="w-full bg-gold text-white hover:bg-royalPurple" disabled={isAddPending}>
              {isAddPending ? "Adding Product..." : "Add Product"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      {selectedProduct && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white p-6 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="font-title text-2xl text-royalPurple">
                Edit Product: {selectedProduct.name}
              </DialogTitle>
              <DialogDescription className="font-body text-gray-700">
                Update the details for this menu item.
              </DialogDescription>
            </DialogHeader>
            <form action={updateAction} className="space-y-4">
              <input type="hidden" name="id" value={selectedProduct.id} />
              <div>
                <Label htmlFor="edit-category" className="font-semibold text-royalBlue mb-1 block">
                  Category
                </Label>
                <Select name="category" defaultValue={selectedProduct.category} required>
                  <SelectTrigger
                    id="edit-category"
                    className="w-full font-body h-10 border-lightAccent focus:border-babyPink"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal-cakes">Normal Cakes</SelectItem>
                    <SelectItem value="wedding-cakes">Wedding Cakes</SelectItem>
                    <SelectItem value="sweets">Sweets</SelectItem>
                    <SelectItem value="special-orders">Special Orders</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-name" className="font-semibold text-royalBlue mb-1 block">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  type="text"
                  defaultValue={selectedProduct.name}
                  required
                  className="font-body h-10 border-lightAccent focus:border-babyPink"
                />
              </div>
              <div>
                <Label htmlFor="edit-description" className="font-semibold text-royalBlue mb-1 block">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={selectedProduct.description || ""}
                  rows={3}
                  className="font-body border-lightAccent focus:border-babyPink"
                />
              </div>
              <div>
                <Label htmlFor="edit-base-price" className="font-semibold text-royalBlue mb-1 block">
                  Base Price
                </Label>
                <Input
                  id="edit-base-price"
                  name="basePrice"
                  type="number"
                  step="0.01"
                  defaultValue={selectedProduct.base_price}
                  required
                  className="font-body h-10 border-lightAccent focus:border-babyPink"
                />
              </div>
              <div>
                <Label htmlFor="edit-price-per-person" className="font-semibold text-royalBlue mb-1 block">
                  Price Per Person
                </Label>
                <Input
                  id="edit-price-per-person"
                  name="pricePerPerson"
                  type="number"
                  step="0.01"
                  defaultValue={selectedProduct.price_per_person}
                  required
                  className="font-body h-10 border-lightAccent focus:border-babyPink"
                />
              </div>
              <div>
                <Label htmlFor="edit-image" className="font-semibold text-royalBlue mb-1 block">
                  Product Image
                </Label>
                {selectedProduct.image_url && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600">Current Image:</p>
                    <Image
                      src={selectedProduct.image_url || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      width={100}
                      height={100}
                      className="rounded-md object-cover mt-1 border border-lightAccent"
                    />
                    <input type="hidden" name="existingImageUrl" value={selectedProduct.image_url} />
                  </div>
                )}
                <Input
                  id="edit-image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="font-body h-10 border-lightAccent focus:border-babyPink"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gold text-white hover:bg-royalPurple"
                disabled={isUpdatePending}
              >
                {isUpdatePending ? "Updating Product..." : "Update Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
