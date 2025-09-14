// CATEGORY: Core Libs/Types
// CONTEXT: Shared

export interface Message {
  id?: string
  cid: string
  roomId: string
  senderId: string
  createdAt: Date
  status: 'local' | 'sending' | 'sent' | 'ack' | 'failed' | 'deleted'
  kind: 'text' | 'image' | 'file' | 'system' | 'medical' | 'voice' | 'video'
  text?: string
  media?: {
    url?: string
    blobRef?: string
    mime?: string
    w?: number
    h?: number
    size?: number
    duration?: number // for voice/video
  }
  medicalData?: {
    type: 'vital' | 'lab' | 'diagnosis' | 'prescription' | 'appointment'
    data: Record<string, any>
    patientId?: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
  }
  reactions?: Record<string, string[]>
  editedAt?: Date
  readBy?: string[]
  replyTo?: string // message ID being replied to
  threadId?: string // for message threading
  isEncrypted?: boolean
}

export interface Room {
  id: string
  isGroup: boolean
  title: string
  lastMessageAt: Date
  createdAt: Date
}

export interface Member {
  roomId: string
  userId: string
  role: 'admin' | 'member'
  joinedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'user'
}

export interface OutboxItem {
  cid: string
  roomId: string
  payload: any
  attempt: number
  nextAttemptAt: Date
}

export interface MediaBlob {
  blobRef: string
  blob: Blob
}

export interface ReadReceipt {
  roomId: string
  userId: string
  messageId: string
  readAt: Date
}

export interface EncryptionKey {
  roomId: string
  deviceId: string
  keyMaterial: string
}

export interface DatabaseError extends Error {
  code?: string
  constraint?: string
}

// Advanced Chat Features Types
export interface TypingIndicator {
  userId: string
  roomId: string
  isTyping: boolean
  timestamp: Date
}

export interface MessageReaction {
  messageId: string
  userId: string
  emoji: string
  timestamp: Date
}

export interface MessageThread {
  id: string
  parentMessageId: string
  roomId: string
  title?: string
  createdAt: Date
  lastMessageAt: Date
  participantCount: number
}

export interface SearchFilter {
  query?: string
  roomId?: string
  senderId?: string
  messageType?: Message['kind']
  dateFrom?: Date
  dateTo?: Date
  hasMedia?: boolean
  isEncrypted?: boolean
}

export interface NotificationSettings {
  userId: string
  pushEnabled: boolean
  emailEnabled: boolean
  soundEnabled: boolean
  mentionOnly: boolean
  quietHours: {
    enabled: boolean
    start: string // HH:MM format
    end: string // HH:MM format
  }
}

export interface EncryptionKey {
  roomId: string
  deviceId: string
  keyMaterial: string
  algorithm: 'AES-256-GCM' | 'ChaCha20-Poly1305'
  createdAt: Date
  expiresAt?: Date
}
