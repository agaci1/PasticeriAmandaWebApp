import API_BASE from "./api"

// This is a simplified client-side auth helper.
// In a real app, you'd use HTTP-only cookies for tokens
// and potentially a more robust auth library.

const TOKEN_KEY = "pasticeri_amanda_token"
const USER_ROLE_KEY = "pasticeri_amanda_role"

export const setAuthData = (token: string, role: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_ROLE_KEY, role)
    // For middleware to work, also set cookies. In a real app, backend would set HTTP-only cookies.
    // document.cookie = `pasticeri_amanda_token=${token}; path=/; max-age=3600;` // 1 hour
    // document.cookie = `pasticeri_amanda_role=${role}; path=/; max-age=3600;`
  }
}

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

export const getUserRole = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(USER_ROLE_KEY)
  }
  return null
}

export const clearAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_ROLE_KEY)
    // Clear cookies as well
    // document.cookie = "pasticeri_amanda_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
    // document.cookie = "pasticeri_amanda_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
  }
}

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null
}

export const isAdmin = (): boolean => {
  return getUserRole() === "ADMIN"
}

// Server-side fetch wrapper for authenticated requests
export async function authenticatedFetch(url: string, options?: RequestInit) {
  const token = getAuthToken() // This would ideally come from a server-side cookie
  const headers = {
    ...options?.headers,
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const contentType = res.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json()
      console.error("API Error (JSON):", errorData)
      // If 401, clear auth data and redirect client-side
      if (res.status === 401) {
        clearAuthData()
        // Use window.location.href for full page reload to clear state and trigger middleware
        // window.location.href = "/auth/login"
        // Do not redirect here. Let the calling component handle it.
        // The error will be thrown, and the component can catch it and redirect.
      }
      throw new Error(errorData.message || `API error: ${res.status}`)
    } else {
      const errorText = await res.text()
      console.error("API Error (Non-JSON Response):", errorText)
      // If 401, clear auth data and redirect client-side
      if (res.status === 401) {
        clearAuthData()
        // window.location.href = "/auth/login"
        // Do not redirect here. Let the calling component handle it.
        // The error will be thrown, and the component can catch it and redirect.
      }
      throw new Error(
        `API error: Expected JSON, received HTML/text. Status: ${res.status}. Response: ${errorText.substring(0, 200)}...`,
      )
    }
  }

  return res
}
