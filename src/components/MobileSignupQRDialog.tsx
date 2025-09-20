import React, { useState, useEffect } from "react";
import { Copy, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useDeviceSession } from "@/hooks/useDeviceSession";
import { supabase } from "@/integrations/supabase/client";

interface MobileSignupQRDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSignupQRDialog({ open, onClose }: MobileSignupQRDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { createDeviceSession, cleanupDeviceSession, subscribeToDeviceSession } = useDeviceSession();
  const [sessionId, setSessionId] = useState<string>("");
  const [signupUrl, setSignupUrl] = useState<string>("");

  // Generate unique session ID when dialog opens and persist in URL
  useEffect(() => {
    if (open && !sessionId) {
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
      const url = new URL(window.location.href);
      url.searchParams.set('session_id', newSessionId);
      window.history.replaceState({}, '', url.toString());
      const newSignupUrl = `${window.location.origin}/signup-options?session_id=${newSessionId}`;
      setSignupUrl(newSignupUrl);
      // Create device session in database
      createDeviceSession(newSessionId).then((ok) => {
        if (!ok) {
          console.error('Failed to create device session');
          toast({
            title: 'Session Error',
            description: 'Could not start kiosk pairing session. Please retry.',
            variant: 'destructive',
          });
        } else {
          console.log('Device session created:', newSessionId);
        }
      });
    }
  }, [open, sessionId, createDeviceSession, toast]);

  // Listen for authentication completion via realtime and add polling fallback
  useEffect(() => {
    if (!sessionId || user) return;
    console.log('Subscribing to device session updates for:', sessionId);
    const unsubscribe = subscribeToDeviceSession(sessionId, async (userId: string) => {
      console.log('Realtime detected authenticated user:', userId);
      await handleKioskLogin(userId);
    });
    return unsubscribe;
  }, [sessionId, user, subscribeToDeviceSession]);

  useEffect(() => {
    if (!sessionId || user) return;
    console.log('Starting polling fallback for session:', sessionId);
    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('device_sessions')
          .select('status,user_id')
          .eq('kiosk_session_id', sessionId)
          .maybeSingle();
        if (error) {
          console.error('Polling error:', error);
          return;
        }
        if (data?.status === 'authenticated' && data.user_id) {
          console.log('Polling detected authentication for user:', data.user_id);
          clearInterval(interval);
          await handleKioskLogin(data.user_id);
        }
      } catch (err) {
        console.error('Polling exception:', err);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [sessionId, user]);

  // Do NOT auto-delete the session on dialog close; keep it active so kiosk can still log in
  useEffect(() => {
    if (!sessionId) return;
    if (!open) {
      console.log('Dialog closed; keeping device session active for background pairing.');
    }
  }, [sessionId, open]);

  const handleKioskLogin = async (userId: string) => {
    try {
      console.log('Handling kiosk login for user:', userId);
      
      toast({
        title: "Authentication Successful",
        description: "Mobile device authenticated successfully. Authenticating kiosk...",
      });
      
      // Call the kiosk auth edge function to get a session token
      const { data, error } = await supabase.functions.invoke('kiosk-auth', {
        body: { sessionId }
      });

      if (error) {
        console.error('Kiosk auth error:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to authenticate kiosk. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data.authUrl) {
        console.log('Redirecting to auth URL for kiosk session');
        // Use the generated auth URL to authenticate the kiosk
        window.location.href = data.authUrl;
      } else {
        console.error('No auth URL received from kiosk-auth function');
        toast({
          title: "Authentication Error",
          description: "Invalid authentication response. Please try again.",
          variant: "destructive",
        });
      }
      
      onClose();
      
    } catch (error) {
      console.error('Error handling kiosk login:', error);
      toast({
        title: "Authentication Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(signupUrl);
      toast({
        title: "URL Copied",
        description: "The signup URL has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Generate QR code URL with session ID
  const generateQRCodeUrl = (url: string) => {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    return qrApiUrl;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Sign Up with Mobile Device
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            {signupUrl ? (
              <img 
                src={generateQRCodeUrl(signupUrl)}
                alt="QR Code for Mobile Signup" 
                className="w-48 h-48"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 animate-pulse rounded" />
            )}
          </div>

          {/* Instructions */}
          <div className="text-center space-y-2">
            <h3 className="font-medium text-gray-900">Follow these steps:</h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Scan the QR code with your mobile device</li>
              <li>2. Complete the signup process on your phone</li>
              <li>3. Start shopping with your new account</li>
            </ol>
          </div>

          {/* URL Section */}
          <div className="w-full space-y-2">
            <p className="text-sm text-gray-600 text-center">
              Or copy this link to your mobile device:
            </p>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={signupUrl}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                className="shrink-0"
                disabled={!signupUrl}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Hide
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (sessionId) {
                  await cleanupDeviceSession(sessionId);
                  const url = new URL(window.location.href);
                  url.searchParams.delete('session_id');
                  window.history.replaceState({}, '', url.toString());
                }
                toast({
                  title: 'Session Ended',
                  description: 'Kiosk pairing session has been cancelled.',
                });
                onClose();
              }}
            >
              Cancel & End Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}