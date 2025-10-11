/**
 * Sizing API service for connecting to the backend recommendation system
 */

// API Base URL - adjust as needed
const API_BASE_URL = 'http://localhost:8000';

/**
 * Check if the sizing API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export interface UserMeasurements {
  height: number;
  neck: number;
  chest: number;
  waist: number;
  Butt: number;
  shoulder_width?: number;
  body_length?: number;
  inseam?: number;
}

export interface SizeChartMeasurement {
  size_label: string;
  chest_inches?: number;
  waist_inches?: number;
  shoulder_inches?: number;
  hips_inches?: number;
  length_inches?: number;
  inseam_inches?: number;
}

export interface SizeRecommendation {
  size: string;
  rating: string;
  score: number;
  product: string;
}

export interface RecommendationRequest {
  measurements: UserMeasurements;
  category?: string;
  size_chart?: SizeChartMeasurement[];
}

export interface RecommendationResponse {
  categories: string[];
  products: Record<string, string[]>;
  recommendations: SizeRecommendation[];
}

export interface ProcessImageRequest {
  front_image: File;
  side_image: File;
  height: number;
  weight: number;
  gender: string;
  preferred_size?: string;
  body_type?: string;
}

export interface ProcessImageResponse {
  success: boolean;
  message: string;
  measurements?: UserMeasurements;
  processed_images?: {
    front: string;
    side: string;
  };
}

/**
 * Convert frontend profile data to backend UserMeasurements format
 */
function convertProfileToMeasurements(profile: any): UserMeasurements {
  const measurements = {
    height: profile.height_cm || profile.height || 170, // Default height if not available
    neck: profile.neck_inches || profile.neck || 15,
    chest: profile.chest_inches || profile.chest || 38,
    waist: profile.waist_inches || profile.waist || 32,
    Butt: profile.hip_inches || profile.Butt || profile.hips || 40,
    shoulder_width: profile.shoulder_inches || profile.shoulder_width,
    body_length: profile.body_length,
    inseam: profile.inseam
  };
  
  return measurements;
}

/**
 * Try virtually - specific endpoint for virtual try-on functionality
 */
export async function tryVirtually(
  profile: any,
  category?: string,
  sizeChart?: SizeChartMeasurement[]
): Promise<RecommendationResponse> {
  try {
    const measurements = convertProfileToMeasurements(profile);
    
    const request: RecommendationRequest = {
      measurements,
      category: category || 'T-shirt',
      size_chart: sizeChart
    };

    const response = await fetch(`${API_BASE_URL}/try-virtually`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || 'Virtual try-on failed');
      } catch {
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Get size recommendations based on user profile and optional size chart
 */
export async function getSizeRecommendations(
  profile: any,
  sizeChart?: SizeChartMeasurement[],
  category?: string
): Promise<RecommendationResponse> {
  try {
    const measurements = convertProfileToMeasurements(profile);
    
    const request: RecommendationRequest = {
      measurements,
      category: category || 'T-shirt' // Default category
    };

    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get size recommendations');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting size recommendations:', error);
    throw error;
  }
}

/**
 * Process user images to extract measurements
 */
export async function processUserImages(
  frontImage: File,
  sideImage: File,
  height: number,
  weight: number,
  gender: string,
  preferredSize?: string,
  bodyType?: string
): Promise<ProcessImageResponse> {
  try {
    const formData = new FormData();
    formData.append('front_image', frontImage);
    formData.append('side_image', sideImage);
    formData.append('height', height.toString());
    formData.append('weight', weight.toString());
    formData.append('gender', gender);
    
    if (preferredSize) {
      formData.append('preferred_size', preferredSize);
    }
    
    if (bodyType) {
      formData.append('body_type', bodyType);
    }

    const response = await fetch(`${API_BASE_URL}/process-images`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to process images');
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing images:', error);
    throw error;
  }
}

/**
 * Get best fit for a specific product
 */
export async function getBestFitForProduct(
  profile: any,
  productId: string
): Promise<SizeRecommendation> {
  try {
    const measurements = convertProfileToMeasurements(profile);

    const response = await fetch(`${API_BASE_URL}/best-fit/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(measurements),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get best fit');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting best fit for product:', error);
    throw error;
  }
}

/**
 * Get stored measurements from the backend
 */
export async function getStoredMeasurements(): Promise<UserMeasurements> {
  try {
    const response = await fetch(`${API_BASE_URL}/measurements`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get stored measurements');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting stored measurements:', error);
    throw error;
  }
}