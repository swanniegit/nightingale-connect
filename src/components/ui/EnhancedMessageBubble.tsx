'use client'

import { Message } from '@/types'
import { MedicalDataMessage } from './MedicalDataMessage'
import { MediaMessage } from './MediaMessage'
import { MessageReactions } from './MessageReactions'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface EnhancedMessageBubbleProps {
  message: Message
  isOwn: boolean
  senderName: string
  onReaction: (messageId: string, emoji: string) => void
  onRemoveReaction: (messageId: string, emoji: string) => void
  currentUserId: string
  onReply?: (message: Message) => void
}

export function EnhancedMessageBubble({
  message,
  isOwn,
  senderName,
  onReaction,
  onRemoveReaction,
  currentUserId,
  onReply
}: EnhancedMessageBubbleProps) {
  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending': return '⏳'
      case 'sent': return '✓'
      case 'ack': return '✓✓'
      case 'failed': return '❌'
      case 'deleted': return '🗑️'
      default: return ''
    }
  }

  const getMessageContent = () => {
    switch (message.kind) {
      case 'medical':
        return <MedicalDataMessage message={message} isOwn={isOwn} />
      case 'image':
      case 'file':
      case 'voice':
      case 'video':
        return <MediaMessage message={message} isOwn={isOwn} />
      case 'system':
        return (
          <div className="text-center text-gray-500 italic">
            {message.text}
          </div>
        )
      default:
        return (
          <div className="whitespace-pre-wrap">
            {message.text}
          </div>
        )
    }
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOwn 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 text-gray-900'
      }`}>
        {!isOwn && (
          <div className="text-xs font-medium mb-1 opacity-70">
            {senderName}
          </div>
        )}
        
        {message.replyTo && (
          <div className={`text-xs mb-2 p-2 rounded ${
            isOwn ? 'bg-blue-400' : 'bg-gray-200'
          }`}>
            Replying to message...
          </div>
        )}
        
        <div className="mb-2">
          {getMessageContent()}
        </div>
        
        <div className="flex items-center justify-between text-xs opacity-70">
          <span>
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
          <div className="flex items-center gap-1">
            {getStatusIcon(message.status)}
            {message.isEncrypted && <span>🔒</span>}
          </div>
        </div>
        
        <div className="mt-2">
          <MessageReactions
            message={message}
            onReaction={(emoji) => onReaction(message.id || message.cid, emoji)}
            onRemoveReaction={(emoji) => onRemoveReaction(message.id || message.cid, emoji)}
            currentUserId={currentUserId}
          />
        </div>
        
        {onReply && message.kind !== 'system' && (
          <button
            onClick={() => onReply(message)}
            className="text-xs opacity-70 hover:opacity-100 mt-1"
          >
            Reply
          </button>
        )}
      </div>
    </div>
  )
}
