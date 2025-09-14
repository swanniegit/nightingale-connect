import { apiClient } from '../api-client'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared
interface Message {
  id: string
  content: string
  roomId: string
  userId: string
  timestamp: string
}

export class MessagesAPI {
  static async getByRoom(roomId: string) {
    return apiClient.get<Message[]>(`/messages/room/${roomId}`)
  }

  static async create(message: Omit<Message, 'id' | 'timestamp'>) {
    return apiClient.post<Message>('/messages', message)
  }

  static async update(id: string, updates: Partial<Message>) {
    return apiClient.put<Message>(`/messages/${id}`, updates)
  }

  static async delete(id: string) {
    return apiClient.delete(`/messages/${id}`)
  }
}
