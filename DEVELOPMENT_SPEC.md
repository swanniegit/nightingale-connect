# 🏗️ Nightingale Connect - Development Specification

## 📋 Project Overview

**Nightingale Connect** is a healthcare-focused chat application built with Next.js, Supabase, and IndexedDB for offline-first functionality. The app enables healthcare professionals to communicate securely with real-time messaging, offline support, and media sharing.

## 🎯 Core Architecture

### Tech Stack
- **Frontend**: Next.js (App Router) + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Realtime + Auth)
- **Offline Storage**: IndexedDB (via `idb` library)
- **Service Worker**: Workbox for caching and background sync
- **State Management**: React Query + Custom hooks
- **Real-time**: Supabase Realtime subscriptions

### Key Principles
- **Offline-First**: UI reads from IndexedDB, network acts as sync
- **Local-First State**: Instant hydration from local storage
- **Idempotent Operations**: Client-generated IDs for safe retries
- **Progressive Enhancement**: Works offline, better online

## 🗄️ Database Schema

### IndexedDB Schema (`chatdb@v1`)

#### Stores Structure
```typescript
// rooms: { id, isGroup, title, lastMessageAt }
// members: { roomId, userId, role }
// messages: { id, cid, roomId, senderId, createdAt, status, kind, text?, media?, reactions?, editedAt?, readBy? }
// reads: { roomId, userId, messageId, readAt }
// outbox: { cid, roomId, payload, attempt, nextAttemptAt }
// mediaBlobs: { blobRef, blob }
// keys: { roomId, deviceId, keyMaterial } // For future E2EE
```

#### Message Status Flow
```
local → sending → sent → ack
  ↓       ↓        ↓
failed ← retry → deleted
```

## 🚀 Development Task List

### Phase 1: Foundation Setup (Week 1)

#### 1.1 Project Initialization
- [ ] **Setup Next.js App Router project**
  - [ ] Configure TypeScript
  - [ ] Setup Tailwind CSS
  - [ ] Configure path aliases (`@/` imports)
  - [ ] Setup ESLint + Prettier

#### 1.2 Core Infrastructure
- [ ] **IndexedDB Setup**
  - [ ] Install and configure `idb` library
  - [ ] Create database schema with all stores
  - [ ] Setup database migration system
  - [ ] Create TypeScript types for all entities

- [ ] **Supabase Integration**
  - [ ] Setup Supabase project
  - [ ] Configure authentication
  - [ ] Setup database tables with RLS policies
  - [ ] Configure Realtime subscriptions
  - [ ] Create API client wrapper

#### 1.3 Service Worker Setup
- [ ] **Workbox Configuration**
  - [ ] Install Workbox dependencies
  - [ ] Configure precaching for app shell
  - [ ] Setup runtime caching strategies
  - [ ] Implement background sync for messages
  - [ ] Setup push notification handling

### Phase 2: Core Data Layer (Week 2)

#### 2.1 IndexedDB Operations
- [ ] **Database Operations**
  - [ ] Create CRUD operations for all stores
  - [ ] Implement transaction helpers
  - [ ] Add error handling and retry logic
  - [ ] Create database cleanup utilities

- [ ] **Message Management**
  - [ ] Implement message CRUD operations
  - [ ] Create message status update functions
  - [ ] Add message search and filtering
  - [ ] Implement message pagination

#### 2.2 Data Hooks (Following LEGO BUILDER principles)
- [ ] **Core Hooks**
  - [ ] `useMessages(roomId)` - Message fetching and real-time updates
  - [ ] `useRooms()` - Room list management
  - [ ] `useAuth()` - Authentication state
  - [ ] `useWebSocket()` - Real-time connection management
  - [ ] `useOfflineSync()` - Background sync coordination

- [ ] **Message Hooks**
  - [ ] `useSendMessage()` - Message sending with outbox
  - [ ] `useMessageStatus()` - Message status tracking
  - [ ] `useReadReceipts()` - Read receipt management
  - [ ] `useTypingIndicator()` - Typing status

### Phase 3: UI Components (Week 3)

#### 3.1 UI Utilities (Atomic Components)
- [ ] **Basic Components**
  - [ ] `Button` - Various button variants
  - [ ] `Input` - Text input with validation
  - [ ] `Textarea` - Multi-line text input
  - [ ] `Card` - Container component
  - [ ] `Avatar` - User avatar display
  - [ ] `Badge` - Status indicators
  - [ ] `Spinner` - Loading states

- [ ] **Message Components**
  - [ ] `MessageBubble` - Individual message display
  - [ ] `MessageInput` - Message composition
  - [ ] `MessageList` - Message container
  - [ ] `MessageStatus` - Delivery status indicator
  - [ ] `ReactionPicker` - Emoji reactions
  - [ ] `MediaPreview` - Image/video preview

#### 3.2 Client Orchestrators
- [ ] **Chat Components**
  - [ ] `ChatRoom` - Main chat interface
  - [ ] `ChatSidebar` - Room list sidebar
  - [ ] `MessageComposer` - Message input area
  - [ ] `TypingIndicator` - Live typing display
  - [ ] `ReadReceipts` - Read status display

- [ ] **Room Management**
  - [ ] `RoomList` - List of available rooms
  - [ ] `RoomCard` - Individual room display
  - [ ] `CreateRoom` - Room creation modal
  - [ ] `RoomSettings` - Room configuration

### Phase 4: Real-time Features (Week 4)

#### 4.1 WebSocket Integration
- [ ] **Connection Management**
  - [ ] Implement connection state tracking
  - [ ] Add reconnection logic with exponential backoff
  - [ ] Handle connection quality monitoring
  - [ ] Implement connection recovery

- [ ] **Real-time Subscriptions**
  - [ ] Subscribe to room message updates
  - [ ] Handle typing indicators
  - [ ] Manage read receipts
  - [ ] Process presence updates

#### 4.2 Message Synchronization
- [ ] **Sync Logic**
  - [ ] Implement message deduplication
  - [ ] Handle clock skew correction
  - [ ] Process server-side message updates
  - [ ] Manage conflict resolution

- [ ] **Offline Support**
  - [ ] Queue messages when offline
  - [ ] Sync queued messages when online
  - [ ] Handle sync conflicts
  - [ ] Implement retry mechanisms

### Phase 5: Media Handling (Week 5)

#### 5.1 Media Upload
- [ ] **File Handling**
  - [ ] Implement file selection and preview
  - [ ] Add image compression and resizing
  - [ ] Create video thumbnail generation
  - [ ] Handle file type validation

- [ ] **Storage Management**
  - [ ] Store media blobs in IndexedDB
  - [ ] Implement media cache cleanup
  - [ ] Add storage quota management
  - [ ] Create media compression utilities

#### 5.2 Media Display
- [ ] **Media Components**
  - [ ] `ImageMessage` - Image display component
  - [ ] `VideoMessage` - Video player component
  - [ ] `FileMessage` - File download component
  - [ ] `MediaGallery` - Media collection view

- [ ] **Media Features**
  - [ ] Implement media zoom and pan
  - [ ] Add media download functionality
  - [ ] Create media sharing options
  - [ ] Handle media loading states

### Phase 6: Advanced Features (Week 6)

#### 6.1 Push Notifications
- [ ] **Notification Setup**
  - [ ] Configure push notification service
  - [ ] Implement notification permission handling
  - [ ] Create notification click handlers
  - [ ] Add notification badge management

- [ ] **Background Sync**
  - [ ] Implement background message sync
  - [ ] Add periodic sync for health checks
  - [ ] Handle sync when app is backgrounded
  - [ ] Create sync status indicators

#### 6.2 Performance Optimization
- [ ] **Caching Strategy**
  - [ ] Implement intelligent caching
  - [ ] Add cache invalidation logic
  - [ ] Create cache size management
  - [ ] Optimize bundle size

- [ ] **Performance Monitoring**
  - [ ] Add performance metrics
  - [ ] Implement error tracking
  - [ ] Create user analytics
  - [ ] Monitor offline/online transitions

### Phase 7: Security & Privacy (Week 7)

#### 7.1 Authentication
- [ ] **Auth Implementation**
  - [ ] Setup Supabase authentication
  - [ ] Implement login/logout flows
  - [ ] Add session management
  - [ ] Create auth guards

- [ ] **Security Features**
  - [ ] Implement rate limiting
  - [ ] Add input sanitization
  - [ ] Create secure file uploads
  - [ ] Add audit logging

#### 7.2 Data Protection
- [ ] **Privacy Controls**
  - [ ] Implement message encryption (future)
  - [ ] Add data retention policies
  - [ ] Create user data export
  - [ ] Implement account deletion

### Phase 8: Testing & Quality (Week 8)

#### 8.1 Testing Setup
- [ ] **Unit Tests**
  - [ ] Test all custom hooks
  - [ ] Test utility functions
  - [ ] Test component logic
  - [ ] Test database operations

- [ ] **Integration Tests**
  - [ ] Test real-time functionality
  - [ ] Test offline/online transitions
  - [ ] Test message synchronization
  - [ ] Test media upload/download

#### 8.2 End-to-End Testing
- [ ] **E2E Scenarios**
  - [ ] Test complete user flows
  - [ ] Test offline functionality
  - [ ] Test cross-device synchronization
  - [ ] Test error scenarios

### Phase 9: Deployment & Monitoring (Week 9)

#### 9.1 Deployment
- [ ] **Production Setup**
  - [ ] Configure production environment
  - [ ] Setup CDN for media files
  - [ ] Configure monitoring and logging
  - [ ] Setup error tracking

- [ ] **Performance Optimization**
  - [ ] Optimize bundle size
  - [ ] Implement code splitting
  - [ ] Add performance monitoring
  - [ ] Configure caching headers

#### 9.2 Monitoring
- [ ] **Analytics Setup**
  - [ ] Configure user analytics
  - [ ] Add performance monitoring
  - [ ] Setup error tracking
  - [ ] Create dashboards

## 🧱 LEGO BUILDER Implementation

### Component Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (chat)/
│   │   └── room/[id]/
│   │       └── page.tsx    # Server Component
│   └── api/
│       └── messages/
│           └── route.ts    # API Route Handler
├── components/
│   ├── ui/                 # UI Utilities (15-line limit)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── MessageBubble.tsx
│   ├── client/             # Client Orchestrators
│   │   ├── ChatRoom.tsx
│   │   └── MessageList.tsx
│   └── server/             # Server Components
│       └── RoomList.tsx
├── hooks/                  # Data & State Hooks
│   ├── use-messages.ts
│   ├── use-auth.ts
│   └── use-websocket.ts
├── lib/                    # Core Libs
│   ├── database.ts
│   ├── supabase.ts
│   └── types.ts
└── workers/
    └── sw.js               # Service Worker
```

### Development Guidelines

#### Atomic Component Rules
- Maximum 15 lines per component (excluding imports/types)
- Single responsibility per component
- TypeScript interfaces defined first
- Error boundaries for all components
- Loading states for all async operations

#### Hook Patterns
- Custom hooks for all data operations
- Clear separation between server and client logic
- Proper cleanup in useEffect
- Error handling in all hooks
- Loading states for all async operations

#### State Management
- IndexedDB as primary data source
- React Query for server synchronization
- Context for global state (auth, theme)
- Local state for UI interactions only

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Git

### Quick Start
```bash
# Clone repository
git clone <repo-url>
cd nightingale-connect

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run test:e2e     # Run end-to-end tests
npm run lint         # Run linter
npm run type-check   # Run TypeScript checks
```

## 📊 Success Metrics

### Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Offline functionality: 100% core features

### User Experience Goals
- Message delivery: < 200ms (online)
- Offline message sync: < 5s (when reconnected)
- Media upload: < 10s (typical image)
- App startup: < 2s (cold start)

## 🔄 Iteration Plan

### Weekly Reviews
- Code quality assessment
- Performance metrics review
- User feedback integration
- Technical debt evaluation

### Monthly Milestones
- Month 1: Core functionality complete
- Month 2: Advanced features implemented
- Month 3: Performance optimization
- Month 4: Production deployment

This specification provides a comprehensive roadmap for building the Nightingale Connect chat application with a focus on offline-first architecture, modular development, and healthcare-specific requirements.
