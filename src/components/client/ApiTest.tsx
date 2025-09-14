'use client'

import { useState } from 'react'
import { MessagesAPI } from '@/lib/api/messages'
import { RoomsAPI } from '@/lib/api/rooms'
import { AuthAPI } from '@/lib/api/auth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

// CATEGORY: Client Orchestrator
// CONTEXT: Client
export function ApiTest() {
  const [results, setResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testMessages = async () => {
    addResult('Testing Messages API...')
    const response = await MessagesAPI.getByRoom('general')
    if (response.error) {
      addResult(`❌ Messages API failed: ${response.error}`)
    } else {
      addResult(`✅ Messages API success: ${response.data.length} messages`)
    }
  }

  const testRooms = async () => {
    addResult('Testing Rooms API...')
    const response = await RoomsAPI.getAll()
    if (response.error) {
      addResult(`❌ Rooms API failed: ${response.error}`)
    } else {
      addResult(`✅ Rooms API success: ${response.data.length} rooms`)
    }
  }

  const testAuth = async () => {
    addResult('Testing Auth API...')
    const response = await AuthAPI.login({ email: 'test@example.com', password: 'password' })
    if (response.error) {
      addResult(`❌ Auth API failed: ${response.error}`)
    } else {
      addResult(`✅ Auth API success: ${response.data.user.name}`)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">API Client Test</h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testMessages} className="bg-blue-500 hover:bg-blue-600">
            Test Messages
          </Button>
          <Button onClick={testRooms} className="bg-green-500 hover:bg-green-600">
            Test Rooms
          </Button>
          <Button onClick={testAuth} className="bg-purple-500 hover:bg-purple-600">
            Test Auth
          </Button>
          <Button onClick={clearResults} className="bg-gray-500 hover:bg-gray-600">
            Clear
          </Button>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg max-h-64 overflow-y-auto">
          <h4 className="font-medium mb-2">Test Results:</h4>
          {results.length === 0 ? (
            <p className="text-gray-500 text-sm">No results yet. Click a test button above.</p>
          ) : (
            <div className="space-y-1">
              {results.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
