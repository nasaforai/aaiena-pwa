import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import React, { Suspense } from "react";
import ScrollToTop from "./components/ScrollToTop";
import { useDeviceType, useIsMobile } from "@/hooks/use-mobile";

// Lazy load all page components
const Index = React.lazy(() => import("./pages/Index"));
const FashionLane = React.lazy(() => import("./pages/FashionLane"));
const Store = React.lazy(() => import("./pages/Store"));
const ProductDetails = React.lazy(() => import("./pages/ProductDetails"));
const WaitingRoom = React.lazy(() => import("./pages/WaitingRoom"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const QRCode = React.lazy(() => import("./pages/QRCode"));
const QRScanProduct = React.lazy(() => import("./pages/QRScanProduct"));
const QRScanVirtual = React.lazy(() => import("./pages/QRScanVirtual"));
const CodeInput = React.lazy(() => import("./pages/CodeInput"));
const ProductScan = React.lazy(() => import("./pages/ProductScan"));
const KioskProductScan = React.lazy(() => import("./pages/KioskProductScan"));
const SignIn = React.lazy(() => import("./pages/SignIn"));
const SignUp = React.lazy(() => import("./pages/SignUp"));
const MeasurementProfile = React.lazy(
  () => import("./pages/MeasurementProfile")
);
const PhotoSource = React.lazy(() => import("./pages/PhotoSource"));
const ImageGuide = React.lazy(() => import("./pages/ImageGuide"));
const UpdateProfile = React.lazy(() => import("./pages/UpdateProfile"));
const FitProfile = React.lazy(() => import("./pages/FitProfile"));
const DeviceConnected = React.lazy(() => import("./pages/DeviceConnected"));
const DeviceConnectFlow = React.lazy(() => import("./pages/DeviceConnectFlow"));

const Cart = React.lazy(() => import("./pages/Cart"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const Payment = React.lazy(() => import("./pages/Payment"));
const OrderSuccess = React.lazy(() => import("./pages/OrderSuccess"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const TryVirtually = React.lazy(() => import("./pages/TryVirtually"));
const Welcome = React.lazy(() => import("./pages/Welcome"));
const Profile = React.lazy(() => import("./pages/Profile"));

const App = () => {
  return (
    <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/fashion-lane" element={<FashionLane />} />
              <Route path="/store" element={<Store />} />
              <Route path="/product-details" element={<ProductDetails />} />
              <Route path="/waiting-room" element={<WaitingRoom />} />
              <Route path="/qr-code" element={<QRCode />} />
              <Route path="/qr-scan-product" element={<QRScanProduct />} />
              <Route path="/qr-scan-virtual" element={<QRScanVirtual />} />
              <Route path="/code-input" element={<CodeInput />} />
              <Route path="/product-scan" element={<ProductScan />} />
              <Route
                path="/kiosk-product-scan"
                element={<KioskProductScan />}
              />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route
                path="/measurement-profile"
                element={<MeasurementProfile />}
              />
              <Route path="/photo-source" element={<PhotoSource />} />
              <Route path="/image-guide" element={<ImageGuide />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/fit-profile" element={<FitProfile />} />
              <Route path="/device-connected" element={<DeviceConnected />} />
              <Route
                path="/device-connect-flow"
                element={<DeviceConnectFlow />}
              />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/try-virtually" element={<TryVirtually />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <PWAInstallPrompt />
        </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
