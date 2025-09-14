'use client'

import { useState } from 'react'
import { Message } from '@/types'
import { SearchInput } from './SearchInput'
import { FilterDropdown } from './FilterDropdown'
import { MessageSearchResults } from './MessageSearchResults'
import { Button } from './Button'
import { Card } from './Card'
import { cn } from '@/lib/utils'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onMessageClick: (message: Message) => void
  currentUserId: string
  roomId?: string
  className?: string
}

export function SearchModal({
  isOpen,
  onClose,
  onMessageClick,
  currentUserId,
  roomId,
  className
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchResults, setSearchResults] = useState<Message[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const filterOptions = [
    { value: 'all', label: 'All Messages' },
    { value: 'text', label: 'Text Messages' },
    { value: 'image', label: 'Images' },
    { value: 'file', label: 'Files' },
    { value: 'medical', label: 'Medical Data' },
    { value: 'me', label: 'My Messages' },
    { value: 'others', label: 'Others' }
  ]

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    
    try {
      const response = await fetch('/api/messages/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          roomId,
          messageType: selectedFilter !== 'all' ? selectedFilter : undefined
        })
      })

      if (response.ok) {
        const results = await response.json()
        setSearchResults(results)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleClear = () => {
    setSearchQuery('')
    setSearchResults([])
  }

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter)
    if (searchQuery.trim()) {
      handleSearch(searchQuery)
    }
  }

  const handleMessageClick = (message: Message) => {
    onMessageClick(message)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={cn('fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50', className)}>
      <Card className="w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Search Messages</h3>
            {roomId && (
              <p className="text-sm text-gray-600">in {roomId}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </div>

        {/* Search Controls */}
        <div className="p-4 border-b space-y-4">
          <SearchInput
            placeholder="Search messages..."
            onSearch={handleSearch}
            onClear={handleClear}
            disabled={isSearching}
          />
          
          <div className="flex gap-4">
            <FilterDropdown
              options={filterOptions}
              value={selectedFilter}
              onChange={handleFilterChange}
              placeholder="Filter by type..."
              className="flex-1"
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {isSearching ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Searching...</p>
            </div>
          ) : (
            <MessageSearchResults
              messages={searchResults}
              query={searchQuery}
              onMessageClick={handleMessageClick}
              currentUserId={currentUserId}
            />
          )}
        </div>
      </Card>
    </div>
  )
}
