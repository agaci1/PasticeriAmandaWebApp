import { useState, useEffect } from 'react'
import { isAuthenticated as checkAuth, getUserRole } from '@/lib/auth'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only check authentication on the client side
    const auth = checkAuth()
    const role = getUserRole()
    
    setIsAuthenticated(auth)
    setUserRole(role)
    setIsLoading(false)
  }, [])

  return {
    isAuthenticated: isAuthenticated || false,
    userRole,
    isLoading
  }
} 