'use client'

import { useState } from 'react'
import { Dialog } from './Dialog'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import { Button } from './Button'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (credentials: { email: string; password: string }) => void
  onSignup: (data: { email: string; password: string; name: string; role: string }) => void
  isLoading?: boolean
  error?: string | null
}

export function AuthModal({ 
  isOpen, 
  onClose, 
  onLogin, 
  onSignup, 
  isLoading = false, 
  error 
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const handleModeSwitch = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </div>

        {mode === 'login' ? (
          <LoginForm
            onSubmit={onLogin}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <SignupForm
            onSubmit={onSignup}
            isLoading={isLoading}
            error={error}
          />
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={handleModeSwitch}
              className="text-blue-600 hover:text-blue-800 underline"
              disabled={isLoading}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </Dialog>
  )
}
