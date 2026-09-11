-- =========================================================
-- RealQR Studio - Complete Production Database Schema
-- Run this in your Supabase SQL Editor (supabase.com)
-- =========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'pro')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Workspaces & Collaboration Teams
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('owner', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 4. QR Codes (Static & Dynamic)
CREATE TABLE IF NOT EXISTS public.qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL DEFAULT 'Untitled QR',
  short_code TEXT UNIQUE NOT NULL,
  qr_type TEXT NOT NULL CHECK (qr_type IN ('static', 'dynamic')),
  content_type TEXT NOT NULL,
  
  destination_url TEXT,
  content_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  design JSONB NOT NULL DEFAULT '{}'::jsonb,

  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  max_scans INTEGER DEFAULT NULL,
  require_auth BOOLEAN DEFAULT FALSE,
  smart_routing JSONB DEFAULT '[]'::jsonb,
  ab_testing JSONB DEFAULT '{"enabled": false, "variants": []}'::jsonb,

  tags TEXT[] DEFAULT '{}',
  folder TEXT DEFAULT 'General',
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_short_code ON public.qr_codes (short_code);
CREATE INDEX IF NOT EXISTS idx_qr_user_id ON public.qr_codes (user_id);

-- 5. Version History (Tracking dynamic destination changes)
CREATE TABLE IF NOT EXISTS public.qr_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qr_code_id UUID NOT NULL REFERENCES public.qr_codes(id) ON DELETE CASCADE,
  previous_url TEXT NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Scan Event Logs (Real-time Analytics)
CREATE TABLE IF NOT EXISTS public.scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qr_code_id UUID NOT NULL REFERENCES public.qr_codes(id) ON DELETE CASCADE,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  
  visitor_hash TEXT,
  scanner_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  country TEXT,
  city TEXT,
  device_type TEXT,
  os TEXT,
  browser TEXT,
  referrer TEXT,
  matched_variant TEXT
);

CREATE INDEX IF NOT EXISTS idx_scans_qr_code_time ON public.scans (qr_code_id, scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_visitor_hash ON public.scans (qr_code_id, visitor_hash);

-- 7. Stored Procedure for atomic high-throughput scan counter increment
CREATE OR REPLACE FUNCTION public.increment_qr_scans(qr_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.qr_codes
  SET scan_count = scan_count + 1,
      updated_at = NOW()
  WHERE id = qr_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
