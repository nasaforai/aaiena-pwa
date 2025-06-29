
import React, { useState, useEffect } from "react";
import { ActionButton } from "./ActionButton";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if app is already installed (standalone mode)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    console.log("PWA Install Prompt - iOS:", iOS, "Standalone:", standalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!standalone) {
        setShowInstallPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      console.log("PWA was installed");
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // For iOS, show install prompt after a delay if not standalone
    if (iOS && !standalone) {
      const timer = setTimeout(() => {
        console.log("Showing iOS install prompt");
        setShowInstallPrompt(true);
      }, 3000);

      return () => {
        clearTimeout(timer);
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt && !isIOS) {
      console.log("Prompting install...");
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    console.log("Install prompt dismissed");
    setShowInstallPrompt(false);
  };

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 bg-white rounded-lg shadow-lg p-3 z-50 lg:max-w-sm mx-auto border">
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-sm font-medium text-[#12002C]">Install Aaiena</h3>
          <p className="text-xs text-gray-600">
            {isIOS
              ? "Add to home screen for better experience."
              : "Install for better experience!"}
          </p>
        </div>
        <div className="flex gap-2">
          {!isIOS && (
            <ActionButton
              onClick={handleInstallClick}
              className="flex-1 text-xs py-1 px-2"
            >
              Install
            </ActionButton>
          )}
          <button
            onClick={handleDismiss}
            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
          >
            {isIOS ? "Got it" : "Later"}
          </button>
        </div>
      </div>
    </div>
  );
};
