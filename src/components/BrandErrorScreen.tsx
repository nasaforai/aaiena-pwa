import React from 'react';
import { AlertCircle } from 'lucide-react';

interface BrandErrorScreenProps {
  error: string;
}

export const BrandErrorScreen: React.FC<BrandErrorScreenProps> = ({ error }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="w-16 h-16 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Brand Configuration Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-sm text-left space-y-2">
          <p className="font-semibold text-foreground">Common causes:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Invalid subdomain or domain configuration</li>
            <li>Brand not found in database</li>
            <li>Brand has been deactivated</li>
          </ul>
        </div>

        <p className="text-sm text-muted-foreground">
          Please contact your system administrator or support team.
        </p>
      </div>
    </div>
  );
};
