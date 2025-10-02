import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBrand } from "@/contexts/BrandContext";

const Topbar = ({ handleBack, showBack = true }) => {
  const navigate = useNavigate();
  const { currentBrand } = useBrand();
  
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        {showBack && (
          <button
            onClick={() => handleBack()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
