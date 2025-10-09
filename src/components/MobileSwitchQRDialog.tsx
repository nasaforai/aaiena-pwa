import React, { useState, useEffect } from "react";
import { Copy, Smartphone } from "lucide-react";
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
import { SignupQRCode } from "@/components/QRCodeGenerator";

interface MobileSwitchQRDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSwitchQRDialog({ open, onClose }: MobileSwitchQRDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { createAuthenticatedSessionTransfer, cleanupDeviceSession } = useDeviceSession();
  const [sessionId, setSessionId] = useState<string>("");
  const [switchUrl, setSwitchUrl] = useState<string>("");

  // Generate unique session ID when dialog opens
  useEffect(() => {
    if (open && !sessionId && user) {
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
      setSwitchUrl(`${window.location.origin}/signin?switch_session_id=${newSessionId}&user_id=${user.id}`);
      
      // Create authenticated session transfer in database
      createAuthenticatedSessionTransfer(newSessionId, user.id);
    }
  }, [open, sessionId, user, createAuthenticatedSessionTransfer]);

  // Cleanup session when dialog closes
  useEffect(() => {
    return () => {
      if (sessionId && !open) {
        cleanupDeviceSession(sessionId);
      }
    };
  }, [sessionId, open, cleanupDeviceSession]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(switchUrl);
      toast({
        title: "URL Copied",
        description: "The mobile switch URL has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold flex items-center justify-center gap-2">
            <Smartphone className="w-5 h-5" />
            Switch to Mobile Device
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            {switchUrl ? (
              <SignupQRCode
                signupUrl={switchUrl}
                size={192}
                className="w-48 h-48"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 animate-pulse rounded" />
            )}
          </div>

          {/* Instructions */}
          <div className="text-center space-y-2">
            <h3 className="font-medium text-gray-900">Continue your session on mobile:</h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Scan the QR code with your mobile device</li>
              <li>2. You'll be automatically signed in</li>
              <li>3. Continue shopping on your mobile device</li>
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
                value={switchUrl}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                className="shrink-0"
                disabled={!switchUrl}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Note */}
          <div className="text-xs text-gray-500 text-center bg-blue-50 p-3 rounded-lg">
            <p>This link will expire in 5 minutes for security purposes.</p>
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