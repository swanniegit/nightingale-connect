import { apiClient } from '../api-client'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared
interface Room {
  id: string
  name: string
  description?: string
  createdAt: string
}

export class RoomsAPI {
  static async getAll() {
    return apiClient.get<Room[]>('/rooms')
  }

  static async getById(id: string) {
    return apiClient.get<Room>(`/rooms/${id}`)
  }

  static async create(room: Omit<Room, 'id' | 'createdAt'>) {
    return apiClient.post<Room>('/rooms', room)
  }

  static async update(id: string, updates: Partial<Room>) {
    return apiClient.put<Room>(`/rooms/${id}`, updates)
  }

  static async delete(id: string) {
    return apiClient.delete(`/rooms/${id}`)
  }
}
