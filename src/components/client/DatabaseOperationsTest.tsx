'use client'
import { useState } from 'react'
import { MessageDB } from '@/lib/database-operations'
import { RoomDB } from '@/lib/room-operations'
import { MemberDB } from '@/lib/member-operations'
import { OutboxDB } from '@/lib/outbox-operations'
import { MediaDB } from '@/lib/media-operations'
import { ReadDB } from '@/lib/read-operations'
import { DatabaseCleanup } from '@/lib/database-cleanup'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'

// CATEGORY: Client Orchestrator
// CONTEXT: Client
export function DatabaseOperationsTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testMessageOperations = async () => {
    setIsLoading(true)
    try {
      const cid = crypto.randomUUID()
      const messageId = await MessageDB.create({
        cid,
        roomId: 'test-room',
        senderId: 'test-user',
        createdAt: new Date(),
        status: 'local',
        kind: 'text',
        text: 'Test message from database operations!'
      })
      addResult(`✅ Message created: ${messageId}`)

      const messages = await MessageDB.getByRoom('test-room')
      addResult(`✅ Messages retrieved: ${messages.length} messages`)

      await MessageDB.updateStatus(cid, 'sent')
      addResult(`✅ Message status updated to 'sent'`)

      const message = await MessageDB.getByCid(cid)
      addResult(`✅ Message retrieved by CID: ${message?.text}`)

    } catch (error) {
      addResult(`❌ Message operations failed: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testRoomOperations = async () => {
    setIsLoading(true)
    try {
      const roomId = await RoomDB.create({
        isGroup: true,
        title: 'Test Room',
        lastMessageAt: new Date()
      })
      addResult(`✅ Room created: ${roomId}`)

      const rooms = await RoomDB.getAll()
      addResult(`✅ Rooms retrieved: ${rooms.length} rooms`)

      const room = await RoomDB.getById(roomId)
      addResult(`✅ Room retrieved by ID: ${room?.title}`)

    } catch (error) {
      addResult(`❌ Room operations failed: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testMemberOperations = async () => {
    setIsLoading(true)
    try {
      // Try to add member, handle if already exists
      try {
        await MemberDB.add({
          roomId: 'test-room',
          userId: 'test-user',
          role: 'admin'
        })
        addResult(`✅ Member added to room`)
      } catch (error) {
        if (error instanceof Error && error.name === 'ConstraintError') {
          addResult(`✅ Member already exists (constraint working)`)
        } else {
          throw error
        }
      }

      const members = await MemberDB.getByRoom('test-room')
      addResult(`✅ Members retrieved: ${members.length} members`)

      const userMembers = await MemberDB.getByUser('test-user')
      addResult(`✅ User memberships: ${userMembers.length} rooms`)

    } catch (error) {
      addResult(`❌ Member operations failed: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testOutboxOperations = async () => {
    setIsLoading(true)
    try {
      const cid = crypto.randomUUID()
      await OutboxDB.add({
        cid,
        roomId: 'test-room',
        payload: { text: 'Test outbox message' }
      })
      addResult(`✅ Outbox item added`)

      const items = await OutboxDB.getAll()
      addResult(`✅ Outbox items retrieved: ${items.length} items`)

      const pending = await OutboxDB.getPending()
      addResult(`✅ Pending items: ${pending.length} items`)

    } catch (error) {
      addResult(`❌ Outbox operations failed: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testMediaOperations = async () => {
    setIsLoading(true)
    try {
      const blob = new Blob(['test media content'], { type: 'text/plain' })
      const blobRef = 'test-blob-ref'
      
      // Try to store media, handle if already exists
      try {
        await MediaDB.store(blobRef, blob)
        addResult(`✅ Media blob stored`)
      } catch (error) {
        if (error instanceof Error && error.name === 'ConstraintError') {
          addResult(`✅ Media blob already exists (constraint working)`)
        } else {
          throw error
        }
      }

      const retrievedBlob = await MediaDB.get(blobRef)
      addResult(`✅ Media blob retrieved: ${retrievedBlob ? 'success' : 'failed'}`)

      const allMedia = await MediaDB.getAll()
      addResult(`✅ All media blobs: ${allMedia.length} items`)

    } catch (error) {
      addResult(`❌ Media operations failed: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testReadOperations = async () => {
    setIsLoading(true)
    try {
      // Try to mark read, handle if already exists
      try {
        await ReadDB.markRead('test-room', 'test-user', 'test-message')
        addResult(`✅ Read receipt marked`)
      } catch (error) {
        if (error instanceof Error && error.name === 'ConstraintError') {
          addResult(`✅ Read receipt already exists (constraint working)`)
        } else {
          throw error
        }
      }

      const roomReads = await ReadDB.getByRoom('test-room')
      addResult(`✅ Room read receipts: ${roomReads.length} items`)

      const userReads = await ReadDB.getByUser('test-user')
      addResult(`✅ User read receipts: ${userReads.length} items`)

    } catch (error) {
      addResult(`❌ Read operations failed: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testCleanupOperations = async () => {
    setIsLoading(true)
    try {
      const usage = await DatabaseCleanup.getStorageUsage()
      addResult(`✅ Storage usage: ${usage.total} total items`)

      const deletedMessages = await DatabaseCleanup.clearOldMessages(0)
      addResult(`✅ Cleaned old messages: ${deletedMessages} items`)

      const deletedOutbox = await DatabaseCleanup.clearFailedOutboxItems()
      addResult(`✅ Cleaned failed outbox: ${deletedOutbox} items`)

    } catch (error) {
      addResult(`❌ Cleanup operations failed: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  const clearTestData = async () => {
    setIsLoading(true)
    try {
      await DatabaseCleanup.clearAllData()
      addResult(`✅ All test data cleared`)
    } catch (error) {
      addResult(`❌ Clear data failed: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Database Operations Test</h3>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button onClick={testMessageOperations} disabled={isLoading} size="sm">
          Test Messages
        </Button>
        <Button onClick={testRoomOperations} disabled={isLoading} size="sm">
          Test Rooms
        </Button>
        <Button onClick={testMemberOperations} disabled={isLoading} size="sm">
          Test Members
        </Button>
        <Button onClick={testOutboxOperations} disabled={isLoading} size="sm">
          Test Outbox
        </Button>
        <Button onClick={testMediaOperations} disabled={isLoading} size="sm">
          Test Media
        </Button>
        <Button onClick={testReadOperations} disabled={isLoading} size="sm">
          Test Reads
        </Button>
        <Button onClick={testCleanupOperations} disabled={isLoading} size="sm">
          Test Cleanup
        </Button>
        <Button onClick={clearResults} variant="secondary" size="sm">
          Clear Results
        </Button>
        <Button onClick={clearTestData} variant="secondary" size="sm">
          Clear Test Data
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 mb-4">
          <Spinner size="sm" />
          <span className="text-sm">Running tests...</span>
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-muted p-3 rounded-md max-h-60 overflow-y-auto">
          <h4 className="font-medium mb-2">Test Results:</h4>
          <div className="space-y-1 text-sm font-mono">
            {results.map((result, index) => (
              <div key={index} className="text-xs">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
