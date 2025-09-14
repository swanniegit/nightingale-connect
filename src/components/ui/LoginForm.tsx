'use client'

import { useState } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import { Label } from './Label'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => void
  isLoading?: boolean
  error?: string | null
}

export function LoginForm({ onSubmit, isLoading = false, error }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  )
}