"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface SearchSuggestion {
  text: string;
  category?: string;
}

interface UseSuggestionsOptions {
  debounceMs?: number;
  minQueryLength?: number;
  maxSuggestions?: number;
  category?: string;
}

interface UseSuggestionsReturn {
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  clearSuggestions: () => void;
  selectSuggestion: (index: number) => string | null;
}

export function useSearchSuggestions(
  query: string,
  options: UseSuggestionsOptions = {}
): UseSuggestionsReturn {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    maxSuggestions = 8,
    category = "",
  } = options;

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSuggestions = useCallback(
    async (searchQuery: string) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          q: searchQuery,
          limit: maxSuggestions.toString(),
          ...(category && { category }),
        });

        const response = await fetch(`/api/search/suggestions?${params}`, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch suggestions");
        }

        const data = await response.json();

        // Handle both old and new API response formats
        if (data.suggestions && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
          setSelectedIndex(-1); // Reset selection when new suggestions arrive
        } else if (data.success && data.suggestions) {
          // Legacy format support
          setSuggestions(data.suggestions || []);
          setSelectedIndex(-1);
        } else {
          console.warn("Unexpected API response format:", data);
          setSuggestions([]);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to fetch suggestions");
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [maxSuggestions, category]
  );

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear suggestions immediately if query is too short
    if (!query || query.length < minQueryLength) {
      setSuggestions([]);
      setSelectedIndex(-1);
      setIsLoading(false);
      return;
    }

    // Set new timeout for debounced search
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(query.trim());
    }, debounceMs);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, fetchSuggestions, debounceMs, minQueryLength]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setSelectedIndex(-1);
    setError(null);
    setIsLoading(false);
  }, []);

  const selectSuggestion = useCallback(
    (index: number): string | null => {
      if (index >= 0 && index < suggestions.length) {
        const selected = suggestions[index];
        clearSuggestions();
        return selected;
      }
      return null;
    },
    [suggestions, clearSuggestions]
  );

  return {
    suggestions,
    isLoading,
    error,
    selectedIndex,
    setSelectedIndex,
    clearSuggestions,
    selectSuggestion,
  };
}
