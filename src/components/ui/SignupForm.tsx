'use client'

import { useState } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import { Label } from './Label'
import { Select } from './Select'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface SignupFormProps {
  onSubmit: (data: { email: string; password: string; name: string; role: string }) => void
  isLoading?: boolean
  error?: string | null
}

export function SignupForm({ onSubmit, isLoading = false, error }: SignupFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'practitioner'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          disabled={isLoading}
        >
          <option value="practitioner">Healthcare Practitioner</option>
          <option value="nurse">Nurse</option>
          <option value="admin">Administrator</option>
        </Select>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  )
}