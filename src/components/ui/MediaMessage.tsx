'use client'

import { Message } from '@/types'
import { useState } from 'react'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface MediaMessageProps {
  message: Message
  isOwn: boolean
}

export function MediaMessage({ message, isOwn }: MediaMessageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  if (!message.media) return null

  const { mime, size, duration, w, h } = message.media
  const isImage = mime?.startsWith('image/')
  const isVideo = mime?.startsWith('video/')
  const isAudio = mime?.startsWith('audio/')

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isImage) {
    return (
      <div className="max-w-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={message.media.url || message.media.blobRef}
          alt="Shared image"
          className="rounded-lg max-w-full h-auto"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
        />
        {isLoading && (
          <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        {hasError && (
          <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg text-gray-500">
            Failed to load image
          </div>
        )}
        {w && h && (
          <p className="text-xs text-gray-500 mt-1">{w} × {h}</p>
        )}
      </div>
    )
  }

  if (isVideo) {
    return (
      <div className="max-w-xs">
        <video
          src={message.media.url || message.media.blobRef}
          controls
          className="rounded-lg max-w-full h-auto"
          onLoadedData={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
        />
        {isLoading && (
          <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        {hasError && (
          <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg text-gray-500">
            Failed to load video
          </div>
        )}
        {duration && (
          <p className="text-xs text-gray-500 mt-1">Duration: {formatDuration(duration)}</p>
        )}
      </div>
    )
  }

  if (isAudio) {
    return (
      <div className="max-w-xs">
        <audio
          src={message.media.url || message.media.blobRef}
          controls
          className="w-full"
          onLoadedData={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
        />
        {isLoading && (
          <div className="flex items-center justify-center h-16 bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
        {hasError && (
          <div className="flex items-center justify-center h-16 bg-gray-100 rounded-lg text-gray-500">
            Failed to load audio
          </div>
        )}
        {duration && (
          <p className="text-xs text-gray-500 mt-1">Duration: {formatDuration(duration)}</p>
        )}
      </div>
    )
  }

  // Generic file
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg max-w-xs">
      <div className="text-2xl">
        {mime?.includes('pdf') ? '📄' :
         mime?.includes('word') ? '📝' :
         mime?.includes('excel') ? '📊' :
         mime?.includes('powerpoint') ? '📊' :
         '📎'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">File Attachment</p>
        {size && (
          <p className="text-xs text-gray-500">{formatFileSize(size)}</p>
        )}
        {mime && (
          <p className="text-xs text-gray-500">{mime}</p>
        )}
      </div>
    </div>
  )
}
