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
    // Calculate progress (15 seconds total)
    const progressValue = (remainingSeconds / 15) * 100;
    setProgress(progressValue);
  }, [remainingSeconds]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-[90vw] sm:max-w-md mx-4">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-lg sm:text-xl">
            Automatic Logout Warning
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-4">
            <div className="text-base sm:text-lg">
              The kiosk will automatically log you out in{' '}
              <span className="font-bold text-destructive">
                {remainingSeconds} seconds
              </span>
            </div>
            <Progress value={progress} className="w-full h-2 sm:h-3" />
            <div className="text-sm text-muted-foreground">
              This helps keep your account secure on shared devices.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:gap-3">
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