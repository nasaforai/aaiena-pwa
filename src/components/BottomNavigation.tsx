import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, ShoppingBag, Camera, Heart, User } from "lucide-react";
import { useProfileSidebar } from "@/contexts/ProfileSidebarContext";

interface BottomNavigationProps {
  className?: string;
}

export default function BottomNavigation({ className = "" }: BottomNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { openSidebar, isOpen } = useProfileSidebar();

  const navItems = [
    { 
      icon: Home, 
      label: "Home", 
      path: "/store",
      onClick: () => navigate('/store')
    },
    { 
      icon: ShoppingBag, 
      label: "Cart", 
      path: "/cart",
      onClick: () => navigate('/cart')
    },
    { 
      icon: Camera, 
      label: "Scan", 
      path: "/product-scan",
      onClick: () => navigate('/product-scan')
    },
    { 
      icon: Heart, 
      label: "Wishlist", 
      path: "/wishlist",
      onClick: () => navigate('/wishlist')
    },
    { 
      icon: User, 
      label: "Profile", 
      path: "/profile",
      onClick: () => openSidebar()
    }
  ];

  return (
    <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 lg:max-w-sm w-full bg-white border-t border-gray-100 px-4 py-3 z-50 ${className}`}>
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === "/profile" ? isOpen : location.pathname === item.path;
          
          return (
            <button 
              key={item.path}
              className="flex flex-col items-center space-y-1 transition-all duration-200 hover:scale-105"
              onClick={item.onClick}
            >
              <Icon className={`w-5 h-5 transition-colors duration-200 ${
                isActive ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
              }`} />
              <span className={`text-xs transition-colors duration-200 ${
                isActive ? "text-purple-600 font-medium" : "text-gray-400"
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}