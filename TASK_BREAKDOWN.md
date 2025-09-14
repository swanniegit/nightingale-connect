# 📋 Nightingale Connect - Detailed Task Breakdown

## 🎯 Phase 1: Foundation Setup (Week 1)

### Task 1.1: Next.js Project Setup
**Priority**: High | **Estimated Time**: 4 hours

#### Subtasks:
- [ ] **Initialize Next.js with App Router**
  ```bash
  npx create-next-app@latest nightingale-connect --typescript --tailwind --eslint --app
  cd nightingale-connect
  ```

- [ ] **Configure TypeScript paths**
  ```json
  // tsconfig.json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"],
        "@/components/*": ["./src/components/*"],
        "@/hooks/*": ["./src/hooks/*"],
        "@/lib/*": ["./src/lib/*"]
      }
    }
  }
  ```

- [ ] **Setup Tailwind CSS configuration**
  ```javascript
  // tailwind.config.js
  module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#eff6ff',
            500: '#3b82f6',
            900: '#1e3a8a',
          }
        }
      },
    },
    plugins: [],
  }
  ```

- [ ] **Install core dependencies**
  ```bash
  npm install @supabase/supabase-js @tanstack/react-query idb workbox-window
  npm install -D @types/idb workbox-cli
  ```

### Task 1.2: IndexedDB Schema Setup
**Priority**: High | **Estimated Time**: 6 hours

#### Subtasks:
- [ ] **Create database types**
  ```typescript
  // src/lib/types.ts
  export interface Message {
    id?: string;
    cid: string;
    roomId: string;
    senderId: string;
    createdAt: Date;
    status: 'local' | 'sending' | 'sent' | 'ack' | 'failed' | 'deleted';
    kind: 'text' | 'image' | 'file' | 'system';
    text?: string;
    media?: {
      url?: string;
      blobRef?: string;
      mime?: string;
      w?: number;
      h?: number;
    };
    reactions?: Record<string, string>;
    editedAt?: Date;
    readBy?: string[];
  }

  export interface Room {
    id: string;
    isGroup: boolean;
    title: string;
    lastMessageAt: Date;
  }

  export interface Member {
    roomId: string;
    userId: string;
    role: 'admin' | 'member';
  }
  ```

- [ ] **Create database setup**
  ```typescript
  // src/lib/database.ts
  import { openDB, DBSchema, IDBPDatabase } from 'idb';
  
  interface ChatDB extends DBSchema {
    messages: {
      key: string;
      value: Message;
      indexes: {
        'byRoomTime': [string, Date];
        'byStatus': string;
        'byCid': string;
      };
    };
    rooms: {
      key: string;
      value: Room;
      indexes: {
        'byLastMessage': Date;
      };
    };
    members: {
      key: string;
      value: Member;
      indexes: {
        'byRoom': string;
      };
    };
    outbox: {
      key: string;
      value: {
        cid: string;
        roomId: string;
        payload: any;
        attempt: number;
        nextAttemptAt: Date;
      };
    };
    mediaBlobs: {
      key: string;
      value: {
        blobRef: string;
        blob: Blob;
      };
    };
  }

  export const dbp = openDB<ChatDB>('chatdb@v1', 1, {
    upgrade(db) {
      // Messages store
      const messages = db.createObjectStore('messages', { keyPath: 'id' });
      messages.createIndex('byRoomTime', ['roomId', 'createdAt']);
      messages.createIndex('byStatus', 'status');
      messages.createIndex('byCid', 'cid');
      
      // Rooms store
      const rooms = db.createObjectStore('rooms', { keyPath: 'id' });
      rooms.createIndex('byLastMessage', 'lastMessageAt');
      
      // Members store
      const members = db.createObjectStore('members', { keyPath: ['roomId', 'userId'] });
      members.createIndex('byRoom', 'roomId');
      
      // Outbox store
      db.createObjectStore('outbox', { keyPath: 'cid' });
      
      // Media blobs store
      db.createObjectStore('mediaBlobs', { keyPath: 'blobRef' });
    },
  });
  ```

### Task 1.3: Supabase Integration
**Priority**: High | **Estimated Time**: 4 hours

#### Subtasks:
- [ ] **Setup Supabase client**
  ```typescript
  // src/lib/supabase.ts
  import { createClient } from '@supabase/supabase-js';
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
  ```

- [ ] **Create database tables**
  ```sql
  -- Create messages table
  CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cid TEXT NOT NULL,
    room_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'sent',
    kind TEXT NOT NULL,
    text TEXT,
    media JSONB,
    reactions JSONB DEFAULT '{}',
    edited_at TIMESTAMP WITH TIME ZONE,
    read_by UUID[]
  );

  -- Create rooms table
  CREATE TABLE rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    is_group BOOLEAN DEFAULT false,
    title TEXT NOT NULL,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Create members table
  CREATE TABLE members (
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    PRIMARY KEY (room_id, user_id)
  );
  ```

## 🎯 Phase 2: Core Data Layer (Week 2)

### Task 2.1: Database Operations
**Priority**: High | **Estimated Time**: 8 hours

#### Subtasks:
- [ ] **Create CRUD operations**
  ```typescript
  // src/lib/database-operations.ts
  import { dbp } from './database';
  import { Message, Room, Member } from './types';

  export class MessageDB {
    static async create(message: Omit<Message, 'id'>): Promise<string> {
      const db = await dbp;
      const id = crypto.randomUUID();
      const newMessage = { ...message, id };
      await db.add('messages', newMessage);
      return id;
    }

    static async getByRoom(roomId: string, limit = 50): Promise<Message[]> {
      const db = await dbp;
      const tx = db.transaction('messages', 'readonly');
      const store = tx.objectStore('messages');
      const index = store.index('byRoomTime');
      
      const messages = await index.getAll([roomId], limit);
      return messages.reverse(); // Most recent first
    }

    static async updateStatus(cid: string, status: Message['status']): Promise<void> {
      const db = await dbp;
      const tx = db.transaction('messages', 'readwrite');
      const store = tx.objectStore('messages');
      const index = store.index('byCid');
      
      const message = await index.get(cid);
      if (message) {
        message.status = status;
        await store.put(message);
      }
    }
  }
  ```

- [ ] **Create transaction helpers**
  ```typescript
  // src/lib/transaction-helpers.ts
  import { dbp } from './database';

  export async function withTransaction<T>(
    stores: string[],
    operation: (tx: any) => Promise<T>
  ): Promise<T> {
    const db = await dbp;
    const tx = db.transaction(stores, 'readwrite');
    try {
      const result = await operation(tx);
      await tx.done;
      return result;
    } catch (error) {
      tx.abort();
      throw error;
    }
  }
  ```

### Task 2.2: Data Hooks
**Priority**: High | **Estimated Time**: 10 hours

#### Subtasks:
- [ ] **Create useMessages hook**
  ```typescript
  // src/hooks/use-messages.ts
  import { useState, useEffect } from 'react';
  import { MessageDB } from '@/lib/database-operations';
  import { Message } from '@/lib/types';

  export function useMessages(roomId: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      let isMounted = true;

      async function loadMessages() {
        try {
          setIsLoading(true);
          const roomMessages = await MessageDB.getByRoom(roomId);
          if (isMounted) {
            setMessages(roomMessages);
          }
        } catch (err) {
          if (isMounted) {
            setError(err as Error);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }

      loadMessages();

      return () => {
        isMounted = false;
      };
    }, [roomId]);

    return { messages, isLoading, error };
  }
  ```

- [ ] **Create useAuth hook**
  ```typescript
  // src/hooks/use-auth.ts
  import { useState, useEffect } from 'react';
  import { supabase } from '@/lib/supabase';
  import { User } from '@supabase/supabase-js';

  export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    }, []);

    return { user, isLoading, isAuthenticated: !!user };
  }
  ```

## 🎯 Phase 3: UI Components (Week 3)

### Task 3.1: UI Utilities
**Priority**: High | **Estimated Time**: 12 hours

#### Subtasks:
- [ ] **Create Button component**
  ```typescript
  // src/components/ui/Button.tsx
  import { ButtonHTMLAttributes, forwardRef } from 'react';
  import { cn } from '@/lib/utils';

  interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
  }

  export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
      return (
        <button
          className={cn(
            'inline-flex items-center justify-center rounded-md font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:pointer-events-none disabled:opacity-50',
            {
              'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
              'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
              'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            },
            {
              'h-9 px-3 text-sm': size === 'sm',
              'h-10 px-4 py-2': size === 'md',
              'h-11 px-8 text-lg': size === 'lg',
            },
            className
          )}
          ref={ref}
          {...props}
        />
      );
    }
  );
  ```

- [ ] **Create MessageBubble component**
  ```typescript
  // src/components/ui/MessageBubble.tsx
  import { Message } from '@/lib/types';
  import { cn } from '@/lib/utils';

  interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
  }

  export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
    return (
      <div
        className={cn(
          'max-w-xs px-4 py-2 rounded-lg',
          isOwn
            ? 'bg-primary text-primary-foreground ml-auto'
            : 'bg-muted text-muted-foreground'
        )}
      >
        <p className="text-sm">{message.text}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs opacity-70">
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
          <span className="text-xs opacity-70">
            {message.status}
          </span>
        </div>
      </div>
    );
  }
  ```

### Task 3.2: Client Orchestrators
**Priority**: High | **Estimated Time**: 16 hours

#### Subtasks:
- [ ] **Create ChatRoom component**
  ```typescript
  // src/components/client/ChatRoom.tsx
  'use client';
  import { useMessages } from '@/hooks/use-messages';
  import { MessageBubble } from '@/components/ui/MessageBubble';
  import { MessageInput } from '@/components/ui/MessageInput';
  import { Spinner } from '@/components/ui/Spinner';

  interface ChatRoomProps {
    roomId: string;
  }

  export function ChatRoom({ roomId }: ChatRoomProps) {
    const { messages, isLoading, error } = useMessages(roomId);

    if (isLoading) return <Spinner />;
    if (error) return <div>Error: {error.message}</div>;

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((message) => (
            <MessageBubble
              key={message.id || message.cid}
              message={message}
              isOwn={message.senderId === 'current-user'} // TODO: Get from auth
            />
          ))}
        </div>
        <MessageInput roomId={roomId} />
      </div>
    );
  }
  ```

## 🎯 Phase 4: Real-time Features (Week 4)

### Task 4.1: WebSocket Integration
**Priority**: High | **Estimated Time**: 12 hours

#### Subtasks:
- [ ] **Create useWebSocket hook**
  ```typescript
  // src/hooks/use-websocket.ts
  import { useState, useEffect, useRef } from 'react';
  import { supabase } from '@/lib/supabase';
  import { Message } from '@/lib/types';

  export function useWebSocket(roomId: string) {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const channelRef = useRef<any>(null);

    useEffect(() => {
      const channel = supabase
        .channel(`room:${roomId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${roomId}`,
          },
          (payload) => {
            const message = payload.new as Message;
            setMessages(prev => [...prev, message]);
          }
        )
        .subscribe((status) => {
          setIsConnected(status === 'SUBSCRIBED');
        });

      channelRef.current = channel;

      return () => {
        channel.unsubscribe();
      };
    }, [roomId]);

    return { isConnected, messages };
  }
  ```

## 🎯 Phase 5: Service Worker Setup (Week 5)

### Task 5.1: Workbox Configuration
**Priority**: Medium | **Estimated Time**: 8 hours

#### Subtasks:
- [ ] **Create service worker**
  ```javascript
  // public/sw.js
  import { precacheAndRoute } from 'workbox-precaching';
  import { registerRoute } from 'workbox-routing';
  import { NetworkFirst, CacheFirst } from 'workbox-strategies';
  import { BackgroundSyncPlugin } from 'workbox-background-sync';

  precacheAndRoute(self.__WB_MANIFEST || []);

  // API routes - NetworkFirst with short cache
  registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new NetworkFirst({
      cacheName: 'api-cache',
      networkTimeoutSeconds: 3,
    })
  );

  // Media files - CacheFirst
  registerRoute(
    ({ request }) => request.destination === 'image' || request.destination === 'video',
    new CacheFirst({
      cacheName: 'media-cache',
    })
  );

  // Background sync for messages
  const messageQueue = new BackgroundSyncPlugin('message-queue', {
    maxRetentionTime: 24 * 60, // 24 hours
  });

  registerRoute(
    ({ url }) => url.pathname === '/api/messages' && url.searchParams.has('method=POST'),
    new NetworkFirst({
      plugins: [messageQueue],
    })
  );
  ```

## 📊 Progress Tracking

### Daily Standup Questions
1. What did I complete yesterday?
2. What am I working on today?
3. What blockers do I have?
4. How confident am I in the current approach? (1-10)

### Weekly Review Checklist
- [ ] All planned tasks completed
- [ ] Code quality standards met
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Performance targets met
- [ ] Security considerations addressed

### Definition of Done
- [ ] Code follows LEGO BUILDER principles
- [ ] TypeScript types are complete
- [ ] Error handling is implemented
- [ ] Loading states are shown
- [ ] Tests are written and passing
- [ ] Code is reviewed and approved
- [ ] Documentation is updated

This detailed task breakdown provides specific implementation steps for each phase of the Nightingale Connect development project, following the LEGO BUILDER methodology and ensuring atomic, composable components.
