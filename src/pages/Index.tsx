import React, { useEffect, useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Index() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    localStorage.removeItem("isLoggedIn");
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    console.log(isMobile);
    navigate(isMobile ? "/sign-in" : "/fashion-lane");
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
