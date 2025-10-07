import { ArrowLeft, ShoppingCart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBrand } from "@/contexts/BrandContext";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopbarProps {
  handleBack?: () => void;
  showBack?: boolean;
  showProfile?: boolean;
  onProfileClick?: () => void;
}

const Topbar = ({ handleBack, showBack = true, showProfile = false, onProfileClick = () => {} }: TopbarProps) => {
  const navigate = useNavigate();
  const { currentBrand } = useBrand();
  const { user } = useAuth();
  const { profile } = useProfile();

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };
  
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 relative z-50">
        {showProfile ? (
          <button
            onClick={onProfileClick}
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
              <AvatarFallback className="bg-purple-100 text-purple-700 font-medium">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </button>
        ) : showBack && (
          <button
            onClick={() => handleBack ? handleBack() : navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative z-50 pointer-events-auto"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}
        {currentBrand?.logo_url && (
          <img 
            src={currentBrand.logo_url} 
            alt={`${currentBrand.name} logo`} 
            width={40} 
            height={40} 
            className="object-contain"
          />
        )}
        <div className="flex items-center space-x-4">
          <div
            className="relative"
            onClick={() => {
              navigate("/cart");
            }}
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {JSON.parse(localStorage.getItem("cartItems") || "[]").length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {JSON.parse(localStorage.getItem("cartItems") || "[]").reduce(
                  (total: number, item: any) => total + item.quantity,
                  0
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
