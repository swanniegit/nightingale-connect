'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface FilterDropdownProps {
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function FilterDropdown({
  options,
  value,
  onChange,
  placeholder = "Filter by...",
  className
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find(opt => opt.value === value)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-3 py-2 text-left border rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'flex items-center justify-between',
          isOpen ? 'border-blue-500' : 'border-gray-300'
        )}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                'w-full px-3 py-2 text-left hover:bg-gray-100',
                'flex items-center justify-between',
                value === option.value && 'bg-blue-50 text-blue-600'
              )}
            >
              <span>{option.label}</span>
              {option.count !== undefined && (
                <span className="text-sm text-gray-500">({option.count})</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
