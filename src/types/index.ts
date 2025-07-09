export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'nurse' | 'senior' | 'admin';
  specialty: string;
  province: string;
  location?: string;
  isApproved: boolean;
  isOnline: boolean;
  subscriptionStatus: 'free' | 'premium';
  llmUsageCount: number;
  llmUsageResetDate: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: number;
  title: string;
  content: string;
  author: string;
  specialty: string;
  province: string;
  votes: number;
  responses: number;
  tags: string[];
  timestamp: string;
}

export interface AuthForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CredentialsForm {
  professionalNumber: string;
  qualifications: string;
  institution: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  showAuth: boolean;
  authMode: 'login' | 'register';
  registrationStep: number;
}

export interface NavigationState {
  activeTab: 'dashboard' | 'questions' | 'network' | 'knowledge';
  mobileMenuOpen: boolean;
}

export interface DashboardStats {
  activeQuestions: number;
  totalResponses: number;
  totalVotes: number;
  specialties: number;
  verifiedNPs: number;
  knowledgeBase: number;
  ruralConnections: number;
} 