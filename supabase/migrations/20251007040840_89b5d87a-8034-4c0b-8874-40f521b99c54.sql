-- Enable replica identity for real-time updates on device_sessions
ALTER TABLE device_sessions REPLICA IDENTITY FULL;