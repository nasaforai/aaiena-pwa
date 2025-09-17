import React from "react";
import { Copy, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MobileSignupQRDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSignupQRDialog({ open, onClose }: MobileSignupQRDialogProps) {
  const { toast } = useToast();
  
  const signupUrl = `${window.location.origin}/sign-up`;

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
            <img 
              src="/images/qr-code.png" 
              alt="QR Code for Mobile Signup" 
              className="w-48 h-48"
            />
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
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Close Button */}
          <Button
            variant="secondary"
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