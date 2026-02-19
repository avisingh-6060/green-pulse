interface HealthInput {
  aqi: number;           // 0–500
  traffic: number;       // 0–100
  construction: boolean;
  industrial: boolean;
}

/**
 * Health Score Formula (0–100)
 * Higher = Better (Cleaner & Healthier Route)
 */
export const calculateHealthScore = ({
  aqi,
  traffic,
  construction,
  industrial,
}: HealthInput): number => {
  
  // 🔹 Normalize AQI (higher AQI = worse)
  const aqiPenalty = Math.min(60, (aqi / 500) * 60);

  // 🔹 Traffic Impact
  const trafficPenalty = Math.min(20, (traffic / 100) * 20);

  // 🔹 Construction Zone Impact
  const constructionPenalty = construction ? 10 : 0;

  // 🔹 Industrial Area Impact
  const industrialPenalty = industrial ? 10 : 0;

  // 🔹 Final Score (out of 100)
  let score =
    100 -
    (aqiPenalty +
      trafficPenalty +
      constructionPenalty +
      industrialPenalty);

  // Clamp between 0 and 100
  score = Math.max(0, Math.min(100, Math.round(score)));

  return score;
};
