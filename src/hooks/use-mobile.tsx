import * as React from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const detectMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();

      // Mobile detection patterns
      const mobilePatterns = [
        /android.*mobile/,
        /iphone/,
        /ipod/,
        /blackberry/,
        /windows phone/,
        /opera mini/,
        /mobile.*firefox/,
        /mobile.*chrome/,
        /mobile.*safari/,
      ];

      const isMobileDevice = mobilePatterns.some((pattern) =>
        pattern.test(userAgent)
      );
      setIsMobile(isMobileDevice);
    };

    detectMobile();
  }, []);

  return !!isMobile;
}

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = React.useState<DeviceType>("desktop");

  React.useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();

      // Mobile detection patterns
      const mobilePatterns = [
        /android.*mobile/,
        /iphone/,
        /ipod/,
        /blackberry/,
        /windows phone/,
        /opera mini/,
        /mobile.*firefox/,
        /mobile.*chrome/,
        /mobile.*safari/,
      ];

      // Tablet detection patterns
      const tabletPatterns = [
        /ipad/,
        /android(?!.*mobile)/,
        /tablet/,
        /playbook/,
        /kindle/,
      ];

      // Check if it's a mobile device
      const isMobile = mobilePatterns.some((pattern) =>
        pattern.test(userAgent)
      );

      // Check if it's a tablet device
      const isTablet = tabletPatterns.some((pattern) =>
        pattern.test(userAgent)
      );

      if (isMobile) {
        setDeviceType("mobile");
      } else if (isTablet) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    detectDevice();
    // Note: userAgent doesn't change on resize, so we don't need resize listener
  }, []);

  return deviceType;
}
