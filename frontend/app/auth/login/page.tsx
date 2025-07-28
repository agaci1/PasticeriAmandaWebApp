"use client"

import type React from "react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import API_BASE from "@/lib/api"
import { setAuthData } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { GradientText } from "@/components/ui/gradient-text"
import { Eye, EyeOff } from "lucide-react"
import { getFormData, clearFormData } from "@/lib/form-persistence"

// Force dynamic rendering to avoid useSearchParams issues during build
export const dynamic = 'force-dynamic'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Login failed")
      }

      const data = await res.json()

      // ✅ SAVE TOKEN TO LOCAL STORAGE
      localStorage.setItem("auth_token", data.token)
      setAuthData(data.token, data.role)

      toast({
        title: "Login Successful!",
        description: `Welcome back, ${data.role.toLowerCase()}!`,
      })
      
      // Check if there's pending form data to restore
      const pendingFormData = getFormData()
      const redirectTo = searchParams.get('redirect') || '/'
      
      if (data.role === "ADMIN" || data.role === "role_admin") {
        router.push("/admin/dashboard")
      } else if (pendingFormData) {
        // Redirect to the original page with form data preserved
        router.push(redirectTo)
      } else {
        router.push(redirectTo)
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
      <Card className="mx-auto max-w-sm bg-white/80 backdrop-blur-sm border-gold shadow-lg">
        <CardHeader>
          <GradientText className="text-3xl font-bold text-center">
            Login
          </GradientText>
          <CardDescription className="text-royal-blue text-center">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-white border-royal-blue text-royal-blue"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="bg-white border-royal-blue text-royal-blue pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-royal-purple text-white hover:bg-royal-blue transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-royal-blue">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-royal-purple hover:underline">
                Sign up
              </Link>
            </p>
            <p className="text-sm text-royal-blue mt-2">
              <Link href="/auth/forgot-password" className="text-royal-purple hover:underline">
                Forgot your password?
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-royal-purple"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
