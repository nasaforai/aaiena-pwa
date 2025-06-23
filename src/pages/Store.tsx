import React from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Topbar from "@/components/ui/topbar";

export default function Store() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/fashion-lane");
  };

  const handleProductClick = () => {
    navigate("/product-details");
  };

  const ProductCard = ({ item }: { item: number }) => (
    <div>
      <div className="h-56 rounded-2xl bg-gray-200 relative overflow-hidden">
        <img
          src="/images/dress.jpg"
          alt={item.toString()}
          className="absolute left-0 top-0 object-cover"
        />
        <div className="absolute bottom-12 right-2 bg-white rounded-full p-2">
          <ShoppingBag className="w-4 h-4 text-gray-600" />
        </div>

        <div className="absolute left-0 bottom-0 bg-white/30 right-0 py-2 flex justify-center">
          <button
            onClick={handleProductClick}
            className="text-sm text-white hover:text-purple-600 transition-colors mb-1 block"
          >
            View Details
          </button>
        </div>
      </div>
      <div className="px-2 pt-1">
        <div className="text-xs flex gap-1 items-center">
          <span className="text-gray-400 line-through">₹1000</span>
          <span className="text-lg"> ₹500</span>
          <span className="text-gray-400">50% off</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white flex max-w-[480px] w-full flex-col overflow-hidden mx-auto min-h-screen">
      <Topbar handleBack={() => handleBack()} />

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
      <div className="mx-4 mb-4 bg-white shadow-lg shadow-purple-200 rounded-2xl text-white">
        <div className="bg-gradient-to-tl from-[#DBACFF] to-[#6A00FF] rounded-tl-2xl rounded-tr-2xl px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm opacity-90">Queue Status</p>
            <p className="text-sm">5 minutes</p>
          </div>
          <p className="text-2xl font-bold">Moderate</p>
        </div>

        <div className="p-4 flex flex-col gap-2">
          <div className="flex gap-4">
            <div className="flex flex-col shadow-lg rounded-xl bg-white p-4 gap-2 flex-1">
              <p className="text-gray-400 text-sm">Current Users</p>
              <p className="text-black text-2xl">4</p>
              <div className="flex items-center">
                <ArrowUp className="text-green-500 w-4 h-4" />
                <p className="text-green-500 text-sm">-18 min from usual</p>
              </div>{" "}
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

          <button className="w-full mt-3 text-purple-600 border-2 border-purple-600 py-3 rounded-xl text-lg font-medium">
            Try Virtually
          </button>
          <button className="w-full mt-2 bg-purple-100 text-black py-3 rounded-xl text-md font-medium">
            Log In To See Full Preview →
          </button>
        </div>
      </div>

      {/* Designer Picks section */}
      <div className="mx-4 mb-4 bg-purple-400 rounded-2xl p-4 text-white text-center">
        <h3 className="font-bold text-xl mb-2">DESIGNER PICKS</h3>
        <p className="text-sm opacity-90 mb-3">
          Exclusive styles handpicked by top designers.Discover
          unique,limited-edition fashion today!
        </p>
        <button className="bg-white text-black px-6 py-2 rounded-xl text-sm font-medium">
          Explore Now
        </button>
      </div>

      {/* Categories section */}
      <div className="px-4 mb-4">
        <h3 className="font-bold text-lg mb-3">Shop All</h3>
        <div className="overflow-y-hidden h-20">
          <div className="flex justify-between overflow-scroll flex-nowrap gap-6 pb-5 ">
            {[
              "Dress",
              "Jeans",
              "Trousers",
              "Tops",
              "Bags",
              "Dress",
              "Jeans",
              "Trousers",
              "Tops",
              "Bags",
            ].map((category, index) => (
              <div key={category} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-md mb-2 relative overflow-hidden">
                  <img
                    src="/images/dress.jpg"
                    alt={category}
                    className=" absolute left-0 top-0 object-cover"
                  />
                </div>
                <span className="text-xs text-gray-600">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4">
        {/* Discount Section */}
        <div className="bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl p-6 mb-4 text-white">
          <h3 className="text-xl font-bold mb-2">Discount</h3>
          <p className="text-sm mb-2">New Users Only</p>
        </div>

        {/* Product Carousels */}
        <div className="space-y-6">
          {/* Trending Now Carousel */}
          <div>
            <h3 className="font-bold text-lg mb-3">Trending Now</h3>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {[1, 2, 3, 4].map((item) => (
                  <CarouselItem key={item} className="pl-2 md:pl-4 basis-1/2">
                    <ProductCard item={item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" /> */}
              <CarouselDots />
            </Carousel>
          </div>

          {/* Recently Tried Carousel */}
          <div>
            <h3 className="font-bold text-lg mb-3">Recently Tried</h3>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {[1, 2, 3, 4].map((item) => (
                  <CarouselItem key={item} className="pl-2 md:pl-4 basis-1/2">
                    <ProductCard item={item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" /> */}
              <CarouselDots />
            </Carousel>
          </div>

          {/* Newest Carousel */}
          <div>
            <h3 className="font-bold text-lg mb-3">Newest</h3>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {[1, 2, 3, 4].map((item) => (
                  <CarouselItem key={item} className="pl-2 md:pl-4 basis-1/2">
                    <ProductCard item={item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" /> */}
              <CarouselDots />
            </Carousel>
          </div>
        </div>

        <div className="p-4 mt-6">
          <div className="overflow-y-hidden h-24">
            <div className="flex justify-between overflow-scroll flex-nowrap gap-6 pb-5 ">
              {[
                "Dress",
                "Jeans",
                "Trousers",
                "Tops",
                "Bags",
                "Dress",
                "Jeans",
                "Trousers",
                "Tops",
                "Bags",
              ].map((category, index) => (
                <div key={category} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 relative overflow-hidden">
                    <img
                      src="/images/dress.jpg"
                      alt={category}
                      className=" absolute left-0 top-0 object-cover"
                    />
                  </div>
                  <span className="text-xs text-gray-600">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What's New Section */}
        <div className="mt-6 bg-gradient-to-r from-pink-400 to-red-500 rounded-2xl p-6 text-white text-center">
          <h3 className="font-bold text-lg mb-2">WHAT'S NEW!</h3>
          <button className="bg-white text-pink-500 px-6 py-2 rounded-xl text-sm font-medium">
            See All
          </button>
        </div>

        {/* In Offer Carousel */}
        <div className="mt-6 mb-20">
          <h3 className="font-bold text-lg mb-3">In Offer</h3>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {[1, 2, 3, 4].map((item) => (
                <CarouselItem key={item} className="pl-2 md:pl-4 basis-1/2">
                  <ProductCard item={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselDots />

            {/* <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" /> */}
          </Carousel>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-[480px] w-full bg-white border-t border-gray-100 px-4 py-3">
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
            <MessageCircle className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Social</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Heart className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Wishlist</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
