import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  ShoppingBag,
  User,
  Heart,
  Home,
  MessageCircle,
  MoveUp,
  ArrowDown,
  ArrowUp,
  Camera,
} from "lucide-react";
import { createSearchParams, useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Topbar from "@/components/ui/topbar";
import ProductCard from "@/components/ProductCard";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProducts, useProductsByCategory } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useBanners } from "@/hooks/useBanners";

export default function Store() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [notifyToggle, setNotifyToggle] = useState(true);
  const isMobile = useIsMobile();

  // Fetch data from Supabase
  const { data: categories = [] } = useCategories();
  const { data: designerPicksBanner } = useBanners("designer_picks");
  const { data: discountBanners } = useBanners("discount");
  const { data: trendingProducts = [] } = useProductsByCategory("trending");
  const { data: newProducts = [] } = useProductsByCategory("new");
  const { data: offerProducts = [] } = useProductsByCategory("offer");

  const handleBack = () => {
    navigate("/fashion-lane");
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product-details?id=${productId}`);
  };

  const handleTry = () => {
    if (isLoggedIn) {
      navigate("/try-virtually");
    } else {
      navigate("/qr-code?back=sign-in");
    }
  };

  return (
    <div className="bg-white flex lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      <Topbar
        handleBack={() => handleBack()}
        showBack={isMobile ? false : true}
      />

      {isLoggedIn && (
        <h1 className="p-4 text-2xl font-medium">
          Hello, <br />
          Welcome Back John!
        </h1>
      )}

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative bg-gray-50">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent "
          />
        </div>
      </div>

      {/* Queue Status */}
      {!isMobile && (
        <div className="mx-4 mb-4 bg-white shadow-lg shadow-purple-200 rounded-2xl text-white">
          <div className="bg-gradient-to-tl from-[#DBACFF] to-[#6A00FF] rounded-tl-2xl rounded-tr-2xl px-4 py-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm opacity-90">Queue Status</p>
              <p className="text-sm">5 minutes</p>
            </div>
            <p className="text-2xl font-bold">Moderate</p>
          </div>

          {isLoggedIn && (
            <>
              <div className="rounded-xl m-4 bg-[#FFF3D3] border border-[#FFD25C] p-4 text-[#342601]">
                <div className="flex justify-between">
                  <p>Your turn coming up</p>
                  <p>4:00 min left</p>
                </div>
                <Progress
                  className="bg-[#FFDD82] [&>div]:bg-[#FFB900] [&>div]:rounded-full mt-4 mb-2"
                  value={20}
                />
                <p className="text-sm">
                  You have 5 minutes per session—switch to your phone to
                  continue smoothly.
                </p>

                <button className="py-4 w-full rounded-xl border border-[#FFB900] mt-8">
                  Switch to Mobile
                </button>
              </div>

              {/* Notification Toggle */}
              <div className="flex items-center justify-between mb-1 px-10 py-4 rounded-lg">
                <span className="font-medium text-gray-900 text-md">
                  Notify me when it's my turn
                </span>
                <button
                  onClick={() => setNotifyToggle(!notifyToggle)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifyToggle ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      notifyToggle ? "translate-x-7" : "translate-x-1"
                    }`}
                  ></div>
                </button>
              </div>
            </>
          )}

          <div className="p-4 flex flex-col gap-2">
            <div className="flex gap-4">
              <div className="flex flex-col shadow-lg rounded-xl bg-white p-4 gap-2 flex-1">
                <p className="text-gray-400 text-sm">Current Users</p>
                <p className="text-black text-2xl">4</p>
                <div className="flex items-center">
                  <ArrowUp className="text-green-500 w-4 h-4" />
                  <p className="text-green-500 text-sm">-18 min from usual</p>
                </div>
              </div>

              <div className="flex flex-col shadow-xl rounded-xl bg-white p-4 gap-2 flex-1">
                <p className="text-gray-400 text-sm">Average Wait</p>
                <p className="text-black text-2xl">5 min</p>
                <div className="flex items-center">
                  <ArrowDown className="text-red-500 w-4 h-4" />
                  <p className="text-red-500 text-sm">-18 min from usual</p>
                </div>
              </div>
            </div>

            <button
              className="w-full mt-3 text-purple-600 border-2 border-purple-600 py-3 rounded-xl text-lg font-medium"
              onClick={handleTry}
            >
              Try Virtually
            </button>
            {!isLoggedIn && (
              <button
                className="w-full mt-2 bg-purple-100 text-black py-3 rounded-xl text-md font-medium"
                onClick={() => {
                  navigate(`/qr-code?${createSearchParams({ back: "store" })}`);
                }}
              >
                Log In To See Full Preview →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Designer Picks section */}
      {designerPicksBanner && designerPicksBanner[0] && (
        <div 
          className="mx-4 mb-4 rounded-2xl py-10 px-4 text-white text-center"
          style={{ backgroundColor: designerPicksBanner[0].background_color }}
        >
          <h3 className="font-bold text-xl mb-2">{designerPicksBanner[0].title}</h3>
          <p className="text-sm opacity-90 mb-3">
            {designerPicksBanner[0].description}
          </p>
          <button className="bg-white text-black px-6 py-2 rounded-xl text-sm font-medium">
            {designerPicksBanner[0].button_text}
          </button>
        </div>
      )}

      {/* Categories section */}
      <div className="px-4 mb-4">
        <h3 className="font-bold text-lg mb-3">Shop All</h3>
        <div className="overflow-y-hidden h-20">
          <div className="flex justify-between overflow-scroll flex-nowrap gap-6 pb-5 ">
            {categories.map((category) => (
              <div key={category.id} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-md mb-2 relative overflow-hidden">
                  <img
                    src={category.image_url || "/images/dress.jpg"}
                    alt={category.name}
                    className="absolute left-0 top-0 w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-gray-600">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4">
        {/* Discount Section */}
        {/* <div className="bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl p-6 mb-4 text-white">
          <h3 className="text-xl font-bold mb-2">Discount</h3>
          <p className="text-sm mb-2">New Users Only</p>
        </div> */}

        {discountBanners && discountBanners.length > 0 && (
          <div className="mb-10">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {discountBanners.map((banner) => (
                  <CarouselItem key={banner.id} className="pl-2 md:pl-4 basis-1/2">
                    <div
                      className="relative h-52 rounded-xl"
                      style={{
                        backgroundImage: `url(${banner.image_url})`,
                        backgroundSize: "cover",
                        backgroundColor: banner.background_color,
                      }}
                    >
                      <div className="absolute bottom-2 left-0 w-full flex flex-col text-white items-center">
                        <p className="font-bold">{banner.title}</p>
                        {banner.subtitle && <p className="font-bold">{banner.subtitle}</p>}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots />
            </Carousel>
          </div>
        )}

        {/* Category Carousel */}
        <div className="h-10 overflow-y-hidden mt-10 mb-6">
          <div className="flex space-x-4 flex-nowrap pb-5 overflow-x-scroll">
            <div className="border border-gray-400 px-10 py-1 text-sm rounded-lg text-gray-600">
              All
            </div>
            <div className="border border-gray-400 px-10 py-1 text-sm rounded-lg text-gray-600">
              Women
            </div>
            <div className="border border-gray-400 px-10 py-1 text-sm rounded-lg text-gray-600">
              Men
            </div>
            <div className="border border-gray-400 px-10 py-1 text-sm rounded-lg text-gray-600">
              Kids
            </div>
            <div className="border border-gray-400 px-10 py-1 text-sm rounded-lg text-gray-600">
              All
            </div>
            <div className="border border-gray-400 px-10 py-1 text-sm rounded-lg text-gray-600">
              Man
            </div>
            <div className="border border-gray-400 px-10 py-1 text-sm rounded-lg text-gray-600">
              Women
            </div>
            <div className="border border-gray-400 px-10 py-1 text-sm rounded-lg text-gray-600">
              Kids
            </div>
          </div>
        </div>

        {/* Product Carousels */}
        <div className="space-y-6">
          {/* Trending Now Carousel */}
          {trendingProducts.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3">Trending Now</h3>
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {trendingProducts.map((product) => (
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
          )}

          {/* Recently Tried Carousel - showing new products as fallback */}
          {newProducts.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3">Recently Tried</h3>
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {newProducts.slice(0, 4).map((product) => (
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
          )}

          {/* Newest Carousel */}
          {newProducts.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3">Newest</h3>
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {newProducts.map((product) => (
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
          )}
        </div>

        <div className="p-4 mt-6">
          <div className="overflow-y-hidden h-24">
            <div className="flex justify-between overflow-scroll flex-nowrap gap-6 pb-5 ">
              {categories.map((category) => (
                <div key={category.id} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 relative overflow-hidden">
                    <img
                      src={category.image_url || "/images/dress.jpg"}
                      alt={category.name}
                      className="absolute left-0 top-0 w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-gray-600">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What's New Section */}
        <div className="mt-6 bg-gradient-to-r from-pink-400 to-red-500 rounded-2xl px-6 py-10 text-white text-center">
          <p className="my-4 text-md">SEE ALL LATEST</p>
          <h3 className="font-medium text-3xl mb-4">WHAT'S NEW!</h3>
          <button className="bg-white text-black px-10 py-2 rounded-xl text-sm font-medium">
            See All
          </button>
        </div>

        {/* In Offer Carousel */}
        {offerProducts.length > 0 && (
          <div className="mt-6 mb-20">
            <h3 className="font-bold text-lg mb-3">In Offer</h3>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {offerProducts.map((product) => (
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
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 lg:max-w-sm w-full bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex justify-around">
          <button className="flex flex-col items-center space-y-1">
            <Home className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <ShoppingBag className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Cart</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Camera className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Scan</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Heart className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Wishlist</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1"
            onClick={() => navigate('/profile')}
          >
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
