export interface DailyUsageStats {
  totalSearches: number;
  totalEnergyUsage: number;
  totalCarbonEmissions: number;
  totalWaterUsage: number;
  totalTokens: number;
}

export interface DailyUsageResponse {
  success: boolean;
  dailyStats: DailyUsageStats;
  date: string;
  searchCount: number;
}

export async function getDailyUsage(
  userId: string,
  date?: string
): Promise<DailyUsageResponse> {
  const params = new URLSearchParams({ userId });
  if (date) {
    params.append("date", date);
  }

  const response = await fetch(`/api/history/daily-usage?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch daily usage: ${response.statusText}`);
  }

  return response.json();
}
