"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { GradientText } from "@/components/ui/gradient-text"
import { useSearchParams, useRouter } from "next/navigation"
import API_BASE from "@/lib/api"

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing password reset link. Please request a new one.")
      toast({
        title: "Invalid Link",
        description: "The password reset link is invalid or expired. Please request a new one.",
        variant: "destructive",
      })
    }
  }, [token, toast])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!token) {
      setError("Invalid reset link. Please request a new one.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Password reset failed.")
      }

      toast({
        title: "Password Reset Successful!",
        description: "You can now log in with your new password.",
      })

      router.push("/auth/login")
    } catch (err: any) {
      console.error("Password reset error:", err)
      setError(err.message || "An unexpected error occurred. Please try again.")
      toast({
        title: "Password Reset Failed",
        description: err.message || "There was an error resetting your password. Please try again.",
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
          Reset Password
        </h1>
          <CardDescription className="text-royal-blue text-center">Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          {!token ? (
            <div className="text-center text-royal-blue">
              <p>Please ensure you are using a valid password reset link.</p>
              <Link
                href="/auth/forgot-password"
                className="underline text-royal-purple hover:text-royal-blue mt-4 block"
              >
                Request a new reset link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white border-royal-blue text-royal-blue"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white border-royal-blue text-royal-blue"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-royal-purple text-white hover:bg-royal-blue transition-colors"
                disabled={loading}
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>
          )}
          <div className="mt-4 text-center text-sm text-royal-blue">
            <Link href="/auth/login" className="underline text-royal-purple hover:text-royal-blue">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
