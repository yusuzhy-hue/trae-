'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface User {
  name: string
  school: string
  role: 'student' | 'teacher'
  userType: 'Trial' | 'Member'
  expiryDate?: string
  grade: string
  phone: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage on mount
    const storedUser = localStorage.getItem('ai_platform_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('ai_platform_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('ai_platform_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ai_platform_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
