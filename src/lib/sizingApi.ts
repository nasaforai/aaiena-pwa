/**
 * Sizing API service for connecting to the backend recommendation system
 */

// API Base URL - adjust as needed
//const API_BASE_URL = 'sizing-api-v2.ap-south-1.elasticbeanstalk.com';
const API_BASE_URL = 'http://sizing-api.duckdns.org';

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

/**
 * Convert frontend profile data to backend UserMeasurements format
 */
function convertProfileToMeasurements(profile: any): UserMeasurements {
  // Get gender from profile, default to 'M' if not available
  let gender = 'M'; // default
  if (profile.gender) {
    const genderUpper = profile.gender.toUpperCase();
    if (genderUpper === 'FEMALE' || genderUpper === 'F') {
      gender = 'F';
    } else if (genderUpper === 'MALE' || genderUpper === 'M') {
      gender = 'M';
    }
  }

  // Default body type based on gender
  const defaultBodyType = gender === 'F' ? 'hourglass' : 'athletic';

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
    
    // Categorical fields
    body_type: profile.body_type || defaultBodyType,
    gender: gender
  };
  
  console.log("Converted measurements with all required fields:", measurements);
  return measurements;
}

/**
 * Try virtually with real image processing - uses user's photos from profile
 * This function should now only be used for extracting measurements.
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
    
    // Convert gender to backend format (M/F)
    let gender = 'M'; // default
    if (profile.gender) {
      const genderUpper = profile.gender.toUpperCase();
      if (genderUpper === 'FEMALE' || genderUpper === 'F') {
        gender = 'F';
      } else if (genderUpper === 'MALE' || genderUpper === 'M') {
        gender = 'M';
      }
    }

    // Prepare request data as JSON body
    const requestData = {
      front_image_url: frontImageUrl,
      side_image_url: sideImageUrl,
      height_cm: heightValue,
      weight_kg: weightValue,
      gender: gender,
      preferred_size: null,
      body_type: null
    };

    console.log('Sending try virtually request with images:', requestData);

    const response = await fetch(`${API_BASE_URL}/try-virtually-with-image-urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || 'Virtual try-on with images failed');
      } catch {
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
    }

    const result = await response.json();
    console.log("Raw API response:", result);

    // The API response contains measurements and other data
    // We need to make sure it conforms to our UserMeasurements interface
    const apiResponse = result as UserMeasurements;
    
    // If the measurements are not at the top level, ensure they're accessible
    if (apiResponse.measurements) {
      console.log("API response contains nested measurements");
      
      // Ensure all required fields are present in the nested measurements
      if (!apiResponse.measurements.weight) apiResponse.measurements.weight = 70;
      if (!apiResponse.measurements.hip) apiResponse.measurements.hip = apiResponse.measurements.Butt || 40;
      if (!apiResponse.measurements.shoulder) apiResponse.measurements.shoulder = (apiResponse.measurements as any).shoulder_width || 17;
      if (!apiResponse.measurements.body_type) apiResponse.measurements.body_type = 'athletic';
      if (!apiResponse.measurements.gender) apiResponse.measurements.gender = 'M';
    } else if (apiResponse.height !== undefined && apiResponse.chest !== undefined) {
      // If measurements are at the top level, create a nested structure for consistency
      // Default body type based on gender
      const gender = apiResponse.gender || 'M';
      const defaultBodyType = gender === 'F' ? 'hourglass' : 'athletic';
      
      apiResponse.measurements = {
        height: apiResponse.height,
        neck: apiResponse.neck,
        chest: apiResponse.chest,
        waist: apiResponse.waist,
        Butt: apiResponse.Butt,
        shoulder: (apiResponse as any).shoulder_width || apiResponse.shoulder || 17,
        body_length: apiResponse.body_length || 27,
        inseam: apiResponse.inseam || 30,
        weight: apiResponse.weight || 70,
        hip: apiResponse.hip || apiResponse.Butt || 40,
        body_type: apiResponse.body_type || defaultBodyType,
        gender: gender
      };
      console.log("Created nested measurements from top-level properties");
    }
    
    return apiResponse;
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

    console.log("Sending try-virtually request:", JSON.stringify(request, null, 2));

    const response = await fetch(`${API_BASE_URL}/try-virtually`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.detail) {
          console.error("Error details:", errorData.detail);
          throw new Error(typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail));
        } else {
          throw new Error(JSON.stringify(errorData));
        }
      } catch (parseError) {
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
    }

    const result = await response.json();
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

    console.log("Sending recommendation request:", JSON.stringify(request, null, 2));

    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.detail) {
          console.error("Error details:", errorData.detail);
          throw new Error(typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail));
        } else {
          throw new Error(JSON.stringify(errorData));
        }
      } catch (parseError) {
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
    }

    const result = await response.json();
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