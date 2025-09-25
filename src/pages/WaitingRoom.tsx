import React, { useState } from "react";
import { ArrowLeft, QrCode, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@/hooks/useNavigation";
import { RoomJoinDialog } from "@/components/RoomJoinDialog";
import Topbar from "@/components/ui/topbar";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import ProductCard from "@/components/ProductCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProducts } from "@/hooks/useProducts";
import BottomNavigation from "@/components/BottomNavigation";

export default function WaitingRoom() {
  const navigate = useNavigate();
  const { navigateBack } = useNavigation();
  const [notifyToggle, setNotifyToggle] = useState(true);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showVirtualDialog, setShowVirtualDialog] = useState(false);
  const isMobile = useIsMobile();
  
  const { data: allProducts = [] } = useProducts();

  const handleBack = () => {
    navigateBack("/product-details");
  };

  const handleJoinRoom = () => {
    setShowJoinDialog(true);
  };

  const handleVirtualTryOn = () => {
    setShowVirtualDialog(true);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product-details?id=${productId}`);
  };

  const rooms = [
    { id: "A1", status: "occupied", estimate: "3mins" },
    { id: "B1", status: "empty", estimate: "" },
    { id: "A2", status: "occupied", estimate: "3mins" },
    { id: "A2", status: "occupied", estimate: "3mins" },
    { id: "A3", status: "occupied", estimate: "3mins" },
    { id: "A3", status: "occupied", estimate: "3mins" },
  ];

  return (
    <>
      <div className="bg-white flex lg:lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen font-roboto">
        {/* Header */}
        <Topbar handleBack={handleBack} />

        {/* Main Purple Section */}
        <div className="mx-4 mb-4 bg-gradient-to-t from-[#FCEDFF] to-[#DCC0FF] rounded-2xl p-6 text-center">
          <h2 className="text-xl font-semibold mb-1 text-black">
            Secure Your Room In Seconds
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Join Quickly And Check Your Fittings
          </p>

          <div className="mx-auto mb-6 flex items-center justify-center">
            <img
              src="/images/shopping.png"
              alt="shopping illustraton"
              width={83}
              height={83}
            />
          </div>

          <button
            onClick={handleJoinRoom}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium mb-3"
          >
            Join Room
          </button>

          <button
            onClick={handleVirtualTryOn}
            className="text-xs px-1 py-2 rounded-lg text-gray-600 transition-opacity border border-gray-400 w-full"
          >
            Great News! Skip Waiting—Try Clothes Virtually Now
          </button>
        </div>

        {/* Live Queue Section */}
        <div className="px-4 mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <span className="font-medium text-gray-900">Live Queue</span>
            <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs font-medium">
              BUSY
            </span>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full relative">
                <img
                  src="/images/profile.png"
                  alt="profile pic"
                  className="absolute left-0 top-0 object-cover"
                />
              </div>
              <div className="w-8 h-8 rounded-full relative  border-2 border-white">
                <img
                  src="/images/profile.png"
                  alt="profile pic"
                  className="absolute left-0 top-0 object-cover"
                />
              </div>
              <div className="w-8 h-8 rounded-full relative  border-2 border-white">
                <img
                  src="/images/profile.png"
                  alt="profile pic"
                  className="absolute left-0 top-0 object-cover"
                />
              </div>
            </div>
            <span className="text-sm text-gray-600">
              3 people ahead of you checked in
            </span>
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-2 gap-6 my-10">
            {rooms.map((room, index) => (
              <div
                key={index}
                className={`flex items-center justify-between gap-2`}
              >
                <div
                  className={`w-14 h-12 rounded flex items-center justify-center text-white text-sm font-bold ${
                    room.status === "empty" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {room.id}
                </div>
                <div className="text-left flex-1">
                  <div
                    className={`text-sm font-medium ${
                      room.status === "empty"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {room.status === "empty" ? "Empty" : "Occupied"}
                  </div>
                  {room.estimate && (
                    <div className="text-[10px] text-gray-500">
                      Time estimate: {room.estimate}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Notification Toggle */}
          <div className="flex items-center justify-between mb-1 bg-purple-100 p-4 rounded-lg">
            <span className="font-medium text-gray-900 text-md">
              Notify me when it's my turn
            </span>
            <button
              onClick={() => setNotifyToggle(!notifyToggle)}
              className={`w-12 h-6 rounded-full transition-colors ${
                notifyToggle ? "bg-black" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  notifyToggle ? "translate-x-7" : "translate-x-1"
                }`}
              ></div>
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-6">
            We'll notify you 2 mins before it's your turn. Stay Close!
          </p>

          {/* QR Code Section */}
          {!isMobile && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4">
              <h3 className="font-semibold text-yellow-800 mb-1">
                Get Live Queue Updates on Your Phone
              </h3>
              <p className="text-sm text-yellow-700 mb-3">
                Scan the QR code using your phone to get real-time updates and
                alerts
              </p>

              {/* <div className="flex items-center"> */}
              <img
                src="/images/qr-code.png"
                alt="qr coe"
                width={80}
                height={80}
                className="mx-auto my-4"
              />
              {/* </div> */}

              <button className="w-full border border-yellow-400 text-yellow-800 py-2 rounded-xl mb-2 flex items-center justify-center gap-1">
                <QrCode className="w-4" /> <span> Connect My Phone</span>
              </button>

              <p className="text-xs text-yellow-700 text-center">
                Already connected? Check your phone for updates
              </p>
            </div>
          )}
          {/* Live Update Section */}
          <div className="border border-gray-300 rounded-lg px-3 py-4 mb-4">
            <span className="bg-green-200 text-black px-2 py-1 rounded text-xs">
              Live Update
            </span>
            <div className="mt-4 px-4 space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span className="text-sm">Now serving</span>
                <span className="text-sm">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Occupied rooms</span>
                <span className="text-sm">5/6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg. wait per person</span>
                <span className="text-sm">3 mins</span>
              </div>
            </div>
          </div>

          {/* While Waiting Section */}

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">
              While Waiting, Explore Popular Styles!
            </h3>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {allProducts.slice(0, 4).map((product) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2">
                    <ProductCard
                      product={product}
                      handleProductClick={handleProductClick}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots />
            </Carousel>
          </div>

          {/* More T-Shirts Section */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">
              More T-Shirts Section
            </h3>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {allProducts.slice(4, 8).map((product) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2">
                    <ProductCard
                      product={product}
                      handleProductClick={handleProductClick}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots />
            </Carousel>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <RoomJoinDialog
        isJoinDialogOpen={showJoinDialog}
        onClose={() => setShowJoinDialog(false)}
      />
      <RoomJoinDialog
        isVirtualDialogOpen={showVirtualDialog}
        onClose={() => setShowVirtualDialog(false)}
      />
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </>
  );
}
