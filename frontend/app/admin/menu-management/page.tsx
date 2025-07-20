"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { GradientText } from "@/components/ui/gradient-text"
import { useEffect, useState } from "react"
import { authenticatedFetch } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Pencil, Trash2, PlusCircle } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
}

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuItem | null>(null) // For editing
  const { toast } = useToast()

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      const res = await authenticatedFetch("/api/products") // Assuming /api/products endpoint
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data: MenuItem[] = await res.json()
      setMenuItems(data)
    } catch (err) {
      console.error("Failed to fetch menu items:", err)
      setError("Failed to load menu items. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load menu items.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const handleAddEditMenuItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const itemData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      imageUrl: formData.get("imageUrl") as string,
      category: formData.get("category") as string,
    }

    try {
      let res
      if (currentMenuItem) {
        // Edit existing item
        res = await authenticatedFetch(`/api/products/${currentMenuItem.id}`, {
          method: "PUT",
          body: JSON.stringify(itemData),
        })
      } else {
        // Add new item
        res = await authenticatedFetch("/api/products", {
          method: "POST",
          body: JSON.stringify(itemData),
        })
      }

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`)
      }

      toast({
        title: currentMenuItem ? "Menu Item Updated!" : "Menu Item Added!",
        description: `"${itemData.name}" has been successfully ${currentMenuItem ? "updated" : "added"}.`,
      })
      setIsDialogOpen(false)
      setCurrentMenuItem(null)
      fetchMenuItems() // Refresh list
    } catch (error: any) {
      console.error("Failed to save menu item:", error)
      toast({
        title: "Operation Failed",
        description: error.message || "There was an error saving the menu item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return

    try {
      const res = await authenticatedFetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`)
      }

      toast({
        title: "Menu Item Deleted!",
        description: "The menu item has been successfully removed.",
      })
      fetchMenuItems() // Refresh list
    } catch (error: any) {
      console.error("Failed to delete menu item:", error)
      toast({
        title: "Deletion Failed",
        description: error.message || "There was an error deleting the menu item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (item: MenuItem) => {
    setCurrentMenuItem(item)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setCurrentMenuItem(null)
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] text-royal-blue">
        <p>Loading menu items...</p>
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
      <GradientText className="text-4xl md:text-5xl font-extrabold text-center">Menu Management</GradientText>

      <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-royal-purple">Current Menu Items</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openAddDialog}
                className="bg-royal-purple text-white hover:bg-royal-blue transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white border-gold text-royal-blue">
              <DialogHeader>
                <DialogTitle className="text-royal-purple">
                  {currentMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddEditMenuItem} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={currentMenuItem?.name || ""}
                    required
                    className="col-span-3 bg-white border-royal-blue"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={currentMenuItem?.description || ""}
                    required
                    className="col-span-3 bg-white border-royal-blue"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={currentMenuItem?.price || ""}
                    required
                    className="col-span-3 bg-white border-royal-blue"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    defaultValue={currentMenuItem?.imageUrl || "/placeholder.svg"}
                    className="col-span-3 bg-white border-royal-blue"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={currentMenuItem?.category || ""}
                    required
                    className="col-span-3 bg-white border-royal-blue"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-royal-purple text-white hover:bg-royal-blue transition-colors">
                    {currentMenuItem ? "Save Changes" : "Add Item"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {menuItems.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-royal-purple/10 text-royal-purple">
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow key={item.id} className="text-royal-blue hover:bg-gold/10">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{item.description}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(item)}
                          className="text-royal-purple hover:text-gold"
                        >
                          <Pencil className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-royal-blue text-lg py-8">No menu items found. Add some!</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
