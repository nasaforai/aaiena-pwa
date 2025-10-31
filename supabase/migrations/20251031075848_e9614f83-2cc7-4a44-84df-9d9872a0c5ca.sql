-- Create rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_number TEXT NOT NULL UNIQUE,
  brand_id UUID REFERENCES public.brands(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create room_sessions table (tracks active bookings)
CREATE TABLE IF NOT EXISTS public.room_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  phone_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '5 minutes'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create room_queue table (manages waiting list)
CREATE TABLE IF NOT EXISTS public.room_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  phone_number TEXT NOT NULL,
  position INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notified_at TIMESTAMPTZ
);

-- Create unique constraint to prevent double-booking
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_room_session 
ON public.room_sessions (room_id) 
WHERE status = 'active';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_room_sessions_room_id ON public.room_sessions(room_id);
CREATE INDEX IF NOT EXISTS idx_room_sessions_status ON public.room_sessions(status);
CREATE INDEX IF NOT EXISTS idx_room_queue_room_id ON public.room_queue(room_id);
CREATE INDEX IF NOT EXISTS idx_room_queue_status ON public.room_queue(status);
CREATE INDEX IF NOT EXISTS idx_room_queue_position ON public.room_queue(position);

-- Enable Row Level Security
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rooms
CREATE POLICY "Rooms are viewable by everyone"
  ON public.rooms FOR SELECT
  USING (is_active = true);

-- RLS Policies for room_sessions
CREATE POLICY "Active sessions viewable by everyone"
  ON public.room_sessions FOR SELECT
  USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can create sessions"
  ON public.room_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own sessions"
  ON public.room_sessions FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for room_queue
CREATE POLICY "Queue viewable by everyone"
  ON public.room_queue FOR SELECT
  USING (true);

CREATE POLICY "Users can join queue"
  ON public.room_queue FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own queue entries"
  ON public.room_queue FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Enable realtime for all tables
ALTER TABLE public.rooms REPLICA IDENTITY FULL;
ALTER TABLE public.room_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.room_queue REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_queue;

-- Add trigger for updated_at
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_room_sessions_updated_at
  BEFORE UPDATE ON public.room_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial rooms
INSERT INTO public.rooms (room_number, is_active) VALUES
  ('1A', true),
  ('1B', true),
  ('2A', true),
  ('2B', true),
  ('3A', true),
  ('3B', true)
ON CONFLICT (room_number) DO NOTHING;