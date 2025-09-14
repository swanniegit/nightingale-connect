'use client'

import { useState, useEffect, useCallback, useId } from 'react'

// CATEGORY: Data & State Hook
// CONTEXT: Client

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'practitioner' | 'nurse'
  avatar?: string
  lastLogin?: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  name: string
  role: User['role']
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  const id = useId()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('nightingale_user')
        if (storedUser) {
          const user = JSON.parse(storedUser)
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to load authentication data',
        })
      }
    }

    initializeAuth()
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || data.user.email.split('@')[0],
        role: data.user.role || 'practitioner',
        avatar: data.user.avatar,
        lastLogin: new Date(),
      }

      // Store user in localStorage
      localStorage.setItem('nightingale_user', JSON.stringify(user))

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })

      return { success: true, user }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  const signup = useCallback(async (signupData: SignupData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed')
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        avatar: data.user.avatar,
        lastLogin: new Date(),
      }

      // Store user in localStorage
      localStorage.setItem('nightingale_user', JSON.stringify(user))

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })

      return { success: true, user }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('nightingale_user')
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  }, [])

  const demoLogin = useCallback(() => {
    const demoUser: User = {
      id: 'demo-user',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'practitioner',
      lastLogin: new Date()
    }
    
    setAuthState({
      user: demoUser,
      isAuthenticated: true,
      isLoading: false,
      error: null
    })
    
    localStorage.setItem('nightingale_user', JSON.stringify(demoUser))
  }, [])

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...authState,
    login,
    signup,
    logout,
    demoLogin,
    clearError,
  }
}
