'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium text-gray-700',
          required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
          className
        )}
        {...props}
      >
        {children}
      </label>
    )
  }
)

Label.displayName = 'Label'
