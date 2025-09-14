'use client'

import { useState, useCallback, useMemo } from 'react'
import { Message, SearchFilter } from '@/types'
import { apiClient } from '@/lib/api-client'

// CATEGORY: Data & State Hook
// CONTEXT: Client

interface UseMessageSearchProps {
  roomId?: string
  currentUserId: string
}

export function useMessageSearch({ roomId, currentUserId }: UseMessageSearchProps) {
  const [searchResults, setSearchResults] = useState<Message[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilter>({})
  const [error, setError] = useState<string | null>(null)

  // Search messages
  const searchMessages = useCallback(async (query: string, searchFilters: SearchFilter = {}) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const response = await apiClient.post('/messages/search', {
        query: query.trim(),
        roomId,
        ...searchFilters
      })

      if (response.error) {
        throw new Error(response.error)
      }

      const messages = response.data as Message[]
      setSearchResults(messages)
      setSearchQuery(query)
      setFilters(searchFilters)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [roomId])

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchResults([])
    setSearchQuery('')
    setFilters({})
    setError(null)
  }, [])

  // Filter options for UI
  const filterOptions = useMemo(() => [
    { value: 'all', label: 'All Messages', count: searchResults.length },
    { value: 'text', label: 'Text Messages', count: searchResults.filter(m => m.kind === 'text').length },
    { value: 'image', label: 'Images', count: searchResults.filter(m => m.kind === 'image').length },
    { value: 'file', label: 'Files', count: searchResults.filter(m => m.kind === 'file').length },
    { value: 'medical', label: 'Medical Data', count: searchResults.filter(m => m.kind === 'medical').length },
    { value: 'me', label: 'My Messages', count: searchResults.filter(m => m.senderId === currentUserId).length },
    { value: 'others', label: 'Others', count: searchResults.filter(m => m.senderId !== currentUserId).length }
  ], [searchResults, currentUserId])

  // Apply additional filters to search results
  const applyFilters = useCallback((filterType: string) => {
    if (filterType === 'all') {
      setSearchResults(prev => prev)
      return
    }

    let filtered = searchResults

    switch (filterType) {
      case 'text':
        filtered = searchResults.filter(m => m.kind === 'text')
        break
      case 'image':
        filtered = searchResults.filter(m => m.kind === 'image')
        break
      case 'file':
        filtered = searchResults.filter(m => m.kind === 'file')
        break
      case 'medical':
        filtered = searchResults.filter(m => m.kind === 'medical')
        break
      case 'me':
        filtered = searchResults.filter(m => m.senderId === currentUserId)
        break
      case 'others':
        filtered = searchResults.filter(m => m.senderId !== currentUserId)
        break
    }

    setSearchResults(filtered)
  }, [searchResults, currentUserId])

  // Search with date range
  const searchWithDateRange = useCallback(async (
    query: string, 
    dateFrom?: Date, 
    dateTo?: Date
  ) => {
    const searchFilters: SearchFilter = {
      ...filters,
      dateFrom,
      dateTo
    }

    await searchMessages(query, searchFilters)
  }, [searchMessages, filters])

  // Search with message type
  const searchByType = useCallback(async (query: string, messageType: Message['kind']) => {
    const searchFilters: SearchFilter = {
      ...filters,
      messageType
    }

    await searchMessages(query, searchFilters)
  }, [searchMessages, filters])

  return {
    searchResults,
    isSearching,
    searchQuery,
    filters,
    error,
    filterOptions,
    searchMessages,
    clearSearch,
    applyFilters,
    searchWithDateRange,
    searchByType
  }
}
