"use client";

import { useState, useEffect } from "react";

export interface RecentHistoryItem {
  id: string;
  query: string;
  userName: string;
  createdAt: Date;
  displayQuery: string;
}

export const useRecentGlobalHistory = (limit: number = 5) => {
  const [history, setHistory] = useState<RecentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (isLoading) return; // Prevent duplicate requests

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/history/recent-global?limit=${limit}`);

      if (!response.ok) {
        throw new Error("Failed to fetch recent history");
      }

      const data = await response.json();

      if (data.success) {
        // Convert date strings back to Date objects
        const historyWithDates = data.history.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));

        setHistory(historyWithDates);
      } else {
        setError(data.error || "Unknown error occurred");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch history");
      console.error("Error fetching recent global history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch history when hook is initialized
  useEffect(() => {
    fetchHistory();
  }, [limit]); // Re-fetch if limit changes

  // Manual refresh function
  const refresh = () => {
    fetchHistory();
  };

  return {
    history,
    isLoading,
    error,
    refresh,
    hasHistory: history.length > 0,
  };
};
