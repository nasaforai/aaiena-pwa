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

  // Generate unique session ID when dialog opens
  useEffect(() => {
    if (open && !sessionId) {
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
      setSignupUrl(`https://aaiena-pwa.lovable.app/sign-up?session_id=${newSessionId}`);
      
      // Create device session in database
      createDeviceSession(newSessionId);
    }
  }, [open, sessionId, createDeviceSession]);

  // Listen for authentication completion
  useEffect(() => {
    if (!sessionId || user) return;

    const unsubscribe = subscribeToDeviceSession(sessionId, async (userId: string) => {
      await handleKioskLogin(userId);
    });

    return unsubscribe;
  }, [sessionId, user, subscribeToDeviceSession]);

  // Cleanup session when dialog closes
  useEffect(() => {
    return () => {
      if (sessionId && !open) {
        cleanupDeviceSession(sessionId);
      }
    };
  }, [sessionId, open, cleanupDeviceSession]);

  const handleKioskLogin = async (userId: string) => {
    try {
      toast({
        title: "Authentication Successful",
        description: "Mobile device authenticated successfully. Redirecting...",
      });
      
      // Clean up the session
      await cleanupDeviceSession(sessionId);
      
      onClose();
      
      // Navigate to store - the parent component should handle this
      window.location.href = '/store';
    } catch (error) {
      console.error('Error handling kiosk login:', error);
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

          {/* Close Button */}
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}