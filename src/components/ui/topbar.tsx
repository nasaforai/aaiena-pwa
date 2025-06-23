import { ArrowLeft, ShoppingCart } from "lucide-react";
import React from "react";

const Topbar = ({ handleBack }) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <button
          onClick={() => handleBack()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="text-red-600 text-2xl font-bold">H&M</div>
        <ShoppingCart className="w-6 h-6 text-gray-700" />
        {JSON.parse(localStorage.getItem("cartItems") || "[]").length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {JSON.parse(localStorage.getItem("cartItems") || "[]").reduce(
              (total: number, item: any) => total + item.quantity,
              0
            )}
          </span>
        )}
      </div>
    </>
  );
};

export default Topbar;
