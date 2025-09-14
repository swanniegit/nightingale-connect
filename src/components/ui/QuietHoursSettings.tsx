'use client'

import { Button } from './Button'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface QuietHoursSettingsProps {
  settings: {
    enabled: boolean
    start: string
    end: string
  }
  onUpdate: (settings: any) => void
}

export function QuietHoursSettings({
  settings,
  onUpdate
}: QuietHoursSettingsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">Quiet Hours</div>
          <div className="text-sm text-gray-500">Disable notifications during specific times</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdate({ ...settings, enabled: !settings.enabled })}
        >
          {settings.enabled ? 'Disable' : 'Enable'}
        </Button>
      </div>
      {settings.enabled && (
        <div className="flex items-center gap-2 ml-4">
          <input
            type="time"
            value={settings.start}
            onChange={(e) => onUpdate({ ...settings, start: e.target.value })}
            className="px-2 py-1 border rounded text-sm"
          />
          <span className="text-sm text-gray-500">to</span>
          <input
            type="time"
            value={settings.end}
            onChange={(e) => onUpdate({ ...settings, end: e.target.value })}
            className="px-2 py-1 border rounded text-sm"
          />
        </div>
      )}
    </div>
  )
}
