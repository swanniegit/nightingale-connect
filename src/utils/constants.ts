// Application constants
export const APP_NAME = 'Nightingale Connect';
export const APP_DESCRIPTION = 'Professional network for South African Nurse Practitioners';
export const APP_TAGLINE = 'Stop Searching, Start Finding';

// Colors
export const COLORS = {
  primary: '#12464d',
  primaryDark: '#0f3a40',
  success: '#0f7c3a',
  warning: '#7c2d12',
  danger: '#c2410c',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;

// Navigation tabs
export const NAVIGATION_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'questions', label: 'Questions', icon: '❓' },
  { id: 'network', label: 'Network', icon: '🏥' },
  { id: 'knowledge', label: 'Knowledge Base', icon: '📚' },
] as const;

// Specialties
export const SPECIALTIES = [
  'Primary Care',
  'Rural Health',
  'Pediatric Care',
  'Emergency Care',
  'Mental Health',
  'Endocrinology',
  'Cardiology',
  'Oncology',
] as const;

// Provinces
export const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
] as const;

// Test accounts
export const TEST_ACCOUNTS = [
  {
    email: 'test@nightingale.co.za',
    password: 'demo123',
    name: 'Test User',
  },
  {
    email: 'sarah@nightingale.co.za',
    password: 'rural123',
    name: 'Dr. Sarah Johnson',
  },
] as const;

// Validation rules
export const VALIDATION_RULES = {
  password: {
    minLength: 6,
    maxLength: 128,
  },
  name: {
    minLength: 2,
    maxLength: 50,
  },
  professionalNumber: {
    minLength: 5,
    maxLength: 20,
  },
  institution: {
    minLength: 3,
    maxLength: 100,
  },
} as const;

// File upload limits
export const FILE_LIMITS = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    user: '/api/auth/user',
  },
  questions: {
    list: '/api/questions',
    create: '/api/questions',
    detail: (id: number) => `/api/questions/${id}`,
  },
  users: {
    list: '/api/users',
    profile: (id: string) => `/api/users/${id}`,
  },
} as const; 