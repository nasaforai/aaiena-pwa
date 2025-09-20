import React, { createContext, useContext, useState } from 'react';

interface ProfileSidebarContextType {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const ProfileSidebarContext = createContext<ProfileSidebarContextType | undefined>(undefined);

export function ProfileSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <ProfileSidebarContext.Provider value={{
      isOpen,
      openSidebar,
      closeSidebar,
      toggleSidebar
    }}>
      {children}
    </ProfileSidebarContext.Provider>
  );
}

export function useProfileSidebar() {
  const context = useContext(ProfileSidebarContext);
  if (context === undefined) {
    throw new Error('useProfileSidebar must be used within a ProfileSidebarProvider');
  }
  return context;
}