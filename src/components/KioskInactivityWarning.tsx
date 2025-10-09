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
      <AlertDialogContent className="w-[calc(100vw-2rem)] max-w-md p-6 sm:p-8 rounded-xl">
        <AlertDialogHeader className="space-y-6">
          <AlertDialogTitle className="text-center text-xl sm:text-2xl font-semibold">
            Still There?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-6">
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-foreground">
                {remainingSeconds}s
              </div>
              <Progress value={progress} className="w-full h-2" />
            </div>
            <p className="text-base text-muted-foreground leading-relaxed">
              Auto-logout in progress to keep your account secure
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-3 mt-6">
          <AlertDialogAction 
            onClick={onKeepLoggedIn}
            className="w-full text-base py-6"
          >
            Keep me logged in
          </AlertDialogAction>
          <Button
            variant="outline"
            onClick={onSwitchToMobile}
            className="w-full text-base py-6"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Switch to Mobile
          </Button>
          <AlertDialogCancel 
            onClick={onSignOut}
            className="w-full text-base py-6"
          >
            Sign out now
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};