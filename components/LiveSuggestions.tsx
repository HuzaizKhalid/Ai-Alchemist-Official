"use client";

import React from "react";
import { Search, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveSuggestionsProps {
  suggestionsState: {
    showSuggestions: boolean;
    suggestions: string[];
    isLoadingSuggestions: boolean;
    suggestionsError: string | null;
    selectedIndex: number;
    handleSuggestionClick: (suggestion: string) => void;
    setSelectedIndex: (index: number) => void;
  } | null;
  query: string;
}

const LiveSuggestions: React.FC<LiveSuggestionsProps> = ({
  suggestionsState,
  query,
}) => {
  if (!suggestionsState) return null;

  // Helper function to highlight matching parts of suggestions
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    try {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
      const parts = text.split(regex);

      return parts.map((part, index) => {
        if (part.toLowerCase() === query.toLowerCase()) {
          return (
            <span key={index} className="bg-cyan-500/20 text-cyan-300 font-medium rounded px-1">
              {part}
            </span>
          );
        }
        return part;
      });
    } catch (error) {
      return text;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      {/* AI Suggestions */}
      {suggestionsState.showSuggestions && (
        <div className="mb-4">
          <div className="bg-slate-800/95 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden">
            {suggestionsState.isLoadingSuggestions ? (
              <div className="p-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-400 border-t-transparent"></div>
                  <span className="text-sm text-slate-400">Finding suggestions...</span>
                </div>
              </div>
            ) : suggestionsState.suggestionsError ? (
              <div className="p-4">
                <div className="flex items-center gap-2 text-red-400">
                  <span className="text-sm">Failed to load suggestions</span>
                </div>
              </div>
            ) : suggestionsState.suggestions.length > 0 ? (
              <>
                <div className="p-3 border-b border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-slate-300">AI Suggestions</span>
                    <div className="flex-1" />
                    <TrendingUp className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {suggestionsState.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-3 p-3 transition-all cursor-pointer border-b border-slate-700/30 last:border-b-0",
                        "hover:bg-slate-700/50 hover:border-slate-600/50",
                        suggestionsState.selectedIndex === index && "bg-slate-700/70 border-cyan-500/30"
                      )}
                      onClick={() => suggestionsState.handleSuggestionClick(suggestion)}
                      onMouseEnter={() => suggestionsState.setSelectedIndex(index)}
                      style={{ pointerEvents: 'auto' }}
                    >
                      <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-slate-200 text-sm flex-1 leading-relaxed">
                        {highlightMatch(suggestion, query)}
                      </span>
                      <div className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        Enter
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSuggestions;