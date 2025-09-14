'use client'

import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface ToasterProps {
  className?: string
}

export function Toaster({ className }: ToasterProps) {
  return (
    <div className={cn('fixed top-4 right-4 z-50', className)}>
      {/* Toast notifications will be rendered here */}
    </div>
  )
}
