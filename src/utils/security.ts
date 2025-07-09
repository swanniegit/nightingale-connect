// Security utilities for input sanitization and validation

// XSS Prevention - Basic HTML sanitization
export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// SQL Injection Prevention - Basic pattern detection
export const containsSqlInjection = (input: string): boolean => {
  if (!input) return false;
  
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
    /(\b(OR|AND)\b\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/i,
    /(--|\/\*|\*\/|;)/,
    /(\b(WAITFOR|DELAY)\b)/i,
    /(\b(BENCHMARK|SLEEP)\b)/i,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

// POPIA Compliance - Patient data detection
export const containsPatientData = (input: string): boolean => {
  if (!input) return false;
  
  const patientPatterns = [
    // South African ID numbers (13 digits)
    /\b\d{13}\b/,
    // Medical record numbers (common patterns)
    /\b(MR|MRN|PAT)\d{6,}\b/i,
    // Patient names with titles
    /\b(Patient|Pt|Mr|Mrs|Ms|Dr)\s+[A-Z][a-z]+\s+[A-Z][a-z]+\b/i,
    // Medical conditions (basic detection)
    /\b(diagnosis|diagnosed|condition|treatment|medication|prescription)\b/i,
    // Hospital/clinic names
    /\b(hospital|clinic|medical|healthcare|ward|room)\b/i,
  ];
  
  return patientPatterns.some(pattern => pattern.test(input));
};

// Input validation for sensitive fields
export const validateSensitiveInput = (input: string, fieldType: 'name' | 'email' | 'text' | 'number'): {
  isValid: boolean;
  sanitized: string;
  warnings: string[];
} => {
  const warnings: string[] = [];
  let sanitized = input;

  // Basic sanitization
  sanitized = sanitizeHtml(sanitized);

  // Check for SQL injection
  if (containsSqlInjection(input)) {
    warnings.push('Input contains potentially dangerous patterns');
  }

  // Check for patient data (POPIA compliance)
  if (containsPatientData(input)) {
    warnings.push('Input may contain patient data - ensure POPIA compliance');
  }

  // Field-specific validation
  switch (fieldType) {
    case 'name':
      if (!/^[a-zA-Z\s\-']{2,50}$/.test(sanitized)) {
        warnings.push('Name should only contain letters, spaces, hyphens, and apostrophes (2-50 characters)');
      }
      break;
    
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized)) {
        warnings.push('Please enter a valid email address');
      }
      break;
    
    case 'number':
      if (!/^\d+$/.test(sanitized)) {
        warnings.push('Please enter only numbers');
      }
      break;
    
    case 'text':
      if (sanitized.length > 1000) {
        warnings.push('Text is too long (maximum 1000 characters)');
      }
      break;
  }

  return {
    isValid: warnings.length === 0,
    sanitized,
    warnings,
  };
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isStrong: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return { isStrong: false, score: 0, feedback: ['Password is required'] };
  }

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password should contain at least one uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password should contain at least one lowercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password should contain at least one number');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password should contain at least one special character');
  }

  // Common password check
  const commonPasswords = [
    'password', '123456', 'qwerty', 'admin', 'letmein',
    'welcome', 'monkey', 'password123', '123456789'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    score -= 2;
    feedback.push('Password is too common - choose a more unique password');
  }

  const isStrong = score >= 4;

  if (isStrong && feedback.length === 0) {
    feedback.push('Password is strong!');
  }

  return {
    isStrong,
    score,
    feedback,
  };
};

// Rate limiting simulation (for client-side)
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  getRemainingAttempts(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt) return this.maxAttempts;
    
    const now = Date.now();
    if (now > attempt.resetTime) return this.maxAttempts;
    
    return Math.max(0, this.maxAttempts - attempt.count);
  }

  getResetTime(key: string): number | null {
    const attempt = this.attempts.get(key);
    if (!attempt) return null;
    
    const now = Date.now();
    if (now > attempt.resetTime) return null;
    
    return attempt.resetTime;
  }
}

// CSRF token generation (client-side simulation)
export const generateCsrfToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Secure storage utilities
export const secureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      // In a real application, you might encrypt this
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to store item securely:', error);
    }
  },

  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Failed to retrieve item:', error);
      return null;
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },
}; 