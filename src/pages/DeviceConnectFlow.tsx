import React, { useEffect } from "react";
import { Check } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function DeviceConnectFlow() {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const backRoute = queryParams.get("back");
  localStorage.setItem("fromKiosk", "true");

  useEffect(() => {
    setTimeout(() => {
      navigate(backRoute ? `/${backRoute}` : "/sign-in");
    }, 1500);
  }, [navigate]);

  return (
    <div className="bg-white flex lg:lg:max-w-sm w-full flex-col justify-center items-center overflow-hidden mx-auto min-h-screen">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-between px-6">
        <div className="flex flex-col items-center justify-center mt-20 flex-1">
          <img
            src="/icons/connect.svg"
            alt="success icon"
            width={55}
            height={55}
            className="mb-4"
          />

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Device Connected!
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Continue Your Experience Seamlessly
          </p>
        </div>
      </div>
    </div>
  );
}
