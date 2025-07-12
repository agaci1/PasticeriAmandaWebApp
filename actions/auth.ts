"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Sign in error:", error.message)
    return { success: false, message: error.message }
  }

  return redirect("/account")
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createServerClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`, // Ensure this URL is configured in Supabase Auth settings
    },
  })

  if (error) {
    console.error("Sign up error:", error.message)
    return { success: false, message: error.message }
  }

  // Insert into profiles table to set is_admin to false by default
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert({ id: data.user.id, is_admin: false })

    if (profileError) {
      console.error("Profile creation error:", profileError.message)
      // Consider rolling back user creation or handling this more robustly
      return { success: false, message: "Failed to create user profile." }
    }
  }

  return { success: true, message: "Sign up successful! Please check your email for a confirmation link." }
}

export async function signOut() {
  const supabase = createServerClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Sign out error:", error.message)
  }

  return redirect("/login")
}

export async function adminSignIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Admin sign in error:", error.message)
    return { success: false, message: error.message }
  }

  // Check if the user is an admin
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", data.user?.id)
    .single()

  if (profileError || !profileData?.is_admin) {
    // If not admin, sign them out immediately
    await supabase.auth.signOut()
    console.error("Unauthorized admin access attempt for user:", email)
    return { success: false, message: "Unauthorized access. Not an administrator." }
  }

  return redirect("/admin/dashboard")
}
