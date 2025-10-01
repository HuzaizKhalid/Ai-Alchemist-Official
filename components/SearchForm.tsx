"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TextareaAutosize from "react-textarea-autosize";
import {
  ArrowRight,
  CornerDownLeft,
  Sparkles,
  ChevronDown,
  Type,
  Video,
  AudioLines,
  Clock,
  Frame,
  MessageSquare,
  History,
  ChevronDown as ChevronDownIcon,
  ChevronRight,
  Hash,
  Search,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSearchSuggestions } from "@/hooks/use-search-suggestions";
import { getHistory } from "@/lib/historyClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchResults } from "@/components/search-results";
import SearchSuggestions from "@/components/SearchSuggestions";
// import RecentHistory from "@/components/RecentHistory";

interface SearchFormProps {
  className?: string;
  query: string;
  setQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  isLoading: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  onSearchModeChange?: (mode: SearchMode) => void;
  // New props for suggestions
  onSuggestionsStateChange?: (state: {
    showSuggestions: boolean;
    suggestions: string[];
    isLoadingSuggestions: boolean;
    suggestionsError: string | null;
    selectedIndex: number;
    handleSuggestionClick: (suggestion: string) => void;
    setSelectedIndex: (index: number) => void;
  }) => void;
}

type SearchType = "text" | "video" | "audio" | "photo";
type SearchMode = "new" | "followup";

interface SearchTypeOption {
  value: SearchType;
  label: string;
  icon: React.ReactNode;
  available: boolean;
}

interface HistoryItem {
  id?: string | number;
  query: string;
  response?: string;
  createdAt?: string | number;
  timestamp?: string | number;
  environmental?: {
    efficiency?: "high" | "medium" | "low";
    tokenCount?: number;
  };
}

const SearchForm = ({
  className = "",
  query,
  setQuery,
  handleSearch,
  isLoading,
  inputRef,
  onSearchModeChange,
  onSuggestionsStateChange,
}: SearchFormProps) => {
  const { user } = useAuth();
  const [isFocused, setIsFocused] = useState(false);
  const [selectedType, setSelectedType] = useState<SearchType>("text");
  const [searchMode, setSearchMode] = useState<SearchMode>("new");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<HistoryItem | null>(null);

  // Search suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionCategory = selectedType === "text" ? "sustainability" : "";

  const {
    suggestions,
    isLoading: isLoadingSuggestions,
    error: suggestionsError,
    selectedIndex,
    setSelectedIndex,
    clearSuggestions,
    selectSuggestion,
  } = useSearchSuggestions(query, {
    debounceMs: 300,
    minQueryLength: 1,
    maxSuggestions: 8,
    category: suggestionCategory,
  });

  // Auto-show suggestions when they're available and input is focused
  useEffect(() => {
    console.log("Suggestions state:", {
      suggestions: suggestions.length,
      isFocused,
      queryLength: query.length,
      isLoading: isLoadingSuggestions,
      showSuggestions,
    });

    // Show suggestions when typing and input is focused
    if (isFocused && query.length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else if (
      query.length > 0 &&
      suggestions.length === 0 &&
      !isLoadingSuggestions
    ) {
      // Hide suggestions when typing but no suggestions available
      setShowSuggestions(false);
    } else if (!isFocused) {
      // Hide suggestions when not focused
      setShowSuggestions(false);
    }
  }, [
    suggestions,
    isFocused,
    query.length,
    isLoadingSuggestions,
    showSuggestions,
  ]);

  // Communicate state changes to parent
  useEffect(() => {
    onSuggestionsStateChange?.({
      showSuggestions,
      suggestions,
      isLoadingSuggestions,
      suggestionsError,
      selectedIndex,
      handleSuggestionClick: (suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false);
      },
      setSelectedIndex,
    });
  }, [
    showSuggestions,
    suggestions,
    isLoadingSuggestions,
    suggestionsError,
    selectedIndex,
    setQuery,
    onSuggestionsStateChange,
  ]);

  const searchTypes: SearchTypeOption[] = [
    {
      value: "text",
      label: "Text",
      icon: <Type className="w-4 h-4" />,
      available: true,
    },
    {
      value: "photo",
      label: "Photo",
      icon: <Frame className="w-4 h-4" />,
      available: false,
    },
    {
      value: "video",
      label: "Video",
      icon: <Video className="w-4 h-4" />,
      available: false,
    },
    {
      value: "audio",
      label: "Audio",
      icon: <AudioLines className="w-4 h-4" />,
      available: false,
    },
  ];

  // Fetch history when switching to follow-up mode
  useEffect(() => {
    if (searchMode === "followup" && user?.id) {
      fetchHistory();
    }
  }, [searchMode, user?.id]);

  const fetchHistory = async () => {
    if (!user?.id) return;
    try {
      setIsLoadingHistory(true);
      const historyData = await getHistory(user.id);
      const sortedHistory = (
        Array.isArray(historyData) ? historyData : []
      ).sort((a: HistoryItem, b: HistoryItem) => {
        const dateA = new Date(a.createdAt || a.timestamp || 0);
        const dateB = new Date(b.createdAt || b.timestamp || 0);
        return dateB.getTime() - dateA.getTime();
      });
      setHistory(sortedHistory);

      // Auto-expand the most recent item
      if (sortedHistory.length > 0) {
        setExpandedItems(new Set([0]));
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
      setHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle suggestions navigation
    if (showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(Math.min(selectedIndex + 1, suggestions.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(Math.max(selectedIndex - 1, -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            // Select suggestion
            const selectedSuggestion = selectSuggestion(selectedIndex);
            if (selectedSuggestion) {
              setQuery(selectedSuggestion);
              setShowSuggestions(false);
              // Auto-submit with the selected suggestion after a brief delay
              setTimeout(() => {
                if (inputRef?.current) {
                  const form = inputRef.current.closest("form");
                  if (form) {
                    const submitEvent = new Event("submit", {
                      bubbles: true,
                      cancelable: true,
                    });
                    form.dispatchEvent(submitEvent);
                  }
                }
              }, 150);
            }
          } else {
            // No suggestion selected, perform normal search
            setShowSuggestions(false);
            handleSearch(e as unknown as React.FormEvent);
          }
          break;
        case "Escape":
          e.preventDefault();
          setShowSuggestions(false);
          clearSuggestions();
          break;
        default:
          break;
      }
    } else {
      // Normal enter key behavior when suggestions are not shown
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        setShowSuggestions(false);
        handleSearch(e as unknown as React.FormEvent);
      }
    }
  };

  const handleTypeSelect = (type: SearchType) => {
    if (searchTypes.find((t) => t.value === type)?.available) {
      setSelectedType(type);
    }
  };

  const handleNewSearch = () => {
    setSearchMode("new");
    setSelectedHistoryItem(null);
    setQuery("");
    setExpandedItems(new Set());
    onSearchModeChange?.("new");
  };

  const handleFollowUp = () => {
    setSearchMode("followup");
    onSearchModeChange?.("followup");
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const handleHistoryItemSelect = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
    setQuery(`Follow up on: ${item.query}`);
  };

  // Suggestion handlers
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    clearSuggestions();
    setShowSuggestions(false);

    // Focus back on input and auto-submit after a short delay
    if (inputRef?.current) {
      inputRef.current.focus();
      setTimeout(() => {
        if (inputRef.current) {
          const form = inputRef.current.closest("form");
          if (form) {
            form.requestSubmit();
          }
        }
      }, 100);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    // Logic is now handled in useEffect above
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow click events on suggestion items
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      setIsFocused(false);
    }, 200);
  };

  const formatDate = (item: HistoryItem) => {
    const date = new Date(item.createdAt || item.timestamp || Date.now());
    return date.toLocaleDateString();
  };

  const truncateQuery = (query: string, maxLength: number) => {
    return query.length > maxLength
      ? query.substring(0, maxLength) + "..."
      : query;
  };

  const selectedTypeData = searchTypes.find((t) => t.value === selectedType)!;

  return (
    <div className={className}>
      {/* Search Type Selector and Mode Buttons */}
      {/* Search Type Selector and Mode Buttons */}
      <div className="relative mb-3 flex gap-1 md:gap-2">
        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 px-4 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50 rounded-lg text-slate-200 transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm w-full sm:w-auto"
            >
              {selectedTypeData.icon}
              <span className="font-medium truncate">
                {selectedTypeData.label}
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-slate-800 border-slate-600/50"
            align="start"
          >
            <DropdownMenuLabel className="text-slate-200">
              Search Type
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-600/50" />

            {searchTypes.map((type) => (
              <DropdownMenuItem
                key={type.value}
                onClick={() => handleTypeSelect(type.value)}
                disabled={!type.available}
                className={`flex items-center justify-between ${
                  selectedType === type.value
                    ? "bg-emerald-500/20 text-emerald-300"
                    : type.available
                    ? "text-slate-200 hover:bg-slate-700/50"
                    : "text-slate-500 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={
                      selectedType === type.value
                        ? "text-emerald-400"
                        : type.available
                        ? "text-slate-400"
                        : "text-slate-600"
                    }
                  >
                    {type.icon}
                  </div>
                  <span className="font-medium">{type.label}</span>
                </div>

                {!type.available && (
                  <div className="flex items-center space-x-1 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>Soon</span>
                  </div>
                )}

                {selectedType === type.value && (
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                )}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator className="bg-slate-600/50" />
            <p className="text-xs text-slate-500 text-center py-2">
              Video & Audio search coming soon
            </p>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* New Search Button */}
        <Button
          className={`h-10 px-4 rounded-lg flex items-center space-x-2 transition-all duration-200 border w-full sm:w-auto ${
            searchMode === "new"
              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30"
              : "bg-slate-800 border-slate-600/50 hover:bg-slate-800/70 text-slate-200"
          }`}
        >
          <Search className="w-4 h-4 hidden sm:block" />
          <span className="font-medium text-sm">New Search</span>
        </Button>

        {/* Follow Up Button with Badge + Tooltip */}
        <div className="relative group w-full sm:w-auto">
          {/* Coming Soon Badge */}
          <div className="absolute -top-3 -right-2 z-10">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md flex items-center space-x-1 animate-pulse">
              <Clock className="w-3 h-3" />
              <span className="">Coming Soon</span>
            </div>
          </div>

          {/* Main Button */}
          <button
            disabled
            className={`relative h-11 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 border shadow-md w-full sm:w-auto cursor-not-allowed opacity-80 backdrop-blur-sm overflow-hidden ${
              searchMode === "followup"
                ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/50 text-blue-300"
                : "bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/50 text-slate-300"
            }`}
          >
            {/* Subtle Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <MessageCircle className="w-5 h-5 hidden sm:block relative z-10" />
            <span className="font-medium relative z-10 text-sm">Follow Up</span>
          </button>

          {/* Tooltip */}
          {/* <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-800 text-slate-300 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg shadow-xl border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            <div className="absolute -top-1  left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 border-l border-t border-slate-700/50 rotate-45" />
            This feature will be available soon
          </div> */}
        </div>
      </div>

      {/* Search Form */}
      <div className={`relative px-4 py-3 bg-slate-800/85 ring-1 ring-slate-600/40 shadow-lg ${
        showSuggestions && suggestions.length > 0 ? 'rounded-t-xl' : 'rounded-xl'
      }`}>
        <form onSubmit={handleSearch}>
          <div className="relative">
            <TextareaAutosize
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={
                searchMode === "followup"
                  ? "Ask a follow-up question based on your conversation history..."
                  : `Ask anything about sustainability, science, or any topic... (${selectedTypeData.label.toLowerCase()} search)`
              }
              className={`w-full max-h-48 resize-none bg-transparent py-4 pl-6 pr-20 text-lg text-white placeholder:text-slate-400 focus:outline-none transition-all duration-300 ${
                isFocused ? "placeholder:text-slate-500" : ""
              }`}
              minRows={1}
              maxRows={6}
            />

            {/* Enhanced floating action area */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-3">
              {/* Keyboard shortcut hint - more prominent when focused */}
              <div
                className={`hidden md:flex items-center text-xs transition-all duration-300 ${
                  isFocused ? "text-slate-300" : "text-slate-500"
                }`}
              >
                <div className="flex items-center px-2 py-1 rounded-md bg-slate-700/50 border border-slate-600/50">
                  <CornerDownLeft className="w-3 h-3 mr-1" />
                  <span className="font-medium">Enter</span>
                </div>
              </div>

              {/* Enhanced submit button with better states */}
              <Button
                type="submit"
                disabled={isLoading || !query.trim()}
                className={`h-12 w-12 rounded-xl shadow-lg transition-all duration-300 border-0 relative overflow-hidden group ${
                  query.trim() && !isLoading
                    ? "bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 hover:scale-105 shadow-emerald-500/25"
                    : "bg-slate-600/50 hover:bg-slate-600/70"
                }`}
              >
                {/* Button glow effect */}
                {query.trim() && !isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" />
                )}

                {isLoading ? (
                  <div className="relative">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <Sparkles className="absolute inset-0 w-5 h-5 text-white/20 animate-pulse" />
                  </div>
                ) : (
                  <div className="relative">
                    <ArrowRight
                      className={`w-5 h-5 transition-all duration-300 ${
                        query.trim()
                          ? "text-white group-hover:translate-x-0.5"
                          : "text-slate-400"
                      }`}
                    />
                    {query.trim() && (
                      <div className="absolute inset-0 w-5 h-5 bg-white/20 rounded-full scale-0 group-hover:scale-100 group-hover:animate-ping transition-transform duration-300" />
                    )}
                  </div>
                )}
              </Button>
            </div>

            {/* Character count and other indicators */}
            {query.length > 100 && (
              <div className="absolute bottom-1 right-20 text-xs text-slate-500">
                {query.length}/1000
              </div>
            )}
          </div>
        </form>

        {/* Character count and other indicators */}
        {query.length > 100 && (
          <div className="absolute bottom-1 right-20 text-xs text-slate-500">
            {query.length}/1000
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchForm;
