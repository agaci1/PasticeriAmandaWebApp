"use client"

import Link from "next/link"
import { GradientText } from "@/components/ui/gradient-text"

export default function MenuManagementPage() {
  return (
    <div className="space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <GradientText className="text-4xl md:text-5xl font-extrabold text-center">Menu Management</GradientText>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <Link href="/admin/menu-management/cakes" className="block bg-white/80 rounded-2xl shadow-lg border-gold p-8 text-center hover:shadow-xl transition-all">
          <h2 className="text-2xl font-bold text-royal-purple mb-2">Manage Cakes</h2>
          <p className="text-royal-blue">Add, edit, or remove cakes from the menu.</p>
        </Link>
        <Link href="/admin/menu-management/sweets" className="block bg-white/80 rounded-2xl shadow-lg border-gold p-8 text-center hover:shadow-xl transition-all">
          <h2 className="text-2xl font-bold text-royal-purple mb-2">Manage Sweets</h2>
          <p className="text-royal-blue">Add, edit, or remove sweets from the menu.</p>
        </Link>
        <Link href="/admin/menu-management/other" className="block bg-white/80 rounded-2xl shadow-lg border-gold p-8 text-center hover:shadow-xl transition-all">
          <h2 className="text-2xl font-bold text-royal-purple mb-2">Manage Other</h2>
          <p className="text-royal-blue">Add, edit, or remove other items from the menu.</p>
        </Link>
      </div>
    </div>
  )
}
