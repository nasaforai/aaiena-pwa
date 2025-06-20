
import React, { useState, useEffect } from 'react';
import { ActionButton } from './ActionButton';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 max-w-sm mx-auto">
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-medium text-[#12002C]">Install App</h3>
          <p className="text-sm text-gray-600">
            Install this app on your device for a better experience!
          </p>
        </div>
        <div className="flex gap-2">
          <ActionButton onClick={handleInstallClick} className="flex-1 text-sm">
            Install
          </ActionButton>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};
