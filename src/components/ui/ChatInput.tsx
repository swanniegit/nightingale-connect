'use client'
import { useState, useRef, useCallback } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onTyping?: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ChatInput({ 
  onSendMessage, 
  onTyping, 
  placeholder = "Type a message...", 
  disabled = false,
  className
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }, [message, disabled, onSendMessage])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }, [handleSubmit])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    onTyping?.()
  }, [onTyping])

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
      <Input
        ref={inputRef}
        value={message}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1"
      />
      <Button
        type="submit"
        disabled={!message.trim() || disabled}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
      >
        Send
      </Button>
    </form>
  )
}
