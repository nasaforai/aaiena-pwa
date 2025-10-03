import { useProfile } from "@/hooks/useProfile";
import { ProductSizeChart } from "@/hooks/useProductSizeChart";

export interface SizeRecommendation {
  bestFit: {
    size: string;
    matchPercentage: number;
    reason: string;
  } | null;
  alternateFit: {
    size: string;
    matchPercentage: number;
    reason: string;
  } | null;
}

export const useSizeRecommendation = (sizeChart: ProductSizeChart | null) => {
  const { profile } = useProfile();

  const calculateRecommendation = (): SizeRecommendation => {
    if (!sizeChart || !profile || !sizeChart.measurements.length) {
      return { bestFit: null, alternateFit: null };
    }

    const userMeasurements = {
      chest: profile.chest_inches,
      waist: profile.waist_inches,
      shoulder: profile.shoulder_inches,
      hip: profile.hip_inches,
    };

    // Check if user has any measurements
    const hasMeasurements = Object.values(userMeasurements).some((m) => m !== null && m !== undefined);
    if (!hasMeasurements) {
      return { bestFit: null, alternateFit: null };
    }

    // Calculate fit score for each size
    const sizeScores = sizeChart.measurements.map((measurement) => {
      let totalDiff = 0;
      let validMeasurements = 0;

      // Compare each measurement
      if (userMeasurements.chest && measurement.chest_inches) {
        totalDiff += Math.abs(userMeasurements.chest - Number(measurement.chest_inches));
        validMeasurements++;
      }
      if (userMeasurements.waist && measurement.waist_inches) {
        totalDiff += Math.abs(userMeasurements.waist - Number(measurement.waist_inches));
        validMeasurements++;
      }
      if (userMeasurements.shoulder && measurement.shoulder_inches) {
        totalDiff += Math.abs(userMeasurements.shoulder - Number(measurement.shoulder_inches));
        validMeasurements++;
      }
      if (userMeasurements.hip && measurement.hips_inches) {
        totalDiff += Math.abs(userMeasurements.hip - Number(measurement.hips_inches));
        validMeasurements++;
      }

      // Average difference (lower is better)
      const avgDiff = validMeasurements > 0 ? totalDiff / validMeasurements : Infinity;
      
      // Convert to match percentage (0-100%)
      // Assuming 10 inches difference = 0% match, 0 inches difference = 100% match
      const matchPercentage = Math.max(0, Math.min(100, 100 - (avgDiff * 10)));

      return {
        size: measurement.size_label,
        avgDiff,
        matchPercentage: Math.round(matchPercentage),
      };
    });

    // Sort by best fit (lowest average difference)
    sizeScores.sort((a, b) => a.avgDiff - b.avgDiff);

    const bestFit = sizeScores[0];
    const alternateFit = sizeScores[1];

    return {
      bestFit: bestFit
        ? {
            size: bestFit.size,
            matchPercentage: bestFit.matchPercentage,
            reason:
              bestFit.matchPercentage >= 90
                ? `Perfect match! This size aligns closely with your measurements.`
                : bestFit.matchPercentage >= 75
                ? `Great fit! This size offers a comfortable and well-balanced look.`
                : `Good fit for you based on your measurements.`,
          }
        : null,
      alternateFit: alternateFit
        ? {
            size: alternateFit.size,
            matchPercentage: alternateFit.matchPercentage,
            reason:
              alternateFit.matchPercentage >= 75
                ? `Also a good option if you prefer a different fit.`
                : alternateFit.matchPercentage >= 60
                ? `Could feel a bit snug. Great if you like tighter-fitting clothes.`
                : `Available as an alternative, but may not fit as well.`,
          }
        : null,
    };
  };

  return calculateRecommendation();
};
