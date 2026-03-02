-- ChefMatch Initial Schema
-- Migration: 001_initial_schema
-- Description: Creates all core tables, indexes, RLS policies, triggers, and realtime config

-- ============================================================
-- 1. TABLES
-- ============================================================

-- 1.1 users — Core user profile (extends auth.users)
CREATE TABLE users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  display_name  TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('chef', 'consumer')),
  avatar_url    TEXT,
  phone         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.2 chef_profiles — Chef-specific data
CREATE TABLE chef_profiles (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                    UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  tier                       TEXT NOT NULL CHECK (tier IN ('classically_trained', 'home_chef')),
  bio                        TEXT NOT NULL DEFAULT '',
  cuisine_specialties        TEXT[] NOT NULL DEFAULT '{}',
  photos                     TEXT[] NOT NULL DEFAULT '{}',
  service_models             TEXT[] NOT NULL DEFAULT '{}',
  price_range_min            INTEGER NOT NULL DEFAULT 0,
  price_range_max            INTEGER NOT NULL DEFAULT 0,
  service_radius             INTEGER NOT NULL DEFAULT 25,
  latitude                   DOUBLE PRECISION,
  longitude                  DOUBLE PRECISION,
  allergens_cant_accommodate TEXT[] NOT NULL DEFAULT '{}',
  background_check_status    TEXT NOT NULL DEFAULT 'not_started'
                             CHECK (background_check_status IN ('not_started', 'pending', 'passed', 'failed')),
  training_completed         BOOLEAN NOT NULL DEFAULT FALSE,
  is_live                    BOOLEAN NOT NULL DEFAULT FALSE,
  average_rating             NUMERIC(3,2),
  total_reviews              INTEGER NOT NULL DEFAULT 0,
  completed_events           INTEGER NOT NULL DEFAULT 0,
  home_chef_level            INTEGER CHECK (home_chef_level IN (1, 2, 3)),
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.3 chef_availability — Weekly recurring schedule
CREATE TABLE chef_availability (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chef_id     UUID NOT NULL REFERENCES chef_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  CHECK (end_time > start_time),
  UNIQUE (chef_id, day_of_week, start_time)
);

-- 1.4 menu_items — Chef dishes with per-dish allergen tracking
CREATE TABLE menu_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chef_id      UUID NOT NULL REFERENCES chef_profiles(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  price        INTEGER NOT NULL,
  allergens    TEXT[] NOT NULL DEFAULT '{}',
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.5 consumer_profiles — Consumer preferences & allergies
CREATE TABLE consumer_profiles (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  allergies            TEXT[] NOT NULL DEFAULT '{}',
  dietary_restrictions TEXT[] NOT NULL DEFAULT '{}',
  preferred_cuisines   TEXT[] NOT NULL DEFAULT '{}',
  max_budget           INTEGER,
  latitude             DOUBLE PRECISION,
  longitude            DOUBLE PRECISION,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.6 swipes — Consumer swipe actions on chefs
CREATE TABLE swipes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chef_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  direction   TEXT NOT NULL CHECK (direction IN ('like', 'pass')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (consumer_id, chef_id)
);

-- 1.7 conversations — Chat threads (created when consumer likes a chef)
CREATE TABLE conversations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chef_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (consumer_id, chef_id)
);

-- 1.8 messages — Individual messages within conversations
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.9 bookings — Booking records
CREATE TABLE bookings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chef_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_id     UUID REFERENCES conversations(id),
  status              TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  service_model       TEXT NOT NULL CHECK (service_model IN ('full_service', 'collaborative')),
  event_date          TIMESTAMPTZ NOT NULL,
  party_size          INTEGER NOT NULL CHECK (party_size > 0),
  occasion            TEXT NOT NULL DEFAULT '',
  special_requests    TEXT NOT NULL DEFAULT '',
  grocery_arrangement TEXT NOT NULL DEFAULT 'chef_provides'
                      CHECK (grocery_arrangement IN ('chef_provides', 'consumer_provides', 'split')),
  total_price         INTEGER,
  location_address    TEXT,
  location_latitude   DOUBLE PRECISION,
  location_longitude  DOUBLE PRECISION,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.10 reviews — Bidirectional reviews
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text        TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (booking_id, reviewer_id)
);

-- ============================================================
-- 2. INDEXES
-- ============================================================

-- Chef discovery
CREATE INDEX idx_chef_profiles_location ON chef_profiles (latitude, longitude) WHERE is_live = TRUE;
CREATE INDEX idx_chef_profiles_user_id ON chef_profiles (user_id);
CREATE INDEX idx_chef_profiles_tier ON chef_profiles (tier) WHERE is_live = TRUE;

-- Consumer lookups
CREATE INDEX idx_consumer_profiles_user_id ON consumer_profiles (user_id);

-- Swipe dedup + feed queries
CREATE INDEX idx_swipes_consumer_id ON swipes (consumer_id);

-- Conversation lookups
CREATE INDEX idx_conversations_consumer_id ON conversations (consumer_id);
CREATE INDEX idx_conversations_chef_id ON conversations (chef_id);

-- Message ordering within conversation
CREATE INDEX idx_messages_conversation_id ON messages (conversation_id, created_at);

-- Booking queries
CREATE INDEX idx_bookings_consumer_id ON bookings (consumer_id);
CREATE INDEX idx_bookings_chef_id ON bookings (chef_id);
CREATE INDEX idx_bookings_status ON bookings (status) WHERE status IN ('pending', 'confirmed');

-- Review lookups
CREATE INDEX idx_reviews_reviewee_id ON reviews (reviewee_id);
CREATE INDEX idx_reviews_booking_id ON reviews (booking_id);

-- Menu items per chef
CREATE INDEX idx_menu_items_chef_id ON menu_items (chef_id) WHERE is_available = TRUE;

-- Availability per chef
CREATE INDEX idx_chef_availability_chef_id ON chef_availability (chef_id);

-- ============================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chef_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chef_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 3.1 users
CREATE POLICY "Users can read any profile"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- 3.2 chef_profiles
CREATE POLICY "Anyone can read live chef profiles"
  ON chef_profiles FOR SELECT
  TO authenticated
  USING (is_live = TRUE OR user_id = auth.uid());

CREATE POLICY "Chefs can insert their own profile"
  ON chef_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Chefs can update their own profile"
  ON chef_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 3.3 chef_availability
CREATE POLICY "Anyone can read chef availability"
  ON chef_availability FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Chefs can manage their own availability"
  ON chef_availability FOR ALL
  TO authenticated
  USING (
    chef_id IN (SELECT id FROM chef_profiles WHERE user_id = auth.uid())
  )
  WITH CHECK (
    chef_id IN (SELECT id FROM chef_profiles WHERE user_id = auth.uid())
  );

-- 3.4 menu_items
CREATE POLICY "Anyone can read available menu items"
  ON menu_items FOR SELECT
  TO authenticated
  USING (is_available = TRUE OR chef_id IN (SELECT id FROM chef_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Chefs can manage their own menu items"
  ON menu_items FOR ALL
  TO authenticated
  USING (
    chef_id IN (SELECT id FROM chef_profiles WHERE user_id = auth.uid())
  )
  WITH CHECK (
    chef_id IN (SELECT id FROM chef_profiles WHERE user_id = auth.uid())
  );

-- 3.5 consumer_profiles
CREATE POLICY "Consumers can read their own profile"
  ON consumer_profiles FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR user_id IN (
      SELECT consumer_id FROM conversations WHERE chef_id = auth.uid()
    )
  );

CREATE POLICY "Consumers can insert their own profile"
  ON consumer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Consumers can update their own profile"
  ON consumer_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 3.6 swipes
CREATE POLICY "Consumers can read their own swipes"
  ON swipes FOR SELECT
  TO authenticated
  USING (consumer_id = auth.uid());

CREATE POLICY "Consumers can insert their own swipes"
  ON swipes FOR INSERT
  TO authenticated
  WITH CHECK (consumer_id = auth.uid());

-- 3.7 conversations
CREATE POLICY "Participants can read their own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (consumer_id = auth.uid() OR chef_id = auth.uid());

CREATE POLICY "Consumers can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (consumer_id = auth.uid());

-- 3.8 messages
CREATE POLICY "Conversation participants can read messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE consumer_id = auth.uid() OR chef_id = auth.uid()
    )
  );

CREATE POLICY "Conversation participants can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND conversation_id IN (
      SELECT id FROM conversations
      WHERE consumer_id = auth.uid() OR chef_id = auth.uid()
    )
  );

CREATE POLICY "Senders can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE consumer_id = auth.uid() OR chef_id = auth.uid()
    )
  )
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE consumer_id = auth.uid() OR chef_id = auth.uid()
    )
  );

-- 3.9 bookings
CREATE POLICY "Booking participants can read their bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (consumer_id = auth.uid() OR chef_id = auth.uid());

CREATE POLICY "Consumers can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (consumer_id = auth.uid());

CREATE POLICY "Booking participants can update their bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (consumer_id = auth.uid() OR chef_id = auth.uid())
  WITH CHECK (consumer_id = auth.uid() OR chef_id = auth.uid());

-- 3.10 reviews
CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Booking participants can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    reviewer_id = auth.uid()
    AND booking_id IN (
      SELECT id FROM bookings
      WHERE consumer_id = auth.uid() OR chef_id = auth.uid()
    )
  );

-- ============================================================
-- 4. UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON chef_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON consumer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 5. REALTIME
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
