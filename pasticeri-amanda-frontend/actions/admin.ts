"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { put } from "@vercel/blob"

// Helper to check if user is admin
async function isAdmin() {
  const supabase = createServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return false
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  return !profileError && profile?.is_admin === true
}

export async function fetchAllOrders() {
  if (!(await isAdmin())) {
    return { orders: [], message: "Unauthorized access." }
  }

  const supabase = createServerClient()
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      products (
        name,
        image_url
      ),
      profiles (
        id,
        is_admin
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all orders:", error.message)
    return { orders: [], message: "Failed to fetch all orders." }
  }

  return { orders, message: "All orders fetched successfully." }
}

export async function updateOrderStatusAndPrice(orderId: string, status: string, finalPrice: number | null) {
  if (!(await isAdmin())) {
    return { success: false, message: "Unauthorized access." }
  }

  const supabase = createServerClient()
  const { error } = await supabase
    .from("orders")
    .update({ status, final_price: finalPrice, updated_at: new Date().toISOString() })
    .eq("id", orderId)

  if (error) {
    console.error("Error updating order status/price:", error.message)
    return { success: false, message: "Failed to update order." }
  }

  revalidatePath("/admin/orders")
  revalidatePath("/account") // Revalidate user's account page
  return { success: true, message: "Order updated successfully." }
}

export async function sendOrderConfirmationEmail(orderId: string, clientEmail: string, finalPrice: number) {
  if (!(await isAdmin())) {
    return { success: false, message: "Unauthorized access." }
  }

  // In a real application, you would integrate with an email service here (e.g., Resend, SendGrid)
  // For this example, we'll just log the email content.
  const emailSubject = `Amanda Pastry Shop: Your Order #${orderId.substring(0, 8)} - Final Price Confirmation`
  const emailBody = `
    Dear Customer,

    Thank you for placing your order with Amanda Pastry Shop. The price you saw while ordering was a base estimate. After reviewing your request and any extras or decorations, we have finalized the total price.

    Your official order total for Order #${orderId.substring(0, 8)} is: $${finalPrice.toFixed(2)}

    Please note that it may vary slightly based on your customizations. This is your official order total. Feel free to reach out if you have any questions!

    Sincerely,
    The Amanda Pastry Shop Team
    pasticeriamanda@gmail.com
    +355 69 352 0462
  `

  console.log(`--- Simulating Email Send ---`)
  console.log(`To: ${clientEmail}`)
  console.log(`Subject: ${emailSubject}`)
  console.log(`Body:\n${emailBody}`)
  console.log(`-----------------------------`)

  return { success: true, message: "Confirmation email simulated (logged to console)." }
}

export async function fetchAllProducts() {
  if (!(await isAdmin())) {
    return { products: [], message: "Unauthorized access." }
  }

  const supabase = createServerClient()
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching all products:", error.message)
    return { products: [], message: "Failed to fetch products." }
  }

  return { products, message: "Products fetched successfully." }
}

export async function addProduct(formData: FormData) {
  if (!(await isAdmin())) {
    return { success: false, message: "Unauthorized access." }
  }

  const supabase = createServerClient()
  const category = formData.get("category") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const basePrice = Number.parseFloat(formData.get("basePrice") as string)
  const pricePerPerson = Number.parseFloat(formData.get("pricePerPerson") as string)
  const imageFile = formData.get("image") as File | null

  let imageUrl: string | null = null
  if (imageFile && imageFile.size > 0) {
    try {
      const blob = await put(imageFile.name, imageFile, {
        access: "public",
      })
      imageUrl = blob.url
    } catch (blobError: any) {
      console.error("Vercel Blob upload error:", blobError.message)
      return { success: false, message: "Failed to upload image for product." }
    }
  }

  const { error } = await supabase.from("products").insert({
    category,
    name,
    description,
    image_url: imageUrl,
    base_price: basePrice,
    price_per_person: pricePerPerson,
  })

  if (error) {
    console.error("Error adding product:", error.message)
    return { success: false, message: "Failed to add product." }
  }

  revalidatePath("/admin/menu")
  revalidatePath("/menu")
  return { success: true, message: "Product added successfully!" }
}

export async function updateProduct(formData: FormData) {
  if (!(await isAdmin())) {
    return { success: false, message: "Unauthorized access." }
  }

  const supabase = createServerClient()
  const id = formData.get("id") as string
  const category = formData.get("category") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const basePrice = Number.parseFloat(formData.get("basePrice") as string)
  const pricePerPerson = Number.parseFloat(formData.get("pricePerPerson") as string)
  const imageFile = formData.get("image") as File | null
  const existingImageUrl = formData.get("existingImageUrl") as string | null

  let imageUrl: string | null = existingImageUrl

  if (imageFile && imageFile.size > 0) {
    try {
      const blob = await put(imageFile.name, imageFile, {
        access: "public",
      })
      imageUrl = blob.url
    } catch (blobError: any) {
      console.error("Vercel Blob upload error:", blobError.message)
      return { success: false, message: "Failed to upload new image for product." }
    }
  }

  const { error } = await supabase
    .from("products")
    .update({
      category,
      name,
      description,
      image_url: imageUrl,
      base_price: basePrice,
      price_per_person: pricePerPerson,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating product:", error.message)
    return { success: false, message: "Failed to update product." }
  }

  revalidatePath("/admin/menu")
  revalidatePath("/menu")
  return { success: true, message: "Product updated successfully!" }
}

export async function deleteProduct(id: string) {
  if (!(await isAdmin())) {
    return { success: false, message: "Unauthorized access." }
  }

  const supabase = createServerClient()
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("Error deleting product:", error.message)
    return { success: false, message: "Failed to delete product." }
  }

  revalidatePath("/admin/menu")
  revalidatePath("/menu")
  return { success: true, message: "Product deleted successfully!" }
}
