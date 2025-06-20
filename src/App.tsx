import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FashionLane from "./pages/FashionLane";
import Store from "./pages/Store";
import ProductDetails from "./pages/ProductDetails";
import WaitingRoom from "./pages/WaitingRoom";
import NotFound from "./pages/NotFound";
import QRCode from "./pages/QRCode";
import WelcomeBack from "./pages/WelcomeBack";
import SignUp from "./pages/SignUp";
import MeasurementProfile from "./pages/MeasurementProfile";
import PhotoSource from "./pages/PhotoSource";
import ImageGuide from "./pages/ImageGuide";
import UpdateProfile from "./pages/UpdateProfile";
import FitProfile from "./pages/FitProfile";
import DeviceConnected from "./pages/DeviceConnected";

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
          <Route path="/welcome-back" element={<WelcomeBack />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/measurement-profile" element={<MeasurementProfile />} />
          <Route path="/photo-source" element={<PhotoSource />} />
          <Route path="/image-guide" element={<ImageGuide />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/fit-profile" element={<FitProfile />} />
          <Route path="/device-connected" element={<DeviceConnected />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
