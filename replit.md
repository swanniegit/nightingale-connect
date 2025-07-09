# Nightingale Connect - Real-time Healthcare Professional Communication Platform

## Overview

Nightingale Connect is a comprehensive chat application specifically designed for South African nurse practitioners. The platform facilitates real-time communication, AI-powered assistance, and access to medical resources including FAQs and educational content. The application combines modern web technologies with healthcare-specific features to support professional collaboration and knowledge sharing.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Communication**: WebSocket integration for live chat functionality

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Real-time**: WebSocket server using 'ws' library
- **File Handling**: Multer for file upload management
- **AI Integration**: OpenAI API for intelligent message analysis and suggestions

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon (serverless)
- **ORM**: Drizzle ORM with TypeScript support
- **Schema Management**: Drizzle Kit for migrations and schema updates
- **Session Storage**: PostgreSQL with connect-pg-simple for session management

## Key Components

### Database Schema
The application uses a well-structured PostgreSQL schema with the following main entities:

1. **Users Table**: Stores user profiles with roles (nurse, senior, admin) and online status
2. **Channels Table**: Manages chat channels with privacy settings
3. **Messages Table**: Stores chat messages with attachment support
4. **AI Suggestions Table**: Tracks AI-generated suggestions and validation status
5. **FAQs Table**: Categorized frequently asked questions with tagging
6. **Educational Content Table**: Learning materials and resources

### Real-time Communication
- WebSocket-based chat system supporting multiple channels
- User presence tracking (online/offline status)
- Message broadcasting to channel participants
- File attachment support with size limits (10MB)

### AI-Powered Features
- Automatic message analysis using OpenAI API
- Context-aware suggestions based on FAQ and educational content
- Validation system for AI suggestions by senior users
- Smart content recommendations

### UI Components
- Comprehensive component library using shadcn/ui
- Responsive design with mobile-first approach
- Accessibility features built into all components
- Custom healthcare-themed styling

## Data Flow

### Message Processing Flow
1. User sends message through WebSocket connection
2. Message is stored in PostgreSQL database
3. AI service analyzes message content for relevance
4. If relevant, AI generates suggestions with FAQ/educational references
5. Suggestions are stored and broadcast to appropriate users
6. Senior users can validate AI suggestions for future use

### Authentication Flow
- Session-based authentication using PostgreSQL storage
- Role-based access control (nurse, senior, admin)
- User presence tracking for real-time features

### File Upload Flow
- Files uploaded through REST API with Multer
- Size validation (10MB limit)
- Metadata stored in message attachments
- Files associated with chat messages

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **openai**: Official OpenAI API client
- **ws**: WebSocket library for real-time communication
- **express**: Web application framework
- **multer**: File upload middleware

### Frontend Dependencies
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **date-fns**: Date manipulation library
- **wouter**: Lightweight routing library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and development
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler

## Deployment Strategy

### Development Environment
- Uses Vite development server with HMR
- TypeScript checking and compilation
- Replit-specific development tools and overlays

### Production Build
- Vite builds optimized frontend bundle
- esbuild compiles server code to ESM format
- Static assets served from Express server
- Database migrations handled by Drizzle Kit

### Environment Configuration
- DATABASE_URL for PostgreSQL connection
- OPENAI_API_KEY for AI services
- NODE_ENV for environment-specific behavior
- Replit-specific environment variables

### Build Process
1. Frontend: `vite build` creates optimized client bundle
2. Backend: `esbuild` compiles server TypeScript to JavaScript
3. Database: `drizzle-kit push` applies schema changes
4. Production: Single Node.js process serves both API and static files

## User Preferences

Preferred communication style: Simple, everyday language.

## Enhanced Features

### Authentication & Authorization
- **Replit OAuth Integration**: Seamless authentication using Replit OAuth provider
- **Role-based Access Control**: Three user roles (nurse, senior, admin) with specific permissions
- **Admin Approval Workflow**: New user registrations require admin approval before platform access
- **Session Management**: Secure session handling with PostgreSQL-based storage

### AI-Powered Features
- **Intelligent Message Analysis**: AI monitors chat messages for medical relevance
- **Context-Aware Suggestions**: AI provides responses based on FAQ and educational content
- **Senior Validation System**: Senior practitioners validate AI suggestions for future use
- **Automated Content Classification**: Messages analyzed for patient data sensitivity

### Patient Data Protection
- **Automatic Detection**: System identifies potential patient information in messages
- **Approval Workflow**: Messages with patient data require admin/senior approval
- **Image Analysis**: Basic screening for medical images requiring consent
- **Privacy Safeguards**: Built-in protections for sensitive medical information

### Location-Based Networking
- **Geographic Connections**: Users can connect based on their location in South Africa
- **Regional Channels**: Location-specific chat channels for regional discussions
- **Proximity Features**: Find and connect with nearby healthcare professionals

### Notification System
- **Real-time Alerts**: Instant notifications for important events
- **Registration Notifications**: Admins notified of new user registrations
- **Message Approval Alerts**: Notifications for pending message approvals
- **Customizable Notifications**: Different types based on user actions

### Document Management
- **Automatic Organization**: Chat attachments automatically moved to education section
- **Link Preservation**: Original chat context maintained with direct links
- **Educational Content Creation**: Documents become searchable educational resources
- **Version Control**: Track document changes and updates

### Enhanced Security
- **Multi-layer Authentication**: Combined OAuth and internal approval system
- **Data Encryption**: Secure handling of all user data and communications
- **Audit Trails**: Complete logging of admin actions and approvals
- **Access Controls**: Fine-grained permissions for different user roles

## Changelog

Changelog:
- July 07, 2025. Initial setup and comprehensive feature implementation
  - Added Replit OAuth authentication system
  - Implemented role-based access control (nurse, senior, admin)
  - Created admin approval workflow for new registrations
  - Built AI-powered message analysis and suggestion system
  - Added patient data protection with automatic detection
  - Implemented location-based networking features
  - Created comprehensive notification system
  - Added document management with automatic organization
  - Enhanced security with multi-layer authentication
  - Integrated real-time WebSocket communication with approval workflows
- July 07, 2025. Fixed WebSocket configuration issue
  - Resolved database connection error by properly configuring WebSocket constructor for Neon database
  - Fixed server startup crashes and WebSocket connection conflicts
  - Application now runs successfully with all features working
- July 07, 2025. Fixed FAQ filtering and AI suggestion linking
  - Implemented real-time search filtering in FAQ modal
  - Added category filter buttons for easy topic-based filtering
  - Fixed AI suggestion links to properly highlight specific FAQs when clicked
  - Added visual indicators when viewing FAQs from AI suggestions
  - FAQ modal now clears filters and auto-scrolls to highlighted questions
- July 07, 2025. Added AI suggestion management system for admins
  - Implemented "Approve, Edit, Reject" workflow for AI suggestions
  - Changed access from senior users to admin users only
  - Added automatic FAQ creation when suggestions are approved
  - Implemented suggestion editing with visual indicators
  - Added rejection system with reason tracking
  - Enhanced chat auto-scroll for new messages and AI suggestions
  - Updated database schema to support suggestion status tracking
- July 07, 2025. Added message reply functionality
  - Implemented reply-to-message feature with visual indicators
  - Messages now display oldest first with newest at bottom (WhatsApp style)
  - Added reply preview in message input area
  - Enhanced database schema to support message replies
  - Added API endpoints for fetching individual messages
  - Reply context shows truncated original message content
  - Auto-scroll keeps latest messages and AI suggestions visible
- July 07, 2025. Enhanced document management for admins
  - Documents uploaded by admins are automatically moved to Educational Resources
  - Smart categorization based on filename (guidelines, procedures, policies, etc.)
  - Admin uploads are marked as featured content for visibility
  - Automatic notifications when documents are moved to educational section
  - Other admins notified about new educational content additions
  - Enhanced metadata tracking with original message context
- July 07, 2025. Added purple color theme for reply messages
  - Reply messages now display in purple tones for better visual distinction
  - User's replies show dark purple background with white text
  - Others' replies show light purple background with dark purple text
  - Attachments in replies use purple-themed icons and borders
  - Reply previews use purple styling for consistency
  - Successfully tested and confirmed working by user
- July 07, 2025. Enhanced admin functionality and fixed navigation
  - Fixed header navigation using Link component with href="/" (working solution)
  - Added FAQ answer editing for admins with inline edit mode
  - Implemented blog post creation with custom category support
  - Removed view option for attachments, kept download functionality only
  - Added green color theme for messages with attachments
  - Fixed API request format issues for FAQ editing and blog creation
  - Changed "Custom Category" to "Add a new category" for better UX
- July 07, 2025. Implemented comprehensive announcement system and admin dashboard
  - Added delete functionality for both FAQ items and educational content
  - Fixed educational content delete button to appear on both expanded and collapsed states
  - Implemented announcement system with date-based display (from/to dates)
  - Created admin-only announcement creation with red styling for importance
  - Added announcement banner that shows once per day to users
  - Enhanced admin home page with professional dashboard layout
  - Non-admin users automatically redirect to chat page
  - Added database schema for announcements and user view tracking
- July 07, 2025. Fixed authentication flow and enabled auto-approval for testing
  - Fixed logout flow - users now see landing page with login option after signout
  - Temporarily enabled auto-approval for all new user registrations
  - Updated authentication routing to properly handle signed-out state
  - New users can now sign up with any valid Replit account and get immediate access
  - Announcement system tested and confirmed working successfully
- July 07, 2025. Fixed admin dashboard content management routing
  - Updated "Manage Content" button to open Educational modal directly
  - Removed unnecessary content management page redirect
  - Streamlined admin workflow for content editing and blog creation
- July 07, 2025. Added dedicated FAQ Management section to admin dashboard
  - Created separate FAQ Management section with HelpCircle icon
  - Distinguished Educational Content and FAQ Management as separate admin functions
  - Both sections now open their respective modals directly from dashboard
  - Improved admin workflow with clear separation of content management tasks
  - User confirmed announcement system working and tested all admin features successfully
- July 07, 2025. Implemented dual AI suggestion system with real LLM responses
  - Added OpenAI GPT-4 integration alongside existing local suggestions
  - Enhanced database schema with suggestionType field (local/llm)
  - Created visual distinction: local suggestions (yellow/Bot), LLM responses (purple/Brain)
  - Both suggestion types use same admin approval workflow for quality control
  - Local suggestions provide fast FAQ-based responses, LLM gives comprehensive healthcare guidance
  - Enhanced notification system with real-time WebSocket broadcasting and browser notifications
  - Added notification permission request for desktop alerts
  - Platform now provides dual-layer AI assistance with professional oversight
- July 07, 2025. Simplified AI system and implemented subscription model
  - Removed admin approval workflow and upvote system for AI suggestions
  - Made AI responses private - only visible to the user who asked the question
  - Added subscription model with 10 free LLM responses per month, then R 50/month premium
  - Created comprehensive subscription page with ZAR pricing for South African market
  - Added AI disclaimer warning about accuracy and session persistence
  - Streamlined AI suggestion interface focusing on helpful responses without complex workflows
- July 07, 2025. Implemented POPIA compliance system without message blocking
  - Removed message approval workflow - all messages now post immediately
  - Added automatic POPIA detection for patient-related content with enhanced misspelling detection
  - Users receive single compliance reminder: "Always ensure you are following POPIA guidelines when discussing a patient"
  - System balances professional communication needs with regulatory awareness
  - Healthcare professionals can discuss cases freely while being reminded of compliance requirements
  - Fixed duplicate notification issues and message display problems
  - Enhanced WebSocket message handling with proper deduplication
  - POPIA detection catches misspellings like "pateint", "diagnosiss", "medicin"
- July 08, 2025. Replaced Q&A system with specialized wound care assistant
  - Implemented GPT-4-turbo powered wound care assistant for South African nurse practitioners
  - Specialized in evidence-based wound healing with direct, concise clinical answers
  - Added proper medical disclaimers and POPIA compliance safeguards
  - Focused on wound care specialty while avoiding diagnosis, mental health, pediatrics, pregnancy, or emergency care
  - Temperature set to 0.5 with 400 token limit for focused, professional responses
  - Maintains all existing chat functionality while providing specialized wound care guidance
- July 08, 2025. Completely removed AI from main chat system
  - Main chat now purely for practitioner-to-practitioner communication
  - Removed all AI analysis, suggestions, and automated responses from messaging
  - Simplified WebSocket handling to only send/receive messages
  - Added wound care AI assistant as separate tab in FAQ modal
  - Wound care chat is ephemeral - conversations not stored in database
  - AI assistant accessible only through FAQ page with clear disclaimers
- July 08, 2025. Rebranded platform to "Nightingale Connect" with new visual identity
  - Updated application name from "NursePrac Connect" to "Nightingale Connect"
  - Integrated new Nightingale logos (circular and full versions) throughout the platform
  - Updated primary color scheme to match brand identity (teal/green theme - hsl(178, 70%, 38%))
  - Updated page titles, meta descriptions, and documentation to reflect new branding
  - Enhanced visual consistency across all components with new color palette
- July 09, 2025. Successfully prepared platform for GitHub export
  - Fixed UI tab overflow issues in FAQ modal with responsive design
  - Resolved git authentication challenges with GitHub integration
  - Platform is production-ready with all features working and professional branding
  - Code successfully exported from Replit for GitHub repository deployment