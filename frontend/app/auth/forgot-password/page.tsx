"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { GradientText } from "@/components/ui/gradient-text"

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setLoading(true)
    const formData = new FormData(form)
    const email = formData.get("email")

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      )

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Password reset failed")
      }

      toast({
        title: "Password Reset Email Sent!",
        description:
          "If an account with that email exists, you will receive a password reset link shortly.",
      })

      form.reset()
    } catch (error: any) {
      console.error("Forgot password error:", error)
      toast({
        title: "Password Reset Failed",
        description:
          error.message ||
          "There was an error processing your request. Please try again.",
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
            Forgot Password
          </h1>
          <CardDescription className="text-royal-blue text-center">
            Enter your email address to receive a password reset link.
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
            <Button
              type="submit"
              className="w-full bg-royal-purple text-white hover:bg-royal-blue transition-colors"
              disabled={loading}
            >
              {loading ? "Sending Link..." : "Send Reset Link"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-royal-blue">
            <Link
              href="/auth/login"
              className="underline text-royal-purple hover:text-royal-blue"
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
