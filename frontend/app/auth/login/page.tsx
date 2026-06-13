"use client"

import type React from "react"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import API_BASE from "@/lib/api"
import { setAuthData } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"
import { getFormData } from "@/lib/form-persistence"
import { useTranslation } from "@/contexts/TranslationContext"

export const dynamic = "force-dynamic"

const fieldClass = "luxury-input w-full"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const { t } = useTranslation()

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

      localStorage.setItem("auth_token", data.token)
      setAuthData(data.token, data.role)

      toast({
        title: t("loginSuccessful"),
        description: t("loginWelcomeBack"),
      })

      const pendingFormData = getFormData()
      const redirectTo = searchParams.get("redirect") || "/"

      if (data.role === "ADMIN" || data.role === "role_admin") {
        router.push("/admin/dashboard")
      } else if (pendingFormData) {
        router.push(redirectTo)
      } else {
        router.push(redirectTo)
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t("loginFailedMessage")
      toast({
        title: t("loginFailed"),
        description: message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-cream">
      <div className="pointer-events-none absolute inset-0 vintage-paper opacity-70" />

      <div className="container relative z-10 mx-auto flex max-w-md items-center justify-center px-4 py-12 md:px-6 md:py-16">
        <div className="w-full">
          <header className="mb-8 text-center md:mb-10">
            <p className="mb-2 font-script text-xl text-antique-gold md:text-2xl">Pastiçeri Amanda</p>
            <h1 className="font-display text-4xl font-light text-charcoal md:text-5xl">{t("login")}</h1>
            <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-antique-gold to-transparent" />
            <p className="mx-auto mt-6 max-w-sm font-serif text-base leading-relaxed text-charcoal/75">
              {t("loginSubtitle")}
            </p>
          </header>

          <div className="luxury-panel p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="luxury-label">
                  {t("email")}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className={fieldClass}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="luxury-label">
                  {t("password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className={`${fieldClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/50 transition-colors hover:text-charcoal"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="btn-luxury w-full">
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
                    {t("loggingIn")}
                  </>
                ) : (
                  t("login")
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-3 border-t border-antique-gold/20 pt-6 text-center font-serif text-sm text-charcoal/70">
              <p>
                {t("dontHaveAccount")}{" "}
                <Link href="/auth/signup" className="text-antique-gold-dark transition-colors hover:text-antique-gold">
                  {t("signUp")}
                </Link>
              </p>
              <p>
                <Link
                  href="/auth/forgot-password"
                  className="text-antique-gold-dark transition-colors hover:text-antique-gold"
                >
                  {t("forgotPassword")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-cream">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-antique-gold/30 border-t-antique-gold" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
