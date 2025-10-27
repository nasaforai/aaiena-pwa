-- Create OTP codes table for WhatsApp authentication
CREATE TABLE IF NOT EXISTS public.otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  otp_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create index for quick lookups
CREATE INDEX IF NOT EXISTS idx_otp_phone_expiry ON public.otp_codes(phone_number, expires_at);

-- Enable RLS
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Allow edge functions to manage OTP codes (service role only)
CREATE POLICY "Service role can manage OTP codes"
  ON public.otp_codes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Cleanup function to delete expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.otp_codes 
  WHERE expires_at < now() - interval '24 hours';
  RETURN NULL;
END;
$$;

-- Trigger to cleanup expired OTPs periodically
CREATE TRIGGER trigger_cleanup_otps
  AFTER INSERT ON public.otp_codes
  EXECUTE FUNCTION public.cleanup_expired_otps();