// Configuration utility for environment variables

interface Config {
  // API Configuration
  apiUrl: string;
  wsUrl: string;
  
  // Authentication
  authDomain: string;
  authClientId: string;
  authAudience: string;
  
  // OpenAI Configuration
  openaiApiKey: string;
  
  // Stripe Configuration
  stripePublishableKey: string;
  
  // File Upload Configuration
  maxFileSize: number;
  allowedFileTypes: string[];
  
  // Feature Flags
  enableAiAssistant: boolean;
  enableFileUpload: boolean;
  enableNotifications: boolean;
  enableAnalytics: boolean;
  
  // Environment
  environment: 'development' | 'production' | 'test';
  debugMode: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// Default configuration
const defaultConfig: Config = {
  // API Configuration
  apiUrl: 'http://localhost:3001',
  wsUrl: 'ws://localhost:3001',
  
  // Authentication
  authDomain: '',
  authClientId: '',
  authAudience: '',
  
  // OpenAI Configuration
  openaiApiKey: '',
  
  // Stripe Configuration
  stripePublishableKey: '',
  
  // File Upload Configuration
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  
  // Feature Flags
  enableAiAssistant: true,
  enableFileUpload: true,
  enableNotifications: true,
  enableAnalytics: false,
  
  // Environment
  environment: 'development',
  debugMode: true,
  logLevel: 'debug',
};

// Environment-specific configuration
const getEnvironmentConfig = (): Partial<Config> => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return {
        environment: 'production',
        debugMode: false,
        logLevel: 'error',
        enableAnalytics: true,
      };
    
    case 'test':
      return {
        environment: 'test',
        debugMode: true,
        logLevel: 'error',
        enableAiAssistant: false,
        enableFileUpload: false,
        enableNotifications: false,
        enableAnalytics: false,
      };
    
    default:
      return {
        environment: 'development',
        debugMode: true,
        logLevel: 'debug',
      };
  }
};

// Build configuration from environment variables and defaults
export const config: Config = {
  ...defaultConfig,
  ...getEnvironmentConfig(),
  
  // Override with environment variables
  apiUrl: process.env.REACT_APP_API_URL || defaultConfig.apiUrl,
  wsUrl: process.env.REACT_APP_WS_URL || defaultConfig.wsUrl,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN || defaultConfig.authDomain,
  authClientId: process.env.REACT_APP_AUTH_CLIENT_ID || defaultConfig.authClientId,
  authAudience: process.env.REACT_APP_AUTH_AUDIENCE || defaultConfig.authAudience,
  openaiApiKey: process.env.REACT_APP_OPENAI_API_KEY || defaultConfig.openaiApiKey,
  stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || defaultConfig.stripePublishableKey,
  
  // Parse numeric values
  maxFileSize: parseInt(process.env.REACT_APP_MAX_FILE_SIZE || defaultConfig.maxFileSize.toString(), 10),
  
  // Parse boolean values
  enableAiAssistant: process.env.REACT_APP_ENABLE_AI_ASSISTANT !== 'false',
  enableFileUpload: process.env.REACT_APP_ENABLE_FILE_UPLOAD !== 'false',
  enableNotifications: process.env.REACT_APP_ENABLE_NOTIFICATIONS !== 'false',
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  debugMode: process.env.REACT_APP_DEBUG_MODE !== 'false',
  
  // Parse log level
  logLevel: (process.env.REACT_APP_LOG_LEVEL as Config['logLevel']) || defaultConfig.logLevel,
};

// Configuration validation
export const validateConfig = (): string[] => {
  const errors: string[] = [];
  
  if (!config.apiUrl) {
    errors.push('REACT_APP_API_URL is required');
  }
  
  if (config.environment === 'production') {
    if (!config.authDomain) {
      errors.push('REACT_APP_AUTH_DOMAIN is required in production');
    }
    
    if (!config.authClientId) {
      errors.push('REACT_APP_AUTH_CLIENT_ID is required in production');
    }
    
    if (!config.authAudience) {
      errors.push('REACT_APP_AUTH_AUDIENCE is required in production');
    }
  }
  
  if (config.enableAiAssistant && !config.openaiApiKey) {
    errors.push('REACT_APP_OPENAI_API_KEY is required when AI Assistant is enabled');
  }
  
  return errors;
};

// Configuration helpers
export const isDevelopment = (): boolean => config.environment === 'development';
export const isProduction = (): boolean => config.environment === 'production';
export const isTest = (): boolean => config.environment === 'test';

export const canUseFeature = (feature: keyof Pick<Config, 'enableAiAssistant' | 'enableFileUpload' | 'enableNotifications' | 'enableAnalytics'>): boolean => {
  return config[feature];
};

// Logging utility
export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (config.debugMode && config.logLevel === 'debug') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
  
  info: (message: string, ...args: any[]) => {
    if (['debug', 'info'].includes(config.logLevel)) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (['debug', 'info', 'warn'].includes(config.logLevel)) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  
  error: (message: string, ...args: any[]) => {
    if (['debug', 'info', 'warn', 'error'].includes(config.logLevel)) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
}; 