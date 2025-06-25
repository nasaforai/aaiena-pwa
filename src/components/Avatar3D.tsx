
import React from "react";

export const Avatar3D = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
      {/* Placeholder for 3D Avatar */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Avatar Silhouette */}
        <div className="relative">
          <div className="w-48 h-80 bg-gradient-to-b from-purple-200 to-purple-300 rounded-full relative overflow-hidden">
            {/* Head */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-b from-purple-300 to-purple-400 rounded-full"></div>
            
            {/* Body */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-20 h-32 bg-gradient-to-b from-purple-400 to-purple-500 rounded-t-full"></div>
            
            {/* Arms */}
            <div className="absolute top-24 left-8 w-8 h-24 bg-gradient-to-b from-purple-400 to-purple-500 rounded-full"></div>
            <div className="absolute top-24 right-8 w-8 h-24 bg-gradient-to-b from-purple-400 to-purple-500 rounded-full"></div>
            
            {/* Legs */}
            <div className="absolute bottom-4 left-12 w-8 h-20 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
            <div className="absolute bottom-4 right-12 w-8 h-20 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
            
            {/* T-shirt overlay */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-24 h-20 bg-white/80 rounded-t-lg border-2 border-purple-300">
              <div className="w-full h-full bg-gradient-to-b from-white to-gray-100 rounded-t-lg"></div>
            </div>
          </div>
          
          {/* Floating elements to indicate 3D */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-300 rounded-full animate-pulse delay-150"></div>
          <div className="absolute top-1/2 -left-4 w-2 h-2 bg-purple-200 rounded-full animate-pulse delay-300"></div>
        </div>
        
        {/* 3D Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-xs font-medium text-purple-600">3D Avatar</span>
        </div>
      </div>
    </div>
  );
};
