'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'

// CATEGORY: Client Orchestrator
// CONTEXT: Client
export function SupabaseTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        addResult('❌ Missing environment variables')
        addResult('Please run: setup-env.bat')
        return
      }

      addResult('✅ Environment variables found')
      addResult(`URL: ${supabaseUrl.substring(0, 30)}...`)
      addResult(`Key: ${supabaseAnonKey.substring(0, 20)}...`)
      
      // Test basic connection
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      })
      
      if (response.ok) {
        addResult('✅ Supabase connection successful')
      } else {
        addResult(`❌ Supabase connection failed: ${response.status}`)
      }
      
    } catch (error) {
      addResult(`❌ Connection test failed: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Supabase Integration Test</h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testConnection}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isLoading ? <Spinner /> : 'Test Connection'}
          </Button>
          
          <Button 
            onClick={clearResults}
            className="bg-gray-500 hover:bg-gray-600"
          >
            Clear Results
          </Button>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg max-h-64 overflow-y-auto">
          <h4 className="font-medium mb-2">Test Results:</h4>
          {results.length === 0 ? (
            <p className="text-gray-500 text-sm">No results yet. Click &quot;Test Connection&quot; above.</p>
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
