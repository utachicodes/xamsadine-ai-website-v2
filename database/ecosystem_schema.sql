-- ==========================================
-- 0. Profiles Table (Prerequisite)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add policies for profiles if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile') THEN
        CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
        CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- ==========================================
-- 1. Updates to Existing Profiles
-- ==========================================
-- Add new columns to profiles if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'languages') THEN
        ALTER TABLE public.profiles ADD COLUMN languages TEXT[] DEFAULT ARRAY['wolof', 'french'];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'interests') THEN
        ALTER TABLE public.profiles ADD COLUMN interests TEXT[];
    END IF;
END $$;

-- ==========================================
-- 2. User Engagement Tracking
-- ==========================================
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'video_watch', 'event_register', 'purchase'
  target_id UUID NOT NULL, -- ID of the video, event, or order
  metadata JSONB, -- { "duration_watched": 120, "event_name": "..." }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for activity
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity"
ON public.user_activity FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
ON public.user_activity FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 3. Media Platform (Video & Podcast)
-- ==========================================
DO $$ BEGIN
    CREATE TYPE content_type AS ENUM ('video', 'podcast_episode');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audience_level AS ENUM ('kids', 'teens', 'adults');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.media_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type content_type NOT NULL,
  url TEXT NOT NULL, -- Mux playback ID or Supabase Storage URL
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  language TEXT,
  audience audience_level,
  transcript TEXT, -- For RAG indexing
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_progress (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  media_id UUID REFERENCES public.media_content(id) ON DELETE CASCADE,
  progress_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, media_id)
);

-- RLS for Media
ALTER TABLE public.media_content ENABLE ROW LEVEL SECURITY;
-- Everyone can read media
CREATE POLICY "Public read access to media"
ON public.media_content FOR SELECT USING (true);
-- Only admin can modify
CREATE POLICY "Admin write access to media"
ON public.media_content FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.media_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own progress"
ON public.media_progress FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 4. Event Management
-- ==========================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  location_name TEXT,
  location_coordinates POINT,
  is_online BOOLEAN DEFAULT FALSE,
  max_attendees INTEGER,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'confirmed', -- 'waitlist', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- RLS for Events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own registrations" 
ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register"
ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 5. E-commerce
-- ==========================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  stock_quantity INTEGER DEFAULT 0,
  images TEXT[],
  category TEXT, -- 'clothing', 'books', 'access'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'paid', 'shipped'
  payment_method TEXT, -- 'orange_money', 'wave'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL
);

-- RLS for Commerce
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- 6. Helper Functions (RPC)
-- ==========================================
CREATE OR REPLACE FUNCTION decrement_stock(p_id UUID, q INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.products
  SET stock_quantity = stock_quantity - q
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
