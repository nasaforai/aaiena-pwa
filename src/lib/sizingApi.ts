/**
 * Sizing API service for connecting to the backend recommendation system
 */

// API Base URL - adjust as needed
//const API_BASE_URL = 'sizing-api-v2.ap-south-1.elasticbeanstalk.com';
import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL = 'http://sizing-api.duckdns.org';
//const API_BASE_URL = 'http://localhost:8000';

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
  weight: number;  // Required field
  hip: number;     // Required field
  shoulder: number; // Required field
  inseam: number;   // Required field (no longer optional)
  body_length: number; // Required field (no longer optional)
  body_type: string; // Required field
  gender: string;   // Required field (no longer optional)
  // Support for nested measurements in API response
  measurements?: {
    height: number;
    neck: number;
    chest: number;
    waist: number;
    Butt: number;
    weight: number;  // Required field
    hip: number;     // Required field
    shoulder: number; // Required field
    inseam: number;   // Required field
    body_length: number; // Required field
    body_type: string; // Required field
    gender: string;   // Required field
  };
  // Other API response fields
  categories?: string[];
  products?: Record<string, string[]>;
  recommendations?: any[];
  recommended_size?: string | null;
  fit_score?: number | null;
  alternative_sizes?: Record<string, number>;
  message?: string;
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
  recommended_size: string;
  fit_score: number;
  alternative_sizes: Record<string, number>;
  measurements: UserMeasurements;
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

export interface BodyMeasurementsFromUrlsRequest {
  front_image_url: string;
  side_image_url: string;
  height: number;           // Height in CM
  gender: 'M' | 'F';        // Gender
  weight?: number;          // Weight in KG (optional)
  body_type?: 'Triangle' | 'Diamond' | 'Inverted' | 'Rectangle' | 'Hourglass';  // For females (optional)
}

export interface BodyMeasurementsFromUrlsResponse {
  success: boolean;
  message: string;
  measurements: {
    height: number;          // CM
    neck: number;            // INCHES
    chest: number;           // INCHES
    waist: number;           // INCHES
    hip: number;             // INCHES
    Butt: number;            // INCHES (same as hip)
    shoulder_width: number;  // INCHES
    body_length: number;     // INCHES
    inseam: number;          // INCHES
    gender: string;          // "M" or "F"
    weight?: number;         // KG
    body_type?: string;      // Body type if provided
  };
  processed_images: {
    front: string;           // Path to processed front image
    side: string;            // Path to processed side image
  };
  annotated_images: {
    front: string;           // Path to annotated front image
    side: string;            // Path to annotated side image
  };
}

/**
 * Convert frontend profile data to backend UserMeasurements format
 */
function convertProfileToMeasurements(profile: any): UserMeasurements {
  // Get gender from profile, default to 'Male' if not available
  let gender = 'Male'; // default
  if (profile.gender) {
    const genderUpper = profile.gender.toUpperCase();
    if (genderUpper === 'FEMALE' || genderUpper === 'F') {
      gender = 'Female';
    } else if (genderUpper === 'MALE' || genderUpper === 'M') {
      gender = 'Male';
    }
  }

  // Map body type to one of the 5 accepted types: Triangle, Diamond, Inverted, Rectangle, Hourglass
  let bodyType = 'Rectangle'; // default
  if (profile.body_type) {
    const bodyTypeLower = profile.body_type.toLowerCase();
    if (bodyTypeLower === 'triangle') bodyType = 'Triangle';
    else if (bodyTypeLower === 'diamond') bodyType = 'Diamond';
    else if (bodyTypeLower === 'inverted') bodyType = 'Inverted';
    else if (bodyTypeLower === 'rectangle') bodyType = 'Rectangle';
    else if (bodyTypeLower === 'hourglass') bodyType = 'Hourglass';
    // If it's already properly capitalized, use it
    else if (['Triangle', 'Diamond', 'Inverted', 'Rectangle', 'Hourglass'].includes(profile.body_type)) {
      bodyType = profile.body_type;
    }
  }

  const measurements = {
    // Basic measurements with defaults
    height: profile.height_cm || profile.height || 170, // Default height if not available
    weight: profile.weight || 70, // Default weight
    neck: profile.neck_inches || profile.neck || 15,
    chest: profile.chest_inches || profile.chest || 38,
    waist: profile.waist_inches || profile.waist || 32,
    
    // Butt/hip measurements
    Butt: profile.hip_inches || profile.Butt || profile.hips || 40,
    hip: profile.hip_inches || profile.Butt || profile.hips || 40, // Same as Butt for consistency
    
    // Shoulder measurements
    shoulder: profile.shoulder_inches || profile.shoulder_width || 17,
    
    // Length measurements
    body_length: profile.body_length_inches || profile.body_length || 27,
    inseam: profile.inseam_inches || profile.inseam || 30,
    
    // Categorical fields - send as strings to backend
    body_type: bodyType, // One of: Triangle, Diamond, Inverted, Rectangle, Hourglass
    gender: gender // Either "Male" or "Female"
  };
  
  console.log("Converted measurements with all required fields:", measurements);
  return measurements;
}

/**
 * Extract body measurements from user's photos using the correct endpoint
 * This function uses /body-measurements-from-urls endpoint which returns measurements in inches
 */
export async function extractMeasurementsFromUrls(
  profile: any
): Promise<UserMeasurements> {
  try {
    // Check if user has photos in profile
    if (!profile.photos || profile.photos.length < 2) {
      throw new Error('User profile must have at least 2 photos (front and side view) for accurate measurements');
    }

    // Assume first photo is front view, second is side view
    const frontImageUrl = profile.photos[0];
    const sideImageUrl = profile.photos[1];

    // Validate required profile data
    if (!profile.height && !profile.height_cm) {
      throw new Error('User height is required for measurement extraction');
    }

    if (!profile.gender) {
      throw new Error('User gender is required for measurement extraction');
    }

    const heightValue = profile.height_cm || profile.height || 170;
    const weightValue = profile.weight || null;
    
    // Convert gender to backend format ("M" or "F")
    let gender = 'M'; // default
    if (profile.gender) {
      const genderUpper = profile.gender.toUpperCase();
      if (genderUpper === 'FEMALE' || genderUpper === 'F') {
        gender = 'F';
      } else if (genderUpper === 'MALE' || genderUpper === 'M') {
        gender = 'M';
      }
    }

    // Get body type for females (optional)
    let bodyType = null;
    if (gender === 'F' && profile.body_type) {
      const bodyTypeLower = profile.body_type.toLowerCase();
      if (bodyTypeLower === 'triangle') bodyType = 'Triangle';
      else if (bodyTypeLower === 'diamond') bodyType = 'Diamond';
      else if (bodyTypeLower === 'inverted') bodyType = 'Inverted';
      else if (bodyTypeLower === 'rectangle') bodyType = 'Rectangle';
      else if (bodyTypeLower === 'hourglass') bodyType = 'Hourglass';
      else if (['Triangle', 'Diamond', 'Inverted', 'Rectangle', 'Hourglass'].includes(profile.body_type)) {
        bodyType = profile.body_type;
      }
    }

    // Prepare request data for /body-measurements-from-urls endpoint
    const requestData: BodyMeasurementsFromUrlsRequest = {
      front_image_url: frontImageUrl,
      side_image_url: sideImageUrl,
      height: heightValue,  // in CM
      gender: gender as 'M' | 'F',  // "M" or "F"
      ...(weightValue !== null && weightValue !== undefined && { weight: weightValue }), // in KG
      ...(bodyType !== null && { body_type: bodyType as any }), // For females
    };

    console.log('Sending body measurements request via edge function:', requestData);

    const { data, error } = await supabase.functions.invoke('sizing-api-proxy', {
      body: {
        endpoint: '/body-measurements-from-urls',
        body: requestData,
        method: 'POST'
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Edge function failed: ${error.message}`);
    }

    const result: BodyMeasurementsFromUrlsResponse = data;
    console.log("Body measurements API response:", result);

    // Check if response was successful
    if (!result.success) {
      throw new Error(result.message || 'Failed to extract body measurements');
    }

    // Extract measurements from the response
    // The API returns measurements in inches (except height in CM)
    const measurements = result.measurements;
    
    // Convert to UserMeasurements format
    const userMeasurements: UserMeasurements = {
      height: measurements.height,          // CM
      neck: measurements.neck,              // INCHES
      chest: measurements.chest,            // INCHES
      waist: measurements.waist,            // INCHES
      hip: measurements.hip,                // INCHES
      Butt: measurements.Butt || measurements.hip,  // INCHES (same as hip)
      shoulder: measurements.shoulder_width, // INCHES
      body_length: measurements.body_length, // INCHES
      inseam: measurements.inseam,          // INCHES
      weight: measurements.weight || weightValue || 70,
      body_type: measurements.body_type || bodyType || (gender === 'F' ? 'Hourglass' : 'Rectangle'),
      gender: measurements.gender || gender,
    };

    console.log("Converted measurements (all in inches except height):", userMeasurements);
    
    return userMeasurements;
  } catch (error) {
    console.error("Error in extractMeasurementsFromUrls:", error);
    throw error;
  }
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
    
    // Format the request according to the API's expected structure
    const request = {
      user_measurements: measurements,
      product_category: category,
      size_chart: sizeChart
    };

    console.log("Sending try-virtually request via edge function:", JSON.stringify(request, null, 2));

    const { data, error } = await supabase.functions.invoke('sizing-api-proxy', {
      body: {
        endpoint: '/try-virtually',
        body: request,
        method: 'POST'
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Edge function failed: ${error.message}`);
    }

    const result = data;
    console.log("API response:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Error in tryVirtually:', error);
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
    
    // Format the request according to the API's expected structure
    const request = {
      user_measurements: measurements,
      product_category: category || 'T-shirt', // Default category
      size_chart: sizeChart
    };

    console.log("Sending recommendation request via edge function:", JSON.stringify(request, null, 2));

    const { data, error } = await supabase.functions.invoke('sizing-api-proxy', {
      body: {
        endpoint: '/recommendations',
        body: request,
        method: 'POST'
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Edge function failed: ${error.message}`);
    }

    const result = data;
    console.log("API response:", JSON.stringify(result, null, 2));
    return result;
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

/**
 * Get size recommendation for "My Size" feature.
 * This function is now deprecated in favor of the new two-step flow.
 * Kept for reference or potential fallback logic.
 */
export async function getMySizeRecommendation(
  profile: any,
  category?: string,
  sizeChart?: SizeChartMeasurement[]
): Promise<RecommendationResponse> {
  try {
    const hasPhotos = profile.photos && profile.photos.length >= 2;
    const hasRequiredData = profile.height && profile.gender;

    if (hasPhotos && hasRequiredData) {
      console.log('🎯 Using REAL image processing for My Size recommendation');
      // This is the old flow, we are moving away from it.
      // For now, it might still return a recommendation response, but the goal is to separate concerns.
      // return await tryVirtuallyWithImages(profile, category, sizeChart);
      throw new Error("tryVirtuallyWithImages is deprecated");
    } else {
      console.log('📝 Using profile measurements for My Size recommendation (or missing data)');
      return await tryVirtually(profile, category, sizeChart);
    }
  } catch (error) {
    console.error('Error getting My Size recommendation:', error);
    throw error;
  }
}