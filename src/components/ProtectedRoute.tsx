import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, deviceType } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="bg-white flex lg:max-w-sm w-full flex-col mx-auto min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Device-aware redirect - mobile users go to sign-in, kiosk users go to signup-options
    const redirectPath = deviceType === 'mobile' ? '/sign-in' : '/signup-options';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}