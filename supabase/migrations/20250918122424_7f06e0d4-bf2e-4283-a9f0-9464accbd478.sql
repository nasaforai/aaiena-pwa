-- Add DELETE RLS policy for device_sessions to allow cleanup
CREATE POLICY "Anyone can delete device sessions" 
ON public.device_sessions 
FOR DELETE 
USING (true);