'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'default' | 'error'
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <select
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          variant === 'error' && 'border-red-500 focus:ring-red-500',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'
