import QRCode from 'qrcode';

export interface QRCodeOptions {
  size?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

/**
 * Utility class for generating QR codes internally without external dependencies
 */
export class QRGenerator {
  /**
   * Generate QR code as data URL (base64 image)
   */
  static async generateDataURL(
    text: string, 
    options: QRCodeOptions = {}
  ): Promise<string> {
    const defaultOptions = {
      width: options.size || 200,
      margin: options.margin || 2,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#FFFFFF',
      },
      errorCorrectionLevel: options.errorCorrectionLevel || 'M' as const,
    };

    try {
      return await QRCode.toDataURL(text, defaultOptions);
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code as SVG string
   */
  static async generateSVG(
    text: string, 
    options: QRCodeOptions = {}
  ): Promise<string> {
    const defaultOptions = {
      width: options.size || 200,
      margin: options.margin || 2,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#FFFFFF',
      },
      errorCorrectionLevel: options.errorCorrectionLevel || 'M' as const,
    };

    try {
      return await QRCode.toString(text, { 
        ...defaultOptions, 
        type: 'svg' 
      });
    } catch (error) {
      console.error('Error generating QR code SVG:', error);
      throw new Error('Failed to generate QR code SVG');
    }
  }

  /**
   * Generate QR code for signup URL with brand styling
   */
  static async generateSignupQR(
    signupUrl: string,
    size: number = 200
  ): Promise<string> {
    return await this.generateDataURL(signupUrl, {
      size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M'
    });
  }

  /**
   * Generate QR code with custom brand colors
   */
  static async generateBrandedQR(
    text: string,
    primaryColor: string = '#8B5CF6',
    backgroundColor: string = '#FFFFFF',
    size: number = 200
  ): Promise<string> {
    return await this.generateDataURL(text, {
      size,
      margin: 2,
      color: {
        dark: primaryColor,
        light: backgroundColor,
      },
      errorCorrectionLevel: 'M'
    });
  }

  /**
   * Validate URL before generating QR code
   */
  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate QR code with error handling and validation
   */
  static async generateSafe(
    text: string,
    options: QRCodeOptions = {}
  ): Promise<string | null> {
    // Validate URL if text looks like a URL
    if (text.startsWith('http') && !this.validateUrl(text)) {
      console.error('Invalid URL provided for QR generation:', text);
      return null;
    }

    try {
      return await this.generateDataURL(text, options);
    } catch (error) {
      console.error('Safe QR generation failed:', error);
      return null;
    }
  }
}