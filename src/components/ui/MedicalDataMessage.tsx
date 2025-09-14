'use client'

import { Message } from '@/types'

// CATEGORY: UI Utilities
// CONTEXT: Client

interface MedicalDataMessageProps {
  message: Message
  isOwn: boolean
}

export function MedicalDataMessage({ message, isOwn }: MedicalDataMessageProps) {
  if (!message.medicalData) return null

  const { type, data, priority, patientId } = message.medicalData

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      case 'medium': return 'border-yellow-500 bg-yellow-50'
      case 'low': return 'border-green-500 bg-green-50'
      default: return 'border-gray-500 bg-gray-50'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vital': return '🫀'
      case 'lab': return '🧪'
      case 'diagnosis': return '🩺'
      case 'prescription': return '💊'
      case 'appointment': return '📅'
      default: return '📋'
    }
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${getPriorityColor(priority)}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{getTypeIcon(type)}</span>
        <div>
          <h4 className="font-semibold capitalize">{type} Data</h4>
          {patientId && (
            <p className="text-sm text-gray-600">Patient ID: {patientId}</p>
          )}
        </div>
        <span className={`ml-auto px-2 py-1 rounded text-xs font-medium ${
          priority === 'urgent' ? 'bg-red-100 text-red-800' :
          priority === 'high' ? 'bg-orange-100 text-orange-800' :
          priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {priority.toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-medium capitalize">{key}:</span>
            <span className="text-gray-700">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
