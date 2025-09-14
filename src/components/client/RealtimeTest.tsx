'use client'

import { useState, useEffect } from 'react'
import { useRealtime } from '@/hooks/useRealtime'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'

// CATEGORY: Client Orchestrator
// CONTEXT: Client
export function RealtimeTest() {
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { 
    isConnected, 
    activeSubscriptions, 
    subscribeToMessages, 
    subscribeToRooms, 
    subscribeToMembers,
    unsubscribe,
    unsubscribeAll 
  } = useRealtime()

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testConnection = async () => {
    setIsLoading(true)
    try {
      if (isConnected) {
        addResult('✅ Realtime connection is active')
      } else {
        addResult('❌ Realtime connection is not active')
      }
    } catch (error) {
      addResult(`❌ Connection test failed: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testMessageSubscription = () => {
    try {
      subscribeToMessages('test-room', (message) => {
        addResult(`📨 New message received: ${message.text || 'Media message'}`)
      })
      addResult('✅ Subscribed to messages for test-room')
    } catch (error) {
      addResult(`❌ Message subscription failed: ${error}`)
    }
  }

  const testRoomSubscription = () => {
    try {
      subscribeToRooms((room) => {
        addResult(`🏠 New room received: ${room.title}`)
      })
      addResult('✅ Subscribed to rooms')
    } catch (error) {
      addResult(`❌ Room subscription failed: ${error}`)
    }
  }

  const testMemberSubscription = () => {
    try {
      subscribeToMembers('test-room', (member) => {
        addResult(`👥 New member received: ${member.userId}`)
      })
      addResult('✅ Subscribed to members for test-room')
    } catch (error) {
      addResult(`❌ Member subscription failed: ${error}`)
    }
  }

  const testUnsubscribe = () => {
    try {
      unsubscribe('messages:test-room')
      addResult('✅ Unsubscribed from messages:test-room')
    } catch (error) {
      addResult(`❌ Unsubscribe failed: ${error}`)
    }
  }

  const testUnsubscribeAll = () => {
    try {
      unsubscribeAll()
      addResult('✅ Unsubscribed from all channels')
    } catch (error) {
      addResult(`❌ Unsubscribe all failed: ${error}`)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Realtime Subscriptions Test</h3>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={testConnection}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isLoading ? <Spinner /> : 'Test Connection'}
          </Button>
          
          <Button 
            onClick={testMessageSubscription}
            disabled={!isConnected}
            className="bg-green-500 hover:bg-green-600"
          >
            Subscribe to Messages
          </Button>
          
          <Button 
            onClick={testRoomSubscription}
            disabled={!isConnected}
            className="bg-purple-500 hover:bg-purple-600"
          >
            Subscribe to Rooms
          </Button>
          
          <Button 
            onClick={testMemberSubscription}
            disabled={!isConnected}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Subscribe to Members
          </Button>
          
          <Button 
            onClick={testUnsubscribe}
            disabled={!isConnected}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            Unsubscribe Messages
          </Button>
          
          <Button 
            onClick={testUnsubscribeAll}
            disabled={!isConnected}
            className="bg-red-500 hover:bg-red-600"
          >
            Unsubscribe All
          </Button>
          
          <Button 
            onClick={clearResults}
            className="bg-gray-500 hover:bg-gray-600"
          >
            Clear Results
          </Button>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <strong>Connection Status:</strong> {isConnected ? '✅ Connected' : '❌ Disconnected'}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Active Subscriptions:</strong> {activeSubscriptions.length} channels
          </div>
          {activeSubscriptions.length > 0 && (
            <div className="text-xs text-gray-500">
              {activeSubscriptions.join(', ')}
            </div>
          )}
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
