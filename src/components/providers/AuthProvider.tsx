'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAuth, User, AuthState, LoginCredentials, SignupData } from '@/hooks/useAuth'

// CATEGORY: Providers & Guards
// CONTEXT: Client

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; user?: User; error?: string }>
  signup: (data: SignupData) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
