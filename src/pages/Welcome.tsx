import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();
  const [supportsWebGL, setSupportsWebGL] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setSupportsWebGL(false);
    }
    
    // Simulate loading time for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleBrowseStore = () => {
    navigate('/store');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <p className="text-white text-lg">Loading Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]" />
      
      {/* 3D Model Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full max-w-2xl max-h-screen">
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative">
              {/* Animated Fashion Silhouette */}
              <div className="w-64 h-80 relative animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-400/30 via-pink-400/20 to-purple-600/30 rounded-full blur-2xl"></div>
                <img 
                  src="/images/shopping.png" 
                  alt="Fashion Model" 
                  className="relative z-10 w-full h-full object-contain opacity-90 animate-bounce"
                  style={{ animationDuration: '3s' }}
                />
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-400/50 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-pink-400/50 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-8 max-w-2xl">
          {/* Welcome Text */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                Fashion Lane
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light">
              Experience fashion in a whole new dimension
            </p>
          </div>

          {/* Call to Action */}
          <div className="pt-8">
            <Button
              onClick={handleBrowseStore}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 text-xl font-semibold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/25"
            >
              Browse the Store
            </Button>
          </div>

          {/* Subtle Animation Hint */}
          <div className="pt-4">
            <p className="text-sm text-gray-500 animate-pulse">
              Touch to continue your fashion journey
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-20 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-500" />
    </div>
  );
}