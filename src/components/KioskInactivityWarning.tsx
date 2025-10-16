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
      <AlertDialogContent className="w-[calc(100vw-2rem)] max-w-sm sm:max-w-md p-4 sm:p-6 rounded-lg max-h-[85vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-lg sm:text-xl leading-tight break-words">
            Automatic Logout Warning
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center mb-4">
            The kiosk will automatically log you out in{' '}
            <span className="font-bold text-destructive">
              {remainingSeconds} seconds
            </span>
          </AlertDialogDescription>
          <div className="space-y-3 sm:space-y-4 text-center">
            <Progress value={progress} className="w-full h-2 sm:h-3" />
            <p className="text-sm text-muted-foreground">
              This helps keep your account secure on shared devices.
            </p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full flex-col gap-2 sm:flex-row sm:gap-3">
          <AlertDialogCancel 
            onClick={onSignOut}
            className="w-full sm:w-auto text-sm sm:text-base whitespace-normal min-w-0"
          >
            Sign me out
          </AlertDialogCancel>
          <Button
            variant="outline"
            onClick={onSwitchToMobile}
            className="w-full sm:w-auto text-sm sm:text-base whitespace-normal min-w-0"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Switch to Mobile
          </Button>
          <AlertDialogAction 
            onClick={onKeepLoggedIn}
            className="w-full sm:w-auto text-sm sm:text-base whitespace-normal min-w-0"
          >
            Keep me logged in
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};