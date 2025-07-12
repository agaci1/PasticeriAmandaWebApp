"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn, signUp, adminSignIn } from "@/actions/auth"
import { useFormState, useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@/lib/supabase/client"

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full bg-gold text-white hover:bg-royalPurple" disabled={pending}>
      {pending ? "Loading..." : text}
    </Button>
  )
}

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isAdminLogin, setIsAdminLogin] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Use separate form states for sign-in and sign-up
  const [signInState, signInAction] = useFormState(signIn, null)
  const [signUpState, signUpAction] = useFormState(signUp, null)
  const [adminSignInState, adminSignInAction] = useFormState(adminSignIn, null)

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        // Check if admin
        const { data: profile, error } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
        if (!error && profile?.is_admin) {
          router.push("/admin/dashboard")
        } else {
          router.push("/account")
        }
      }
    }
    checkUser()
  }, [router, supabase])

  useEffect(() => {
    if (signInState?.success === false) {
      alert(signInState.message)
    }
  }, [signInState])

  useEffect(() => {
    if (signUpState?.success === true) {
      alert(signUpState.message)
      setIsSignUp(false) // Switch back to login after successful sign-up
    } else if (signUpState?.success === false) {
      alert(signUpState.message)
    }
  }, [signUpState])

  useEffect(() => {
    if (adminSignInState?.success === false) {
      alert(adminSignInState.message)
    }
  }, [adminSignInState])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-babyPink p-4">
      <Card className="w-full max-w-md shadow-xl animate-fade-in-up">
        <CardHeader className="text-center">
          <CardTitle className="font-title text-3xl text-royalPurple">
            {isAdminLogin ? "Admin Login" : isSignUp ? "Create Account" : "Client Login"}
          </CardTitle>
          <CardDescription className="font-body text-gray-700">
            {isAdminLogin
              ? "Access the administrative panel."
              : isSignUp
                ? "Join Amanda Pastry Shop to manage your orders."
                : "Already placed an order? Log in to view or update your previous orders."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAdminLogin ? (
            <form action={adminSignInAction} className="space-y-4">
              <div>
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  className="font-body"
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Password</Label>
                <Input id="admin-password" name="password" type="password" required className="font-body" />
              </div>
              <SubmitButton text="Login as Admin" />
              <Button
                variant="link"
                className="w-full text-royalBlue hover:text-gold"
                onClick={() => setIsAdminLogin(false)}
              >
                Back to Client Login
              </Button>
            </form>
          ) : (
            <>
              <form action={isSignUp ? signUpAction : signInAction} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@example.com"
                    required
                    className="font-body"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required className="font-body" />
                </div>
                <SubmitButton text={isSignUp ? "Sign Up" : "Sign In"} />
              </form>
              <div className="mt-4 text-center">
                <Button
                  variant="link"
                  className="text-royalBlue hover:text-gold"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </Button>
              </div>
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  className="w-full border-royalPurple text-royalPurple hover:bg-royalPurple hover:text-white bg-transparent"
                  onClick={() => setIsAdminLogin(true)}
                >
                  Run as Administrator
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
