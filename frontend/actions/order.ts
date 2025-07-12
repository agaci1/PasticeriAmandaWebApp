"use server"

import { createServerClient } from "@/lib/supabase/server"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export async function submitOrder(formData: FormData) {
  const supabase = createServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, message: "You must be logged in to place an order." }
  }

  const fullName = formData.get("fullName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const productId = formData.get("productId") as string
  const numberOfPersons = Number.parseInt(formData.get("numberOfPersons") as string)
  const customNote = formData.get("customNote") as string
  const imageFile = formData.get("uploadedImage") as File | null

  let uploadedImageUrl: string | null = null
  if (imageFile && imageFile.size > 0) {
    try {
      const blob = await put(imageFile.name, imageFile, {
        access: "public",
      })
      uploadedImageUrl = blob.url
    } catch (blobError: any) {
      console.error("Vercel Blob upload error:", blobError.message)
      return { success: false, message: "Failed to upload image. Please try again." }
    }
  }

  // Fetch product details to calculate provisional price
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("base_price, price_per_person")
    .eq("id", productId)
    .single()

  if (productError || !product) {
    console.error("Product not found:", productError?.message)
    return { success: false, message: "Selected product not found." }
  }

  const provisionalPrice = product.base_price + product.price_per_person * numberOfPersons

  const { error } = await supabase.from("orders").insert({
    user_id: user.id,
    product_id: productId,
    full_name: fullName,
    email: email,
    phone: phone,
    number_of_persons: numberOfPersons,
    custom_note: customNote,
    uploaded_image_url: uploadedImageUrl,
    provisional_price: provisionalPrice,
    status: "pending",
  })

  if (error) {
    console.error("Order submission error:", error.message)
    return { success: false, message: "Failed to submit order. Please try again." }
  }

  revalidatePath("/account") // Revalidate user's account page to show new order
  return { success: true, message: "Your order request has been submitted! We will contact you shortly." }
}

export async function updateOrder(formData: FormData) {
  const supabase = createServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, message: "You must be logged in to update an order." }
  }

  const orderId = formData.get("orderId") as string
  const numberOfPersons = Number.parseInt(formData.get("numberOfPersons") as string)
  const customNote = formData.get("customNote") as string
  const imageFile = formData.get("uploadedImage") as File | null

  // Fetch existing order to get product_id and current status
  const { data: existingOrder, error: existingOrderError } = await supabase
    .from("orders")
    .select("product_id, status, uploaded_image_url")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single()

  if (existingOrderError || !existingOrder) {
    console.error("Existing order not found or unauthorized:", existingOrderError?.message)
    return { success: false, message: "Order not found or you do not have permission to update it." }
  }

  if (existingOrder.status !== "pending") {
    return { success: false, message: "Only pending orders can be updated." }
  }

  let uploadedImageUrl: string | null = existingOrder.uploaded_image_url
  if (imageFile && imageFile.size > 0) {
    try {
      const blob = await put(imageFile.name, imageFile, {
        access: "public",
      })
      uploadedImageUrl = blob.url
    } catch (blobError: any) {
      console.error("Vercel Blob upload error:", blobError.message)
      return { success: false, message: "Failed to upload new image. Please try again." }
    }
  }

  // Fetch product details to recalculate provisional price
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("base_price, price_per_person")
    .eq("id", existingOrder.product_id)
    .single()

  if (productError || !product) {
    console.error("Product not found for existing order:", productError?.message)
    return { success: false, message: "Associated product not found." }
  }

  const provisionalPrice = product.base_price + product.price_per_person * numberOfPersons

  const { error } = await supabase
    .from("orders")
    .update({
      number_of_persons: numberOfPersons,
      custom_note: customNote,
      uploaded_image_url: uploadedImageUrl,
      provisional_price: provisionalPrice,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Order update error:", error.message)
    return { success: false, message: "Failed to update order. Please try again." }
  }

  revalidatePath("/account")
  return { success: true, message: "Order updated successfully!" }
}

export async function fetchUserOrders() {
  const supabase = createServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { orders: [], message: "Not authenticated." }
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      products (
        name,
        image_url
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user orders:", error.message)
    return { orders: [], message: "Failed to fetch orders." }
  }

  return { orders, message: "Orders fetched successfully." }
}

export async function fetchOrderById(orderId: string) {
  const supabase = createServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { order: null, message: "Not authenticated." }
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      products (
        name,
        description,
        image_url,
        base_price,
        price_per_person
      )
    `)
    .eq("id", orderId)
    .eq("user_id", user.id) // Ensure user can only fetch their own order
    .single()

  if (error) {
    console.error("Error fetching order by ID:", error.message)
    return { order: null, message: "Failed to fetch order." }
  }

  return { order, message: "Order fetched successfully." }
}
