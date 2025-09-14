'use client'

import { Card } from './Card'
import { NotificationToggle } from './NotificationToggle'
import { QuietHoursSettings } from './QuietHoursSettings'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface NotificationSettingsProps {
  settings: any
  onUpdateSettings: (settings: any) => void
  onRequestPermission: () => Promise<boolean>
  permission: NotificationPermission
  isSupported: boolean
  className?: string
}

export function NotificationSettings({
  settings,
  onUpdateSettings,
  onRequestPermission,
  permission,
  isSupported,
  className
}: NotificationSettingsProps) {
  if (!isSupported) {
    return (
      <Card className={cn('p-4', className)}>
        <h3 className="font-semibold mb-2">Notifications</h3>
        <p className="text-sm text-gray-500">
          Notifications are not supported in this browser.
        </p>
      </Card>
    )
  }

  return (
    <Card className={cn('p-4 space-y-4', className)}>
      <h3 className="font-semibold">Notification Settings</h3>
      <NotificationToggle
        label="Push Notifications"
        description={permission === 'granted' ? 'Enabled' : 
                   permission === 'denied' ? 'Blocked by browser' : 'Permission required'}
        enabled={settings.pushEnabled}
        onToggle={() => onUpdateSettings({ pushEnabled: !settings.pushEnabled })}
        disabled={permission === 'denied'}
      />
      <NotificationToggle
        label="Sound Notifications"
        description="Play sound for new messages"
        enabled={settings.soundEnabled}
        onToggle={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
      />
      <NotificationToggle
        label="Mentions Only"
        description="Only notify for direct mentions"
        enabled={settings.mentionOnly}
        onToggle={() => onUpdateSettings({ mentionOnly: !settings.mentionOnly })}
      />
      <QuietHoursSettings
        settings={settings.quietHours}
        onUpdate={(quietHours) => onUpdateSettings({ quietHours })}
      />
    </Card>
  )
}
