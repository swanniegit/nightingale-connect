import { apiClient } from '../api-client'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared
interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  name: string
}

export class AuthAPI {
  static async login(credentials: LoginData) {
    return apiClient.post<{ user: User; token: string }>('/auth/login', credentials)
  }

  static async register(userData: RegisterData) {
    return apiClient.post<{ user: User; token: string }>('/auth/register', userData)
  }

  static async logout() {
    return apiClient.post('/auth/logout', {})
  }

  static async getProfile() {
    return apiClient.get<User>('/auth/profile')
  }
}
