// API service layer for backend integration

import { User, Question, AuthForm, CredentialsForm } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API client configuration
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        ...options,
      };

      // Add authentication token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication endpoints
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: AuthForm & CredentialsForm): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request(API_ENDPOINTS.auth.register, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request(API_ENDPOINTS.auth.logout, {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request(API_ENDPOINTS.auth.user);
  }

  // Questions endpoints
  async getQuestions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    specialty?: string;
    province?: string;
  }): Promise<ApiResponse<PaginatedResponse<Question>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.specialty) searchParams.append('specialty', params.specialty);
    if (params?.province) searchParams.append('province', params.province);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.questions.list}?${queryString}` : API_ENDPOINTS.questions.list;
    
    return this.request(endpoint);
  }

  async getQuestion(id: number): Promise<ApiResponse<Question>> {
    return this.request(API_ENDPOINTS.questions.detail(id));
  }

  async createQuestion(questionData: {
    title: string;
    content: string;
    tags: string[];
  }): Promise<ApiResponse<Question>> {
    return this.request(API_ENDPOINTS.questions.create, {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  }

  async updateQuestion(id: number, questionData: Partial<Question>): Promise<ApiResponse<Question>> {
    return this.request(API_ENDPOINTS.questions.detail(id), {
      method: 'PUT',
      body: JSON.stringify(questionData),
    });
  }

  async deleteQuestion(id: number): Promise<ApiResponse<void>> {
    return this.request(API_ENDPOINTS.questions.detail(id), {
      method: 'DELETE',
    });
  }

  // Users endpoints
  async getUsers(params?: {
    page?: number;
    limit?: number;
    specialty?: string;
    province?: string;
  }): Promise<ApiResponse<PaginatedResponse<User>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.specialty) searchParams.append('specialty', params.specialty);
    if (params?.province) searchParams.append('province', params.province);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.users.list}?${queryString}` : API_ENDPOINTS.users.list;
    
    return this.request(endpoint);
  }

  async getUserProfile(id: string): Promise<ApiResponse<User>> {
    return this.request(API_ENDPOINTS.users.profile(id));
  }

  async updateUserProfile(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request(API_ENDPOINTS.users.profile(id), {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // File upload endpoint
  async uploadFile(file: File, type: 'question' | 'profile' | 'document'): Promise<ApiResponse<{ url: string; filename: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/api/upload', {
      method: 'POST',
      headers: {
        // Remove Content-Type to let browser set it with boundary
      },
      body: formData,
    });
  }

  // AI Assistant endpoint
  async queryWoundCareAssistant(query: string): Promise<ApiResponse<{ response: string; usage: number }>> {
    return this.request('/api/ai/wound-care', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  // Notifications endpoint
  async getNotifications(): Promise<ApiResponse<Array<{
    id: number;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
  }>>> {
    return this.request('/api/notifications');
  }

  async markNotificationAsRead(id: number): Promise<ApiResponse<void>> {
    return this.request(`/api/notifications/${id}/read`, {
      method: 'PUT',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Convenience functions for common operations
export const api = {
  // Authentication
  login: (credentials: { email: string; password: string }) => apiClient.login(credentials),
  register: (userData: AuthForm & CredentialsForm) => apiClient.register(userData),
  logout: () => apiClient.logout(),
  getCurrentUser: () => apiClient.getCurrentUser(),

  // Questions
  getQuestions: (params?: Parameters<typeof apiClient.getQuestions>[0]) => apiClient.getQuestions(params),
  getQuestion: (id: number) => apiClient.getQuestion(id),
  createQuestion: (questionData: Parameters<typeof apiClient.createQuestion>[0]) => apiClient.createQuestion(questionData),
  updateQuestion: (id: number, questionData: Parameters<typeof apiClient.updateQuestion>[1]) => apiClient.updateQuestion(id, questionData),
  deleteQuestion: (id: number) => apiClient.deleteQuestion(id),

  // Users
  getUsers: (params?: Parameters<typeof apiClient.getUsers>[0]) => apiClient.getUsers(params),
  getUserProfile: (id: string) => apiClient.getUserProfile(id),
  updateUserProfile: (id: string, userData: Parameters<typeof apiClient.updateUserProfile>[1]) => apiClient.updateUserProfile(id, userData),

  // Files
  uploadFile: (file: File, type: Parameters<typeof apiClient.uploadFile>[1]) => apiClient.uploadFile(file, type),

  // AI
  queryWoundCareAssistant: (query: string) => apiClient.queryWoundCareAssistant(query),

  // Notifications
  getNotifications: () => apiClient.getNotifications(),
  markNotificationAsRead: (id: number) => apiClient.markNotificationAsRead(id),
}; 