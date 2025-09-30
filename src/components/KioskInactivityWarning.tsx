import { useEffect, useState } from 'react';
import { Smartphone } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface KioskInactivityWarningProps {
  open: boolean;
  remainingSeconds: number;
  onKeepLoggedIn: () => void;
  onSignOut: () => void;
  onSwitchToMobile: () => void;
}

export const KioskInactivityWarning = ({
  open,
  remainingSeconds,
  onKeepLoggedIn,
  onSignOut,
  onSwitchToMobile,
}: KioskInactivityWarningProps) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Calculate progress (20 seconds total)
    const progressValue = (remainingSeconds / 20) * 100;
    setProgress(progressValue);
  }, [remainingSeconds]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl">
            Automatic Logout Warning
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-4">
            <div className="text-lg">
              The kiosk will automatically log you out in{' '}
              <span className="font-bold text-destructive">
                {remainingSeconds} seconds
              </span>
            </div>
            <Progress value={progress} className="w-full h-3" />
            <div className="text-sm text-muted-foreground">
              This helps keep your account secure on shared devices.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onSignOut}
            className="w-full sm:w-auto"
          >
            Sign me out
          </AlertDialogCancel>
          <Button
            variant="outline"
            onClick={onSwitchToMobile}
            className="w-full sm:w-auto"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Switch to Mobile
          </Button>
          <AlertDialogAction 
            onClick={onKeepLoggedIn}
            className="w-full sm:w-auto"
          >
            Keep me logged in
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};