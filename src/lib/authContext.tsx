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
  password?: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User, remember?: boolean) => void
  register: (userData: User, remember?: boolean) => void
  checkUser: (phone: string) => User | null
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage then sessionStorage on mount
    const localUser = localStorage.getItem('ai_platform_user')
    const sessionUser = sessionStorage.getItem('ai_platform_user')
    
    const storedUser = localUser || sessionUser
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('ai_platform_user')
        sessionStorage.removeItem('ai_platform_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User, remember: boolean = true) => {
    setUser(userData)
    if (remember) {
      localStorage.setItem('ai_platform_user', JSON.stringify(userData))
      sessionStorage.removeItem('ai_platform_user')
    } else {
      sessionStorage.setItem('ai_platform_user', JSON.stringify(userData))
      localStorage.removeItem('ai_platform_user')
    }
  }

  const register = (userData: User, remember: boolean = true) => {
    // 1. Get existing users
    const existingUsersStr = localStorage.getItem('ai_platform_registered_users')
    const existingUsers: User[] = existingUsersStr ? JSON.parse(existingUsersStr) : []
    
    // 2. Check if user already exists (by phone)
    const userIndex = existingUsers.findIndex(u => u.phone === userData.phone)
    if (userIndex >= 0) {
      // Update existing user
      existingUsers[userIndex] = userData
    } else {
      // Add new user
      existingUsers.push(userData)
    }
    
    // 3. Save back to storage
    localStorage.setItem('ai_platform_registered_users', JSON.stringify(existingUsers))
    
    // 4. Log the user in
    login(userData, remember)
  }

  const checkUser = (phone: string): User | null => {
    const existingUsersStr = localStorage.getItem('ai_platform_registered_users')
    const existingUsers: User[] = existingUsersStr ? JSON.parse(existingUsersStr) : []
    return existingUsers.find(u => u.phone === phone) || null
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ai_platform_user')
    sessionStorage.removeItem('ai_platform_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, checkUser, logout, isLoading }}>
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
