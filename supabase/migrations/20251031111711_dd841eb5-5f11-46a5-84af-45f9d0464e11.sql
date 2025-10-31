-- Enable required extensions for cron jobs and HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create cron job to process room queue every minute
SELECT cron.schedule(
  'process-room-queue-every-minute',
  '* * * * *', -- Every minute
  $$
  SELECT
    net.http_post(
        url:='https://mpvcadyicshblhleoyob.supabase.co/functions/v1/process-room-queue',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wdmNhZHlpY3NoYmxobGVveW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzcxMTEsImV4cCI6MjA3MDg1MzExMX0.x68sZnBQN1c7MmAjHR-dLdxUWt2lU2tN4IV7wX4mCEM"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);