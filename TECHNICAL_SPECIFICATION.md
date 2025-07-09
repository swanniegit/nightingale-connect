# Nightingale Connect - Technical Specification

## 1. System Architecture

### 1.1 High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express.js API │    │   PostgreSQL    │
│  (Vite + TS)    │◄──►│   (Node.js)     │◄──►│  (Neon DB)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌─────────┐              ┌─────────┐             ┌─────────┐
    │WebSocket│              │OpenAI   │             │Stripe   │
    │Real-time│              │GPT-4    │             │Payment  │
    │Chat     │              │API      │             │API      │
    └─────────┘              └─────────┘             └─────────┘
```

### 1.2 Technology Stack

#### Frontend
- **Framework**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 5.1.4 (HMR, optimized builds)
- **UI Library**: Tailwind CSS 3.4.1 + shadcn/ui components
- **State Management**: TanStack Query v5 (server state)
- **Routing**: Wouter 3.0.0 (lightweight client-side routing)
- **Real-time**: Native WebSocket API
- **Forms**: React Hook Form with Zod validation

#### Backend
- **Runtime**: Node.js 18+ with Express.js 4.18.2
- **Database**: PostgreSQL 14+ via Neon Database (serverless)
- **ORM**: Drizzle ORM 0.29.3 with TypeScript support
- **WebSocket**: ws library 8.16.0
- **File Upload**: Multer 1.4.5 (10MB limit)
- **Authentication**: Passport.js with custom OAuth strategy
- **Session**: express-session with PostgreSQL storage

#### External Services
- **AI**: OpenAI GPT-4 API (wound care assistant)
- **Payment**: Stripe API (subscription management)
- **Authentication**: Replit OAuth integration
- **Database**: Neon Database (serverless PostgreSQL)

## 2. Database Schema

### 2.1 Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'nurse',
    location VARCHAR(255),
    is_approved BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT FALSE,
    subscription_status VARCHAR(20) DEFAULT 'free',
    llm_usage_count INTEGER DEFAULT 0,
    llm_usage_reset_date DATE DEFAULT CURRENT_DATE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Messages Table
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    channel_id INTEGER REFERENCES channels(id),
    user_id VARCHAR(255) REFERENCES users(id),
    content TEXT NOT NULL,
    attachment_url TEXT,
    attachment_filename VARCHAR(255),
    attachment_size INTEGER,
    reply_to_id INTEGER REFERENCES messages(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Channels Table
```sql
CREATE TABLE channels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 Knowledge Management Tables

#### FAQs Table
```sql
CREATE TABLE faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags VARCHAR(255)[],
    created_by VARCHAR(255) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Educational Content Table
```sql
CREATE TABLE educational_content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags VARCHAR(255)[],
    is_featured BOOLEAN DEFAULT FALSE,
    attachment_url TEXT,
    attachment_filename VARCHAR(255),
    created_by VARCHAR(255) REFERENCES users(id),
    original_message_id INTEGER REFERENCES messages(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.3 Administrative Tables

#### Announcements Table
```sql
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    created_by VARCHAR(255) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Notifications Table
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. API Endpoints

### 3.1 Authentication APIs
```
POST   /api/auth/login           - OAuth login initiation
GET    /api/auth/callback        - OAuth callback handler
POST   /api/auth/logout          - User logout
GET    /api/auth/user            - Get current user info
```

### 3.2 Chat APIs
```
GET    /api/channels             - List all channels
GET    /api/channels/:id         - Get channel details
POST   /api/channels             - Create new channel (admin)
GET    /api/channels/:id/messages - Get channel messages
POST   /api/channels/:id/messages - Send message
GET    /api/messages/:id         - Get specific message
POST   /api/upload               - Upload file attachment
```

### 3.3 Knowledge Management APIs
```
GET    /api/faqs                 - List all FAQs
GET    /api/faqs/search          - Search FAQs
POST   /api/faqs                 - Create FAQ (admin)
PUT    /api/faqs/:id             - Update FAQ (admin)
DELETE /api/faqs/:id             - Delete FAQ (admin)

GET    /api/educational-content  - List educational content
GET    /api/educational-content/search - Search content
POST   /api/educational-content  - Create content (admin)
DELETE /api/educational-content/:id - Delete content (admin)
```

### 3.4 AI Assistant APIs
```
POST   /api/ai/wound-care        - Query wound care assistant
GET    /api/ai/usage             - Get user AI usage stats
```

### 3.5 Administrative APIs
```
GET    /api/users                - List all users (admin)
PUT    /api/users/:id/approve    - Approve user (admin)
GET    /api/announcements/active - Get active announcements
POST   /api/announcements        - Create announcement (admin)
GET    /api/notifications        - Get user notifications
PUT    /api/notifications/:id/read - Mark notification as read
```

## 4. WebSocket Implementation

### 4.1 Connection Management
```javascript
// Client-side connection
const ws = new WebSocket(`wss://${window.location.host}/ws`);

// Message types
interface WebSocketMessage {
  type: 'message' | 'user_joined' | 'user_left' | 'notification';
  data: any;
  timestamp: string;
}
```

### 4.2 Real-time Events
- **message**: New chat messages
- **user_joined**: User comes online
- **user_left**: User goes offline
- **notification**: System notifications

## 5. Security Implementation

### 5.1 Authentication Flow
1. User redirected to Replit OAuth
2. OAuth callback creates/updates user record
3. Session stored in PostgreSQL with connect-pg-simple
4. Role-based middleware protects admin routes
5. Admin approval required for platform access

### 5.2 Data Protection
- **HTTPS**: All traffic encrypted in transit
- **WSS**: WebSocket connections secured
- **Input Validation**: Zod schemas validate all inputs
- **SQL Injection**: Drizzle ORM prevents SQL injection
- **XSS Protection**: Content sanitization and CSP headers

### 5.3 POPIA Compliance
- **Detection**: Pattern matching for patient identifiers
- **Warnings**: Automatic compliance reminders
- **Audit**: All administrative actions logged
- **Consent**: Clear terms for data processing

## 6. AI Integration

### 6.1 Wound Care Assistant
```javascript
// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Wound care specific prompt
const systemPrompt = `You are a specialized wound care assistant for 
South African nurse practitioners. Provide evidence-based guidance on 
wound healing, dressing selection, and infection prevention. Always 
include medical disclaimers and avoid diagnosis.`;

// Request parameters
{
  model: "gpt-4-turbo",
  messages: [...],
  temperature: 0.5,
  max_tokens: 400
}
```

### 6.2 Usage Tracking
- **Free Tier**: 10 queries per month
- **Premium Tier**: Unlimited (R50/month)
- **Reset**: Usage counter resets monthly
- **Billing**: Stripe integration for subscriptions

## 7. File Management

### 7.1 Upload Configuration
```javascript
const upload = multer({
  storage: memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname));
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
```

### 7.2 File Processing
- **Validation**: File type and size checking
- **Storage**: In-memory processing, metadata in database
- **Association**: Link files to messages or educational content
- **Auto-categorization**: Admin uploads become educational content

## 8. Performance Optimization

### 8.1 Frontend Optimization
- **Code Splitting**: Route-based lazy loading
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image compression and lazy loading
- **Caching**: Browser caching with proper headers

### 8.2 Backend Optimization
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connections
- **Compression**: Gzip compression for API responses
- **Rate Limiting**: Prevent abuse and ensure fair usage

### 8.3 Real-time Optimization
- **Message Batching**: Reduce WebSocket overhead
- **Connection Management**: Efficient user presence tracking
- **Memory Management**: Proper cleanup of disconnected clients

## 9. Deployment Architecture

### 9.1 Development Environment
```bash
# Start development server
npm run dev

# Database operations
npm run db:push    # Push schema changes
npm run db:studio  # Database GUI

# Build for production
npm run build
```

### 9.2 Production Deployment
- **Replit Deployment**: Automatic deployment from repository
- **Environment Variables**: Secure secret management
- **Health Checks**: Automated monitoring and alerts
- **Scaling**: Horizontal scaling based on demand

### 9.3 Monitoring & Logging
- **Application Logs**: Structured logging with timestamps
- **Error Tracking**: Comprehensive error reporting
- **Performance Metrics**: Response times and throughput
- **Health Monitoring**: System status and alerts

## 10. Testing Strategy

### 10.1 Unit Testing
- **Components**: React Testing Library
- **API Endpoints**: Jest with supertest
- **Database**: Mock database operations
- **Utilities**: Pure function testing

### 10.2 Integration Testing
- **API Integration**: End-to-end API testing
- **Database Integration**: Real database operations
- **WebSocket Testing**: Real-time functionality
- **Payment Integration**: Stripe webhook testing

### 10.3 Quality Assurance
- **TypeScript**: Compile-time type checking
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting standards
- **Security Scanning**: Vulnerability detection

## 11. Scalability Considerations

### 11.1 Horizontal Scaling
- **Load Balancing**: Multiple server instances
- **Database Sharding**: Partition large datasets
- **CDN**: Static asset distribution
- **Caching**: Redis for session and data caching

### 11.2 Vertical Scaling
- **Database Optimization**: Query optimization and indexing
- **Memory Management**: Efficient resource utilization
- **CPU Optimization**: Algorithm efficiency
- **Storage Optimization**: Database and file storage

---

*This technical specification provides the foundation for maintaining and scaling the Nightingale Connect platform. All implementations follow industry best practices for security, performance, and maintainability.*