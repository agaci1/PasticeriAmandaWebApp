import type React from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOut } from "@/actions/auth"
import { HomeIcon, PackageIcon, ShoppingCartIcon, LogOutIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  // Check if the user is an admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (profileError || !profile?.is_admin) {
    redirect("/login?message=Unauthorized access to admin panel.")
  }

  return (
    <div className="flex min-h-screen bg-babyPink">
      <aside className="w-64 bg-royalPurple text-white p-6 flex flex-col shadow-lg">
        <div className="mb-8">
          <h2 className="font-title text-3xl font-bold text-gold">Admin Panel</h2>
          <p className="text-sm text-lightAccent">Amanda Pastry Shop</p>
        </div>
        <nav className="flex-1 space-y-2">
          <NavLink href="/admin/dashboard" icon={<HomeIcon className="h-5 w-5" />} label="Dashboard" />
          <NavLink href="/admin/orders" icon={<ShoppingCartIcon className="h-5 w-5" />} label="Manage Orders" />
          <NavLink href="/admin/menu" icon={<PackageIcon className="h-5 w-5" />} label="Manage Menu" />
        </nav>
        <form action={signOut} className="mt-auto">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-royalBlue hover:text-gold">
            <LogOutIcon className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </form>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}

interface NavLinkProps {
  href: string
  icon: React.ReactNode
  label: string
}

function NavLink({ href, icon, label }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-md text-lg font-body transition-colors",
        "hover:bg-royalBlue hover:text-gold",
        "aria-[current=page]:bg-royalBlue aria-[current=page]:text-gold",
      )}
      aria-current={typeof window !== "undefined" && window.location.pathname === href ? "page" : undefined}
      prefetch={false}
    >
      {icon}
      {label}
    </Link>
  )
}
