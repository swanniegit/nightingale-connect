# Nightingale Connect Backend

> Backend API for Nightingale Connect - Professional network for South African Nurse Practitioners

A secure, scalable Node.js/Express backend with PostgreSQL database, real-time WebSocket support, and AI integration for the Nightingale Connect platform.

## 🚀 Features

### Core API
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **User Management**: Complete user CRUD operations with validation
- **Questions & Answers**: Professional Q&A platform with voting system
- **Real-time Chat**: WebSocket-based messaging system
- **File Upload**: Secure document and image sharing
- **AI Assistant**: OpenAI GPT-4 integration for wound care assistance
- **Notifications**: Real-time notification system

### Security
- **Input Validation**: Comprehensive validation with express-validator
- **XSS Protection**: HTML sanitization and content security
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM
- **Rate Limiting**: Request rate limiting for API protection
- **CORS Configuration**: Secure cross-origin resource sharing
- **Helmet Security**: Security headers and CSP configuration

### Database
- **PostgreSQL**: Primary database with Neon Database integration
- **Drizzle ORM**: Type-safe database queries and migrations
- **Connection Pooling**: Optimized database connections
- **Migrations**: Automated database schema management

## 🛠 Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18.2
- **Database**: PostgreSQL 14+ with Drizzle ORM
- **Authentication**: JWT with bcryptjs
- **Validation**: express-validator
- **Logging**: Winston
- **Real-time**: WebSocket (ws)
- **File Upload**: Multer with Sharp
- **AI Integration**: OpenAI GPT-4
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # Database connection and setup
│   │   └── ...
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # Authentication middleware
│   │   ├── errorHandler.js # Error handling
│   │   └── ...
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication routes
│   │   ├── users.js      # User management
│   │   ├── questions.js  # Q&A platform
│   │   ├── ai.js         # AI assistant
│   │   ├── upload.js     # File upload
│   │   └── notifications.js # Notifications
│   ├── schema/           # Database schema
│   │   └── index.js      # Drizzle ORM schema
│   ├── utils/            # Utility functions
│   │   ├── logger.js     # Winston logger
│   │   ├── security.js   # Security utilities
│   │   └── ...
│   ├── websocket/        # WebSocket server
│   │   └── server.js     # Real-time communication
│   └── server.js         # Main server file
├── logs/                 # Application logs
├── uploads/              # Uploaded files
├── drizzle/              # Database migrations
├── tests/                # Test files
├── package.json          # Dependencies and scripts
└── .env.example          # Environment variables template
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+ database
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/swanniegit/nightingale-connect.git
   cd nightingale-connect/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # Database Configuration
   DATABASE_URL=postgresql://user:password@localhost:5432/nightingale_connect
   DB_USER=postgres
   DB_PASSWORD=password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=nightingale_connect
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   
   # OpenAI Configuration
   OPENAI_API_KEY=your-openai-api-key
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000
   
   # File Upload Configuration
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

4. **Set up database**
   ```bash
   # Create database
   createdb nightingale_connect
   
   # Run migrations
   npm run db:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Test the API**
   ```bash
   # Health check
   curl http://localhost:3001/health
   
   # Test registration
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123",
       "firstName": "John",
       "lastName": "Doe",
       "professionalNumber": "SANC12345",
       "specialty": "Primary Care",
       "province": "Gauteng",
       "institution": "University of Cape Town",
       "qualifications": "Bachelor of Nursing Science"
     }'
   ```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "professionalNumber": "SANC12345",
  "specialty": "Primary Care",
  "province": "Gauteng",
  "institution": "University of Cape Town",
  "qualifications": "Bachelor of Nursing Science",
  "bio": "Optional bio"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "professionalNumber": "SANC12345",
      "specialty": "Primary Care",
      "province": "Gauteng",
      "institution": "University of Cape Town",
      "qualifications": "Bachelor of Nursing Science",
      "isVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/api/auth/login`
Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "professionalNumber": "SANC12345",
      "specialty": "Primary Care",
      "province": "Gauteng",
      "institution": "University of Cape Town",
      "qualifications": "Bachelor of Nursing Science",
      "isVerified": false,
      "lastLogin": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET `/api/auth/user`
Get current user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "professionalNumber": "SANC12345",
      "specialty": "Primary Care",
      "province": "Gauteng",
      "institution": "University of Cape Town",
      "qualifications": "Bachelor of Nursing Science",
      "isVerified": false,
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Questions Endpoints

#### GET `/api/questions`
Get questions with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search in title and content
- `specialty` (string): Filter by specialty
- `province` (string): Filter by province

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "title": "Wound Care Best Practices",
        "content": "What are the current best practices for...",
        "author": {
          "id": 1,
          "firstName": "John",
          "lastName": "Doe",
          "specialty": "Primary Care"
        },
        "specialty": "Primary Care",
        "province": "Gauteng",
        "tags": ["wound-care", "best-practices"],
        "votes": 5,
        "responseCount": 3,
        "isResolved": false,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### POST `/api/questions`
Create a new question.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Wound Care Best Practices",
  "content": "What are the current best practices for treating diabetic foot ulcers?",
  "tags": ["wound-care", "diabetic", "foot-ulcers"],
  "isAnonymous": false
}
```

### AI Assistant Endpoints

#### POST `/api/ai/wound-care`
Query the AI wound care assistant.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "query": "What are the signs of infection in a surgical wound?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "The signs of infection in a surgical wound include...",
    "usage": 150
  }
}
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Individual function and middleware tests
- **Integration Tests**: API endpoint tests
- **Database Tests**: Database operations and migrations
- **Security Tests**: Authentication and authorization

## 🔧 Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run db:migrate # Run database migrations
npm run db:generate # Generate new migration
npm run db:studio  # Open Drizzle Studio
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint errors
npm run format     # Format code with Prettier
```

### Database Management
```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Logging
The application uses Winston for structured logging:

- **Console**: Colored logs for development
- **Files**: JSON logs for production
- **Levels**: error, warn, info, http, debug
- **Rotation**: Automatic log rotation (5MB files, 5 files max)

## 🔒 Security Features

### Input Validation
- **Email validation**: Format and normalization
- **Password validation**: Minimum length and complexity
- **Name validation**: Character restrictions and length limits
- **Professional number validation**: Format and uniqueness checks

### Authentication
- **JWT tokens**: Secure token-based authentication
- **Password hashing**: bcrypt with 12 salt rounds
- **Token expiration**: 7-day token lifetime
- **Account status**: Active/inactive user management

### Rate Limiting
- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **File uploads**: 10 requests per 15 minutes

### Data Protection
- **Input sanitization**: HTML and SQL injection prevention
- **CORS configuration**: Secure cross-origin requests
- **Security headers**: Helmet configuration
- **Error handling**: No sensitive data leakage

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-super-secret-production-key
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=https://nightingale-connect.co.za
MAX_FILE_SIZE=10485760
```

### Deployment Platforms
- **Heroku**: Easy deployment with PostgreSQL add-on
- **Railway**: Simple deployment with automatic scaling
- **DigitalOcean**: App Platform with managed database
- **AWS**: EC2 with RDS PostgreSQL
- **Vercel**: Serverless functions (limited)

### Database Setup
1. **Create PostgreSQL database**
2. **Set up connection pooling**
3. **Run migrations**: `npm run db:migrate`
4. **Seed initial data** (if needed)

### Monitoring
- **Health checks**: `/health` endpoint
- **Logging**: Winston structured logging
- **Error tracking**: Comprehensive error handling
- **Performance**: Response time monitoring

## 📊 Performance

### Optimization Strategies
- **Connection pooling**: Database connection management
- **Compression**: Response compression with gzip
- **Caching**: Redis caching (future implementation)
- **CDN**: Static file serving
- **Rate limiting**: API protection

### Monitoring Metrics
- **Response times**: Average and percentile tracking
- **Error rates**: 4xx and 5xx error monitoring
- **Database performance**: Query execution times
- **Memory usage**: Application memory consumption
- **CPU usage**: Server resource utilization

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run linting and tests
5. Submit a pull request

### Code Standards
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **TypeScript**: Type safety (future migration)
- **Testing**: Comprehensive test coverage
- **Documentation**: API documentation updates

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- **Express.js**: Web application framework
- **Drizzle ORM**: Type-safe database queries
- **OpenAI**: AI-powered assistance
- **PostgreSQL**: Reliable database system
- **Winston**: Structured logging

---

**Built with ❤️ for South African healthcare professionals** 