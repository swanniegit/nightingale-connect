// Service Worker for Nightingale Connect
// Handles push notifications and background sync

const CACHE_NAME = 'nightingale-connect-v1'
const NOTIFICATION_TAG = 'nightingale-message'

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Push event received:', event)

  if (!event.data) {
    console.log('Push event but no data')
    return
  }

  try {
    const data = event.data.json()
    console.log('Push data:', data)

    const options = {
      body: data.message || 'New message received',
      icon: '/assets/nightingale-logo-circle.png',
      badge: '/assets/nightingale-logo-circle.png',
      tag: NOTIFICATION_TAG,
      data: {
        roomId: data.roomId,
        messageId: data.messageId,
        url: data.url || '/'
      },
      actions: [
        {
          action: 'view',
          title: 'View Message',
          icon: '/assets/nightingale-logo-circle.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/assets/nightingale-logo-circle.png'
        }
      ],
      requireInteraction: data.isMention || false,
      silent: false
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'Nightingale Connect', options)
    )
  } catch (error) {
    console.error('Error handling push event:', error)
    
    // Fallback notification
    event.waitUntil(
      self.registration.showNotification('Nightingale Connect', {
        body: 'You have a new message',
        icon: '/assets/nightingale-logo-circle.png',
        tag: NOTIFICATION_TAG
      })
    )
  }
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)

  event.notification.close()

  if (event.action === 'dismiss') {
    return
  }

  const data = event.notification.data || {}
  const url = data.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          client.focus()
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            data: data
          })
          return
        }
      }

      // Open new window if app is not open
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

// Background sync for offline messages
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event.tag)

  if (event.tag === 'message-sync') {
    event.waitUntil(syncMessages())
  }
})

// Sync offline messages
async function syncMessages() {
  try {
    // Get offline messages from IndexedDB
    const messages = await getOfflineMessages()
    
    if (messages.length === 0) {
      console.log('No offline messages to sync')
      return
    }

    console.log(`Syncing ${messages.length} offline messages`)

    // Send messages to server
    for (const message of messages) {
      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        })

        if (response.ok) {
          console.log('Message synced successfully:', message.id)
          // Remove from offline storage
          await removeOfflineMessage(message.id)
        } else {
          console.error('Failed to sync message:', message.id)
        }
      } catch (error) {
        console.error('Error syncing message:', message.id, error)
      }
    }
  } catch (error) {
    console.error('Error in background sync:', error)
  }
}

// Helper functions for IndexedDB operations
async function getOfflineMessages() {
  // This would typically access IndexedDB
  // For now, return empty array
  return []
}

async function removeOfflineMessage(messageId) {
  // This would typically remove from IndexedDB
  console.log('Removing offline message:', messageId)
}

// Message event handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data)

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
