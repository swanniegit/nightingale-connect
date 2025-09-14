-- Nightingale Connect Database Schema - Safe Rebuild
-- This script drops everything and rebuilds the schema correctly
-- Run this in your Supabase SQL Editor

-- =============================================
-- STEP 1: DROP ALL EXISTING OBJECTS
-- =============================================

-- Drop triggers first
DROP TRIGGER IF EXISTS message_insert_trigger ON messages;
DROP TRIGGER IF EXISTS room_last_message_trigger ON messages;

-- Drop functions
DROP FUNCTION IF EXISTS notify_message_insert();
DROP FUNCTION IF EXISTS update_room_last_message();

-- Drop policies (in any order)
DROP POLICY IF EXISTS "Users can view messages in their rooms" ON messages;
DROP POLICY IF EXISTS "Users can insert messages in their rooms" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Users can view their rooms" ON rooms;
DROP POLICY IF EXISTS "Users can create rooms" ON rooms;
DROP POLICY IF EXISTS "Users can view their own memberships" ON members;
DROP POLICY IF EXISTS "Users can view members in their rooms" ON members;
DROP POLICY IF EXISTS "Users can join rooms" ON members;
DROP POLICY IF EXISTS "Users can leave rooms" ON members;
DROP POLICY IF EXISTS "Admins can manage members" ON members;
DROP POLICY IF EXISTS "Users can view read receipts in their rooms" ON message_reads;
DROP POLICY IF EXISTS "Users can create read receipts" ON message_reads;

-- Drop all policies with generic names
DROP POLICY IF EXISTS "messages_select_policy" ON messages;
DROP POLICY IF EXISTS "messages_insert_policy" ON messages;
DROP POLICY IF EXISTS "messages_update_policy" ON messages;
DROP POLICY IF EXISTS "rooms_select_policy" ON rooms;
DROP POLICY IF EXISTS "rooms_insert_policy" ON rooms;
DROP POLICY IF EXISTS "rooms_update_policy" ON rooms;
DROP POLICY IF EXISTS "members_select_own_policy" ON members;
DROP POLICY IF EXISTS "members_select_room_policy" ON members;
DROP POLICY IF EXISTS "members_insert_policy" ON members;
DROP POLICY IF EXISTS "members_delete_policy" ON members;
DROP POLICY IF EXISTS "members_update_policy" ON members;
DROP POLICY IF EXISTS "message_reads_select_policy" ON message_reads;
DROP POLICY IF EXISTS "message_reads_insert_policy" ON message_reads;

-- Drop tables (in reverse dependency order)
DROP TABLE IF EXISTS message_reads CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;

-- =============================================
-- STEP 2: CREATE TABLES
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create rooms table
CREATE TABLE rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  is_group BOOLEAN DEFAULT false,
  title TEXT NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  avatar_url TEXT
);

-- Create members table
CREATE TABLE members (
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (room_id, user_id)
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cid TEXT NOT NULL,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('local', 'sending', 'sent', 'ack', 'failed', 'deleted')),
  kind TEXT NOT NULL CHECK (kind IN ('text', 'image', 'file', 'system')),
  text TEXT,
  media JSONB,
  reactions JSONB DEFAULT '{}',
  edited_at TIMESTAMP WITH TIME ZONE,
  read_by UUID[] DEFAULT '{}',
  server_seq BIGSERIAL
);

-- Create message_reads table
CREATE TABLE message_reads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, user_id, message_id)
);

-- =============================================
-- STEP 3: CREATE INDEXES
-- =============================================

-- Messages indexes
CREATE INDEX idx_messages_room_created ON messages(room_id, created_at DESC);
CREATE INDEX idx_messages_cid ON messages(cid);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_server_seq ON messages(server_seq);

-- Rooms indexes
CREATE INDEX idx_rooms_last_message ON rooms(last_message_at DESC);

-- Members indexes
CREATE INDEX idx_members_room ON members(room_id);
CREATE INDEX idx_members_user ON members(user_id);
CREATE INDEX idx_members_role ON members(role);

-- Message reads indexes
CREATE INDEX idx_message_reads_room_user ON message_reads(room_id, user_id);
CREATE INDEX idx_message_reads_message ON message_reads(message_id);
CREATE INDEX idx_message_reads_read_at ON message_reads(read_at);

-- =============================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 5: CREATE RLS POLICIES (NO RECURSION)
-- =============================================

-- Messages policies
CREATE POLICY "messages_select_policy" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM members 
      WHERE members.room_id = messages.room_id 
      AND members.user_id = auth.uid()
    )
  );

CREATE POLICY "messages_insert_policy" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM members 
      WHERE members.room_id = messages.room_id 
      AND members.user_id = auth.uid()
    )
  );

CREATE POLICY "messages_update_policy" ON messages
  FOR UPDATE USING (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM members 
      WHERE members.room_id = messages.room_id 
      AND members.user_id = auth.uid()
    )
  );

-- Rooms policies
CREATE POLICY "rooms_select_policy" ON rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM members 
      WHERE members.room_id = rooms.id 
      AND members.user_id = auth.uid()
    )
  );

CREATE POLICY "rooms_insert_policy" ON rooms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "rooms_update_policy" ON rooms
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM members 
      WHERE members.room_id = rooms.id 
      AND members.user_id = auth.uid()
      AND members.role = 'admin'
    )
  );

-- Members policies
CREATE POLICY "members_select_own_policy" ON members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "members_select_room_policy" ON members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM members m2 
      WHERE m2.room_id = members.room_id 
      AND m2.user_id = auth.uid()
    )
  );

CREATE POLICY "members_insert_policy" ON members
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "members_delete_policy" ON members
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "members_update_policy" ON members
  FOR UPDATE USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM members m2 
      WHERE m2.room_id = members.room_id 
      AND m2.user_id = auth.uid()
      AND m2.role = 'admin'
    )
  );

-- Message reads policies
CREATE POLICY "message_reads_select_policy" ON message_reads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM members 
      WHERE members.room_id = message_reads.room_id 
      AND members.user_id = auth.uid()
    )
  );

CREATE POLICY "message_reads_insert_policy" ON message_reads
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM members 
      WHERE members.room_id = message_reads.room_id 
      AND members.user_id = auth.uid()
    )
  );

-- =============================================
-- STEP 6: ENABLE REALTIME (SAFE METHOD)
-- =============================================

-- Add to realtime (tables are fresh, so no need to drop)
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE members;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE message_reads;

-- =============================================
-- STEP 7: CREATE FUNCTIONS AND TRIGGERS
-- =============================================

-- Function for message notifications
CREATE OR REPLACE FUNCTION notify_message_insert()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'message_insert',
    json_build_object(
      'id', NEW.id,
      'cid', NEW.cid,
      'room_id', NEW.room_id,
      'sender_id', NEW.sender_id,
      'created_at', NEW.created_at,
      'status', NEW.status,
      'kind', NEW.kind,
      'text', NEW.text,
      'media', NEW.media,
      'reactions', NEW.reactions,
      'server_seq', NEW.server_seq
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function for room updates
CREATE OR REPLACE FUNCTION update_room_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE rooms 
  SET last_message_at = NEW.created_at
  WHERE id = NEW.room_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER message_insert_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_message_insert();

CREATE TRIGGER room_last_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_room_last_message();

-- =============================================
-- STEP 8: INSERT SAMPLE DATA (OPTIONAL)
-- =============================================

-- Create a sample room for testing
INSERT INTO rooms (id, is_group, title, description) VALUES 
('00000000-0000-0000-0000-000000000001', true, 'General Chat', 'Main discussion room');

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('rooms', 'members', 'messages', 'message_reads')
ORDER BY table_name;

-- Verify policies exist
SELECT schemaname, tablename, policyname FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Verify indexes exist
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('rooms', 'members', 'messages', 'message_reads')
ORDER BY tablename, indexname;

-- Success message
SELECT 'Schema rebuild completed successfully!' as status;
