-- =========================================================
-- RealQR Studio - Row Level Security (RLS) Policies
-- Run this AFTER the main schema.sql in Supabase SQL Editor
-- =========================================================

-- ─── Enable RLS on all tables ───────────────────────────────────────────────
ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- ─── profiles ───────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ─── qr_codes ───────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own QR codes"
  ON public.qr_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own QR codes"
  ON public.qr_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own QR codes"
  ON public.qr_codes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own QR codes"
  ON public.qr_codes FOR DELETE
  USING (auth.uid() = user_id);

-- Public read for dynamic redirect resolution (short_code lookup)
CREATE POLICY "Public can read active QR codes by short_code"
  ON public.qr_codes FOR SELECT
  USING (is_active = TRUE);

-- ─── scans ──────────────────────────────────────────────────────────────────
-- Anyone (anon) can INSERT a scan (QR scanner doesn't need auth)
CREATE POLICY "Anyone can log a scan"
  ON public.scans FOR INSERT
  WITH CHECK (TRUE);

-- Only the QR owner can READ their scan data
CREATE POLICY "QR owners can view their scans"
  ON public.scans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.qr_codes
      WHERE qr_codes.id = scans.qr_code_id
        AND qr_codes.user_id = auth.uid()
    )
  );
