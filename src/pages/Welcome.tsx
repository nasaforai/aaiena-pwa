import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { EnhancedFashionScene } from "@/components/FashionIntro3D";
import { useBrand } from "@/contexts/BrandContext";
import { useDeviceType } from "@/hooks/use-mobile";

const Welcome = () => {
  const navigate = useNavigate();
  const { currentBrand } = useBrand();
  const deviceType = useDeviceType();
  const [introComplete, setIntroComplete] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [webGLError, setWebGLError] = useState(false);

  // Device-specific timing
  const isMobile = deviceType === "mobile";
  const isKiosk = deviceType === "desktop";
  const introTime = isMobile ? 4000 : 6000;
  const buttonTime = isMobile ? 4300 : 6500;

  useEffect(() => {
    const introTimer = setTimeout(() => {
      setIntroComplete(true);
    }, introTime);

    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, buttonTime);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(buttonTimer);
    };
  }, [introTime, buttonTime]);

  const brandLogoUrl = currentBrand?.logo_url || "/images/ucb-logo.jpg";

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: 'hsl(264, 73%, 9%)' }}>
      {/* Fullscreen 3D Canvas with error handling */}
      {!webGLError && (
        <div className="absolute inset-0">
          <Canvas 
            shadows 
            gl={{ antialias: true, alpha: false }}
            onCreated={() => {
              // WebGL initialized successfully
            }}
            onError={(error) => {
              console.warn('WebGL context error:', error);
              setWebGLError(true);
            }}
          >
            <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={50} />
            
            <EnhancedFashionScene />

            {/* Environment for reflections */}
            <Environment preset="city" />
          </Canvas>
        </div>
      )}
      
      {/* Fallback gradient background when WebGL fails */}
      {webGLError && (
        <div className="absolute inset-0" style={{ 
          background: 'radial-gradient(ellipse at center, hsl(264, 73%, 15%) 0%, hsl(264, 73%, 9%) 50%, hsl(264, 73%, 5%) 100%)'
        }} />
      )}

      {/* Gradient overlays for better text visibility - vibrant purple tones */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(32, 0, 77, 0.5), transparent, rgba(14, 0, 34, 0.6))' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(106, 13, 255, 0.15) 100%)' }} />
      
      {/* Purple ambient light overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(106, 13, 255, 0.3) 0%, transparent 60%)' }} />

      {/* Brand text - appears during intro */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className={`text-center transition-all duration-2000 ${
            introComplete ? 'opacity-0 scale-150' : 'opacity-100 scale-100'
          }`}
        >
          <div className="space-y-10">
            {/* Presenting Text */}
            <div className="mb-2 md:mb-4">
              <span className={`font-montserrat font-light tracking-tight ${
                isMobile ? 'text-[10px]' : isKiosk ? 'text-base' : 'text-xs md:text-sm'
              }`} style={{ 
                color: '#FFFFFF',
                textShadow: '0 0 30px rgba(106, 13, 255, 1), 0 0 50px rgba(187, 144, 255, 0.6), 0 4px 15px rgba(0, 0, 0, 0.9)'
              }}>
                Sankshit Group Presenting
              </span>
            </div>

            {/* Brand Logo */}
            <div className="flex justify-center my-4 md:my-8">
              <img 
                src={brandLogoUrl} 
                alt="Brand Logo" 
                className={`w-auto object-contain ${
                  isMobile ? 'h-32' : isKiosk ? 'h-96' : 'h-48 md:h-80 lg:h-96'
                }`}
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(106, 13, 255, 1)) drop-shadow(0 0 80px rgba(187, 144, 255, 0.8)) drop-shadow(0 6px 20px rgba(0, 0, 0, 0.9))'
                }}
              />
            </div>

            {/* Tagline */}
            <p className={`font-montserrat font-bold tracking-tight ${
              isMobile ? 'text-lg' : isKiosk ? 'text-5xl' : 'text-2xl md:text-3xl lg:text-4xl'
            }`} style={{ 
              color: '#FFFFFF',
              textShadow: '0 0 35px rgba(187, 144, 255, 1), 0 0 60px rgba(106, 13, 255, 0.7), 0 4px 18px rgba(0, 0, 0, 0.9)'
            }}>
              Where Style Meets Innovation
            </p>

            {/* Event Details */}
            <div className={`pt-4 md:pt-8 ${isMobile ? 'mt-6' : 'mt-12'}`} style={{ borderTop: '2px solid rgba(187, 144, 255, 0.3)' }}>
              <div className={`inline-flex items-center mb-2 md:mb-4 ${isMobile ? 'gap-2' : 'gap-3'}`}>
                <div className={`rounded-full animate-pulse ${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} style={{ backgroundColor: '#6A0DFF', boxShadow: '0 0 20px #6A0DFF' }} />
                <span className={`font-montserrat font-bold tracking-tight ${
                  isMobile ? 'text-xs' : isKiosk ? 'text-xl' : 'text-sm md:text-base'
                }`} style={{ 
                  color: '#FFFFFF', 
                  textShadow: '0 0 30px rgba(106, 13, 255, 1), 0 4px 15px rgba(0, 0, 0, 0.9)'
                }}>GITEX 2025</span>
              </div>
              <p className={`font-montserrat font-bold tracking-tight ${
                isMobile ? 'text-base' : isKiosk ? 'text-3xl' : 'text-xl md:text-2xl'
              }`} style={{ 
                color: '#FFFFFF',
                textShadow: '0 0 30px rgba(187, 144, 255, 1), 0 0 50px rgba(106, 13, 255, 0.7), 0 4px 15px rgba(0, 0, 0, 0.9)'
              }}>
                EXCLUSIVE LUXURY FASHION EVENT
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enter button - appears after intro */}
      {showButton && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-fade-in px-4">
          <div className={`text-center pointer-events-auto ${isMobile ? 'space-y-4' : isKiosk ? 'space-y-12' : 'space-y-8'}`}>
            {/* Welcome message - no card background */}
            <div className={isMobile ? 'space-y-4' : isKiosk ? 'space-y-10' : 'space-y-8'}>
              {/* Event Welcome */}
              <div className={isMobile ? 'space-y-2' : 'space-y-4'}>
                <div className={`inline-flex items-center mb-2 ${isMobile ? 'gap-1.5' : 'gap-2 mb-4'}`}>
                  <div className={`rounded-full animate-pulse ${isMobile ? 'w-1 h-1' : 'w-1.5 h-1.5'}`} style={{ backgroundColor: '#6A0DFF', boxShadow: '0 0 15px #6A0DFF' }} />
                  <span className={`font-montserrat font-bold tracking-tight ${
                    isMobile ? 'text-xs' : isKiosk ? 'text-lg' : 'text-sm'
                  }`} style={{ 
                    color: '#FFFFFF', 
                    textShadow: '0 0 25px rgba(106, 13, 255, 1), 0 3px 12px rgba(0, 0, 0, 0.9)' 
                  }}>LIVE AT GITEX</span>
                </div>
                
                <h3 className={`font-montserrat font-black tracking-tight ${
                  isMobile ? 'text-xl' : isKiosk ? 'text-5xl' : 'text-2xl md:text-3xl'
                }`} style={{ 
                  color: '#FFFFFF',
                  textShadow: '0 0 60px rgba(106, 13, 255, 1), 0 0 90px rgba(187, 144, 255, 0.9), 0 4px 25px rgba(0, 0, 0, 0.9)'
                }}>
                  WELCOME TO GITEX EVENT
                </h3>
                
                <h2 className={`font-montserrat font-bold tracking-tight ${
                  isMobile ? 'text-sm' : isKiosk ? 'text-2xl' : 'text-lg md:text-xl'
                }`} style={{ 
                  color: '#FFFFFF',
                  textShadow: '0 0 40px rgba(187, 144, 255, 1), 0 0 60px rgba(106, 13, 255, 0.8), 0 4px 20px rgba(0, 0, 0, 0.9)'
                }}>
                  We are
                </h2>
                <h3 className={`font-montserrat font-black tracking-tight ${
                  isMobile ? 'text-xl' : isKiosk ? 'text-5xl' : 'text-2xl md:text-3xl'
                }`} style={{ 
                  color: '#FFFFFF',
                  textShadow: '0 0 60px rgba(106, 13, 255, 1), 0 0 90px rgba(187, 144, 255, 0.9), 0 4px 25px rgba(0, 0, 0, 0.9)'
                }}>
                  SANKSHIT GROUP PRESENTING
                </h3>
              </div>
              
              {/* Brand Logo Section */}
              <div className={`space-y-4 ${isMobile ? 'py-3' : 'py-6 space-y-6'}`}>
                {/* Brand Logo */}
                <div className={`flex justify-center ${isMobile ? 'pt-2' : 'pt-4'}`}>
                  <img 
                    src={brandLogoUrl} 
                    alt="Brand Logo" 
                    className={`w-auto object-contain ${
                      isMobile ? 'h-24' : isKiosk ? 'h-80' : 'h-40 md:h-52 lg:h-64'
                    }`}
                    style={{
                      filter: 'drop-shadow(0 0 35px rgba(106, 13, 255, 0.9)) drop-shadow(0 0 70px rgba(187, 144, 255, 0.7)) drop-shadow(0 5px 18px rgba(0, 0, 0, 0.9))'
                    }}
                  />
                </div>
              </div>
              
              <p className={`font-montserrat font-bold tracking-tight mx-auto leading-relaxed ${
                isMobile ? 'text-sm max-w-xs' : isKiosk ? 'text-2xl max-w-4xl' : 'text-lg md:text-xl max-w-2xl'
              }`} style={{ 
                color: '#FFFFFF',
                textShadow: '0 0 35px rgba(246, 242, 255, 1), 0 4px 25px rgba(106, 13, 255, 0.7), 0 0 50px rgba(222, 196, 255, 0.6)'
              }}>
                Experience the future of fashion technology
              </p>
            </div>

            {/* Enter button with purple glow effect */}
            <div className="relative group">
              {/* Purple glow effect */}
              <div className="absolute inset-0 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity" style={{ backgroundColor: 'rgba(106, 13, 255, 0.5)' }} />
              
              <Button
                size="lg"
                onClick={() => navigate("/store")}
                className={`relative font-montserrat font-black tracking-tight transition-all duration-300 hover:scale-105 rounded-full shadow-2xl ${
                  isMobile ? 'text-base px-8 py-6' : isKiosk ? 'text-3xl px-20 py-10 min-h-[80px]' : 'text-xl px-16 py-8'
                }`}
                style={{
                  background: 'linear-gradient(135deg, #6A0DFF 0%, #BB90FF 100%)',
                  color: '#FFFFFF',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 0 40px rgba(106, 13, 255, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 2px 8px rgba(0, 0, 0, 0.8)'
                }}
              >
                ENTER SHOWROOM
                
                {/* Shine effect */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-full" style={{ 
                  background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), transparent)'
                }} />
              </Button>
            </div>

            {/* Scroll hint - purple accent */}
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, transparent, rgba(187, 144, 255, 0.6), transparent)' }} />
              <p className="font-montserrat text-xs font-bold tracking-tight" style={{ 
                color: '#FFFFFF',
                textShadow: '0 0 20px rgba(222, 196, 255, 0.8)'
              }}>SCROLL</p>
            </div>
          </div>
        </div>
      )}

      {/* Film grain overlay for cinematic effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] animate-grain" />
      </div>
    </div>
  );
};

export default Welcome;
