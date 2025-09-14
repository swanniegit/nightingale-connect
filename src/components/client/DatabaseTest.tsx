'use client'
import { useDatabase } from '@/hooks/use-database'
import { MessageDB } from '@/lib/database-operations'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'

// CATEGORY: Client Orchestrator
// CONTEXT: Client
export function DatabaseTest() {
  const { isReady, error } = useDatabase()

  const testMessage = async () => {
    try {
      const messageId = await MessageDB.create({
        cid: crypto.randomUUID(),
        roomId: 'test-room',
        senderId: 'test-user',
        createdAt: new Date(),
        status: 'local',
        kind: 'text',
        text: 'Test message from IndexedDB!'
      })
      console.log('Message created:', messageId)
    } catch (err) {
      console.error('Error creating message:', err)
    }
  }

  if (error) {
    return (
      <Card className="p-4 border-red-200 bg-red-50">
        <p className="text-red-600">Database Error: {error.message}</p>
      </Card>
    )
  }

  if (!isReady) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          <span>Initializing database...</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Database Test</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Database is ready! Test message creation.
      </p>
      <Button onClick={testMessage} size="sm">
        Test Message
      </Button>
    </Card>
  )
}
