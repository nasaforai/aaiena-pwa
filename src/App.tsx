import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileSidebarProvider } from "@/contexts/ProfileSidebarContext";
import { ProfileSidebar } from "@/components/ProfileSidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

// Direct imports for main navigation pages (no lazy loading)
import Store from "./pages/Store";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";  
import Profile from "./pages/Profile";
import Welcome from "./pages/Welcome";

// Lazy load other pages
const Index = React.lazy(() => import("./pages/Index"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const SignIn = React.lazy(() => import("./pages/SignIn"));
const SignUp = React.lazy(() => import("./pages/SignUp"));
const SignupOptions = React.lazy(() => import("./pages/SignupOptions"));
const MeasurementProfile = React.lazy(() => import("./pages/MeasurementProfile"));
const DeviceConnected = React.lazy(() => import("./pages/DeviceConnected"));
const FitProfile = React.lazy(() => import("./pages/FitProfile"));
const OrderSuccess = React.lazy(() => import("./pages/OrderSuccess"));
const PhotoSource = React.lazy(() => import("./pages/PhotoSource"));
const UpdateProfile = React.lazy(() => import("./pages/UpdateProfile"));
const ImageGuide = React.lazy(() => import("./pages/ImageGuide"));
const ProductDetails = React.lazy(() => import("./pages/ProductDetails"));
const QRCode = React.lazy(() => import("./pages/QRCode"));
const FashionLane = React.lazy(() => import("./pages/FashionLane"));
const Payment = React.lazy(() => import("./pages/Payment"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const TryVirtually = React.lazy(() => import("./pages/TryVirtually"));
const QRScanVirtual = React.lazy(() => import("./pages/QRScanVirtual"));
const QRScanProduct = React.lazy(() => import("./pages/QRScanProduct"));
const ProductScan = React.lazy(() => import("./pages/ProductScan"));
const KioskProductScan = React.lazy(() => import("./pages/KioskProductScan"));
const DeviceConnectFlow = React.lazy(() => import("./pages/DeviceConnectFlow"));
const CodeInput = React.lazy(() => import("./pages/CodeInput"));
const WaitingRoom = React.lazy(() => import("./pages/WaitingRoom"));

const queryClient = new QueryClient();

// Better loading fallback
const LoadingFallback = () => (
  <div className="bg-white flex lg:max-w-sm w-full flex-col mx-auto min-h-screen items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
      </div>
      <p className="text-gray-600 text-lg font-medium animate-pulse">Loading...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProfileSidebarProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
                <ScrollToTop />
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/signup-options" element={<SignupOptions />} />
                
                {/* Public routes */}
                <Route path="/store" element={<Store />} />
                <Route path="/qr-code" element={<QRCode />} />
                <Route path="/fashion-lane" element={<FashionLane />} />
                <Route path="/product-details" element={<ProductDetails />} />
                <Route path="/qr-scan-virtual" element={<QRScanVirtual />} />
                <Route path="/qr-scan-product" element={<QRScanProduct />} />
                <Route path="/product-scan" element={<ProductScan />} />
                <Route path="/kiosk-product-scan" element={<KioskProductScan />} />
                <Route path="/device-connect-flow" element={<DeviceConnectFlow />} />
                <Route path="/code-input" element={<CodeInput />} />
                <Route path="/waiting-room" element={<WaitingRoom />} />
                
                {/* Protected routes */}
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/measurement-profile" element={<ProtectedRoute><MeasurementProfile /></ProtectedRoute>} />
                <Route path="/device-connected" element={<ProtectedRoute><DeviceConnected /></ProtectedRoute>} />
                <Route path="/fit-profile" element={<ProtectedRoute><FitProfile /></ProtectedRoute>} />
                <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                <Route path="/photo-source" element={<ProtectedRoute><PhotoSource /></ProtectedRoute>} />
                <Route path="/update-profile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
                <Route path="/image-guide" element={<ProtectedRoute><ImageGuide /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/try-virtually" element={<ProtectedRoute><TryVirtually /></ProtectedRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <PWAInstallPrompt />
            <ProfileSidebar />
          </BrowserRouter>
        </TooltipProvider>
      </ProfileSidebarProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
