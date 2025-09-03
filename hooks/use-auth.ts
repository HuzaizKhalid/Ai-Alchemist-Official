"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  plan: "free" | "pro"
  searchesUsed: number
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      setUser(null)
      window.location.reload()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return {
    user,
    loading,
    searchesUsed: user?.searchesUsed || 0,
    logout,
  }
}
