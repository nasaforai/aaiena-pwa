
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import Index from "./pages/Index";
import FashionLane from "./pages/FashionLane";
import Store from "./pages/Store";
import ProductDetails from "./pages/ProductDetails";
import WaitingRoom from "./pages/WaitingRoom";
import NotFound from "./pages/NotFound";
import QRCode from "./pages/QRCode";
import QRScanProduct from "./pages/QRScanProduct";
import QRScanVirtual from "./pages/QRScanVirtual";
import CodeInput from "./pages/CodeInput";
import ProductScan from "./pages/ProductScan";
import KioskProductScan from "./pages/KioskProductScan";
import WelcomeBack from "./pages/WelcomeBack";
import SignUp from "./pages/SignUp";
import MeasurementProfile from "./pages/MeasurementProfile";
import PhotoSource from "./pages/PhotoSource";
import ImageGuide from "./pages/ImageGuide";
import UpdateProfile from "./pages/UpdateProfile";
import FitProfile from "./pages/FitProfile";
import DeviceConnected from "./pages/DeviceConnected";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import Wishlist from "./pages/Wishlist";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/fashion-lane" element={<FashionLane />} />
          <Route path="/store" element={<Store />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/waiting-room" element={<WaitingRoom />} />
          <Route path="/qr-code" element={<QRCode />} />
          <Route path="/qr-scan-product" element={<QRScanProduct />} />
          <Route path="/qr-scan-virtual" element={<QRScanVirtual />} />
          <Route path="/code-input" element={<CodeInput />} />
          <Route path="/product-scan" element={<ProductScan />} />
          <Route path="/kiosk-product-scan" element={<KioskProductScan />} />
          <Route path="/welcome-back" element={<WelcomeBack />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/measurement-profile" element={<MeasurementProfile />} />
          <Route path="/photo-source" element={<PhotoSource />} />
          <Route path="/image-guide" element={<ImageGuide />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/fit-profile" element={<FitProfile />} />
          <Route path="/device-connected" element={<DeviceConnected />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/wishlist" element={<Wishlist />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <PWAInstallPrompt />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
