"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import API_BASE from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { GradientText } from "@/components/ui/gradient-text"
import { Eye, EyeOff } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    const name = formData.get("name")
    const email = formData.get("email")
    const password = formData.get("password")

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        // Assuming /api/auth/signup endpoint for clients
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Signup failed")
      }

      toast({
        title: "Signup Successful!",
        description: "Your account has been created. Please log in.",
      })
      router.push("/auth/login")
    } catch (error: any) {
      console.error("Signup error:", error)
      toast({
        title: "Signup Failed",
        description: error.message || "There was an error creating your account. Please try again.",
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
          <h1 className="text-3xl font-bold text-center text-white" style={{
          textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
        }}>
          Sign Up
        </h1>
          <CardDescription className="text-royal-blue text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Max Robinson"
                required
                className="bg-white border-royal-blue text-royal-blue"
              />
            </div>
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
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-royal-purple text-white hover:bg-royal-blue transition-colors"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Create an account"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-royal-blue">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline text-royal-purple hover:text-royal-blue">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
