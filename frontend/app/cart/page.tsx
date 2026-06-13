"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/** Menu shopping removed — redirect legacy cart URL to custom order */
export default function CartPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/order")
  }, [router])

  return null
}
