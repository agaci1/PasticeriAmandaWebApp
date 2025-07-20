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
import { setAuthData } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { GradientText } from "@/components/ui/gradient-text"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isAdminLoginAttempt, setIsAdminLoginAttempt] = useState(false)
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
      setAuthData(data.token, data.role)

      toast({
        title: "Login Successful!",
        description: `Welcome back, ${data.role.toLowerCase()}!`,
      })

      router.push("/")
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
            {isAdminLoginAttempt ? "Admin Login" : "User Login"}
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
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* Conditionally render Forgot Password link */}
                {!isAdminLoginAttempt && (
                  <Link
                    href="/auth/forgot-password" // Updated href to a new page
                    className="ml-auto inline-block text-sm underline text-royal-purple hover:text-royal-blue"
                  >
                    Forgot your password?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-white border-royal-blue text-royal-blue"
              />
            </div>
            <div className="flex items-center justify-center space-x-4 mt-2">
              {isAdminLoginAttempt ? (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsAdminLoginAttempt(false)}
                  className="text-royal-purple hover:text-royal-blue"
                >
                  Login as Client
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsAdminLoginAttempt(true)}
                  className="text-royal-purple hover:text-royal-blue"
                >
                  Login as Admin
                </Button>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-royal-purple text-white hover:bg-royal-blue transition-colors"
              disabled={loading}
            >
              {loading
                ? isAdminLoginAttempt
                  ? "Logging In as Admin..."
                  : "Logging In..."
                : isAdminLoginAttempt
                  ? "Login as Admin"
                  : "Login"}
            </Button>
          </form>
          {/* Conditionally render signup link */}
          {!isAdminLoginAttempt && (
            <div className="mt-4 text-center text-sm text-royal-blue">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="underline text-royal-purple hover:text-royal-blue">
                Sign up
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
