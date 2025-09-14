'use client'

import { useState } from 'react'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { AuthModal } from '@/components/ui/AuthModal'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

// CATEGORY: Client Orchestrator
// CONTEXT: Client

export function AuthTest() {
  const { user, isAuthenticated, logout, error, login, signup, isLoading } = useAuthContext()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handleLogin = async (credentials: { email: string; password: string }) => {
    const result = await login(credentials)
    if (result.success) {
      setIsAuthModalOpen(false)
    }
  }

  const handleSignup = async (data: { email: string; password: string; name: string; role: string }) => {
    const result = await signup(data)
    if (result.success) {
      setIsAuthModalOpen(false)
    }
  }

  if (isAuthenticated && user) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Authentication Status</h3>
        
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">✅ Authenticated</h4>
            <div className="text-sm space-y-1">
              <div><strong>Name:</strong> {user.name}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Role:</strong> {user.role}</div>
              <div><strong>ID:</strong> {user.id}</div>
            </div>
          </div>

          <Button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Sign Out
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Authentication Test</h3>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">🔒 Not Authenticated</h4>
          <p className="text-sm text-gray-600">
            Sign in to test the authentication system
          </p>
        </div>

        <div className="space-y-2">
          <Button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Sign In / Sign Up
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          <p><strong>Demo Accounts:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>admin@nightingale.com / admin123 (Admin)</li>
            <li>nurse@nightingale.com / nurse123 (Nurse)</li>
            <li>test@example.com / password (Practitioner)</li>
          </ul>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
        isLoading={isLoading}
        error={error}
      />
    </Card>
  )
}
