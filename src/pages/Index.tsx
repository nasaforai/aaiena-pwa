import React, { useEffect, useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    localStorage.removeItem("isLoggedIn");
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    navigate("/fashion-lane");
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
