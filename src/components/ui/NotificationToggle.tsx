'use client'

import { Button } from './Button'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface NotificationToggleProps {
  label: string
  description: string
  enabled: boolean
  onToggle: () => void
  disabled?: boolean
}

export function NotificationToggle({
  label,
  description,
  enabled,
  onToggle,
  disabled = false
}: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        disabled={disabled}
      >
        {enabled ? 'Disable' : 'Enable'}
      </Button>
    </div>
  )
}
