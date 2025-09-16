import React, { useEffect, useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Index() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Remove the localStorage clearing to preserve authentication
    // Users should remain logged in between sessions
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    navigate("/welcome");
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SplashScreen onComplete={handleSplashComplete} />
      </div>
    );
  }

  return null;
}
