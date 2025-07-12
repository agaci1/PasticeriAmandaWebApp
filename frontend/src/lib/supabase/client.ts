import { createBrowserClient } from "@supabase/supabase-js"

// This client is used for client-side operations (Client Components)
// It's a singleton to prevent multiple client instances.
let supabase: ReturnType<typeof createBrowserClient> | undefined

export function createClientComponentClient() {
  if (!supabase) {
    supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }
  return supabase
}
