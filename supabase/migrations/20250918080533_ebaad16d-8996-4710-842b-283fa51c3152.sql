-- Create device_sessions table for cross-device authentication
CREATE TABLE public.device_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kiosk_session_id TEXT NOT NULL UNIQUE,
  user_id UUID NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '10 minutes')
);

-- Enable Row Level Security
ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for device sessions
CREATE POLICY "Anyone can view device sessions" 
ON public.device_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create device sessions" 
ON public.device_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update device sessions" 
ON public.device_sessions 
FOR UPDATE 
USING (true);

-- Add index for better performance
CREATE INDEX idx_device_sessions_kiosk_session_id ON public.device_sessions(kiosk_session_id);
CREATE INDEX idx_device_sessions_status ON public.device_sessions(status);

-- Enable realtime for device_sessions table
ALTER TABLE public.device_sessions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.device_sessions;