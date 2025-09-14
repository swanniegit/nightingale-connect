'use client'

import { useState, useEffect, useCallback } from 'react'
import { Message } from '@/types'
import { NotificationToast } from './NotificationToast'
import { useNotifications } from '@/hooks/useNotifications'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface NotificationManagerProps {
  userId: string
  currentRoomId?: string
  onMessageClick?: (message: Message) => void
}

export function NotificationManager({
  userId,
  currentRoomId,
  onMessageClick
}: NotificationManagerProps) {
  const [toasts, setToasts] = useState<any[]>([])
  const { settings, sendMessageNotification, playNotificationSound, isSupported } = useNotifications({ userId })

  const handleNewMessage = useCallback(async (message: Message, roomName: string) => {
    if (!isSupported || !settings.pushEnabled) return
    if (currentRoomId && message.roomId === currentRoomId) return
    if (message.senderId === userId) return

    const senderName = `User ${message.senderId.slice(-4)}`
    const messageText = message.text || 'Media message'
    const isMention = message.text?.includes(`@${userId}`) || false

    if (settings.mentionOnly && !isMention) return

    await sendMessageNotification(messageText, senderName, roomName, isMention)
    playNotificationSound()

    const toast = {
      id: `toast-${Date.now()}`,
      title: isMention ? `@${senderName} mentioned you` : `New message from ${senderName}`,
      message: messageText,
      senderName,
      roomName,
      isMention,
      messageData: message
    }

    setToasts(prev => [...prev, toast])
  }, [isSupported, settings, sendMessageNotification, playNotificationSound, currentRoomId, userId])

  const removeToast = useCallback((toastId: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId))
  }, [])

  const handleToastClick = useCallback((toast: any) => {
    if (toast.messageData && onMessageClick) {
      onMessageClick(toast.messageData)
    }
    removeToast(toast.id)
  }, [onMessageClick, removeToast])

  useEffect(() => {
    const handleMessageEvent = (event: CustomEvent) => {
      const { message, roomName } = event.detail
      handleNewMessage(message, roomName)
    }

    window.addEventListener('newMessage', handleMessageEvent as EventListener)
    return () => {
      window.removeEventListener('newMessage', handleMessageEvent as EventListener)
    }
  }, [handleNewMessage])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <NotificationToast
          key={toast.id}
          title={toast.title}
          message={toast.message}
          senderName={toast.senderName}
          roomName={toast.roomName}
          isMention={toast.isMention}
          onClose={() => removeToast(toast.id)}
          onClick={() => handleToastClick(toast)}
        />
      ))}
    </div>
  )
}

export const triggerMessageNotification = (message: Message, roomName: string) => {
  const event = new CustomEvent('newMessage', {
    detail: { message, roomName }
  })
  window.dispatchEvent(event)
}
