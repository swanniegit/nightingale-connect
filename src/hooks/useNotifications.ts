'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

// CATEGORY: Data & State Hook
// CONTEXT: Client

interface NotificationSettings {
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

interface UseNotificationsProps {
  userId: string
}

export function useNotifications({ userId }: UseNotificationsProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: false,
    emailEnabled: false,
    soundEnabled: true,
    mentionOnly: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  })
  const [isSupported, setIsSupported] = useState(false)

  // Check if notifications are supported
  useEffect(() => {
    setIsSupported('Notification' in window && 'serviceWorker' in navigator)
  }, [])

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      return permission === 'granted'
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }, [isSupported])

  // Send notification
  const sendNotification = useCallback(async (title: string, options: NotificationOptions = {}) => {
    if (!isSupported || permission !== 'granted' || !settings.pushEnabled) return

    // Check quiet hours
    if (settings.quietHours.enabled) {
      const now = new Date()
      const currentTime = now.getHours() * 60 + now.getMinutes()
      const startTime = parseTime(settings.quietHours.start)
      const endTime = parseTime(settings.quietHours.end)

      if (isInQuietHours(currentTime, startTime, endTime)) {
        return
      }
    }

    try {
      const notification = new Notification(title, {
        icon: '/assets/nightingale-logo-circle.png',
        badge: '/assets/nightingale-logo-circle.png',
        ...options
      })

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }, [isSupported, permission, settings])

  // Send message notification
  const sendMessageNotification = useCallback(async (
    message: string,
    senderName: string,
    roomName: string,
    isMention: boolean = false
  ) => {
    if (!settings.pushEnabled) return
    if (settings.mentionOnly && !isMention) return

    const title = isMention ? `@${senderName} mentioned you in ${roomName}` : `New message from ${senderName}`
    const body = message.length > 100 ? message.substring(0, 100) + '...' : message

    await sendNotification(title, {
      body,
      tag: `message-${roomName}`,
      data: { roomName, senderName, isMention }
    })
  }, [settings, sendNotification])

  // Update notification settings
  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings }
      setSettings(updatedSettings)

      // Save to server
      await apiClient.post('/notifications/settings', {
        userId,
        settings: updatedSettings
      })
    } catch (error) {
      console.error('Failed to update notification settings:', error)
    }
  }, [settings, userId])

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (!settings.soundEnabled) return

    try {
      const audio = new Audio('/sounds/notification.mp3')
      audio.volume = 0.5
      audio.play().catch(() => {
        // Fallback to system beep
        console.log('\a')
      })
    } catch (error) {
      console.error('Failed to play notification sound:', error)
    }
  }, [settings.soundEnabled])

  // Check if current time is in quiet hours
  const isInQuietHours = (currentTime: number, startTime: number, endTime: number) => {
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime
    } else {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime
    }
  }

  // Parse time string (HH:MM) to minutes
  const parseTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await apiClient.get(`/notifications/settings/${userId}`)
        if (response.data) {
          setSettings(response.data as NotificationSettings)
        }
      } catch (error) {
        console.error('Failed to load notification settings:', error)
      }
    }

    if (userId) {
      loadSettings()
    }
  }, [userId])

  return {
    permission,
    settings,
    isSupported,
    requestPermission,
    sendNotification,
    sendMessageNotification,
    updateSettings,
    playNotificationSound
  }
}
