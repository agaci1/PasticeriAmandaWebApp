import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signOut } from "@/actions/auth"
import { fetchUserOrders } from "@/actions/order"
import { OrderHistory } from "@/components/order-history"

export default async function AccountPage() {
  const supabase = createServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const { orders, message } = await fetchUserOrders()

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-babyPink p-4 md:p-8">
      <Card className="w-full max-w-4xl mx-auto shadow-xl animate-fade-in-up">
        <CardHeader className="text-center">
          <CardTitle className="font-title text-4xl text-royalPurple">Welcome, {user.email}</CardTitle>
          <CardDescription className="font-body text-gray-700">Manage your orders and profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <form action={signOut} className="flex justify-end">
            <Button
              variant="outline"
              className="border-royalPurple text-royalPurple hover:bg-royalPurple hover:text-white bg-transparent"
            >
              Sign Out
            </Button>
          </form>

          <h2 className="font-title text-3xl text-royalBlue text-center">Your Order History</h2>
          {orders && orders.length > 0 ? (
            <OrderHistory orders={orders} />
          ) : (
            <p className="font-body text-center text-gray-600">{message || "You haven't placed any orders yet."}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
