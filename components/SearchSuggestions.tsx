"use client";

import React, { useEffect, useRef } from 'react';
import { Search, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchSuggestionsProps {
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  selectedIndex: number;
  onSuggestionClick: (suggestion: string, index: number) => void;
  onSuggestionHover: (index: number) => void;
  visible: boolean;
  query: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  isLoading,
  error,
  selectedIndex,
  onSuggestionClick,
  onSuggestionHover,
  visible,
  query
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedIndex]);

  if (!visible) return null;

  // Helper function to highlight matching parts of suggestions
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="text-emerald-300 font-medium bg-emerald-500/10 px-0.5 rounded">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="bg-slate-800/95 backdrop-blur-md border border-slate-600/50 rounded-xl shadow-2xl max-h-80 overflow-hidden">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-4 px-6">
            <div className="flex items-center space-x-3 text-slate-400">
              <div className="w-4 h-4 border-2 border-slate-600 border-t-emerald-400 rounded-full animate-spin" />
              <span className="text-sm">Finding suggestions...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex items-center justify-center py-4 px-6">
            <div className="text-red-400 text-sm flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Unable to load suggestions</span>
            </div>
          </div>
        )}

        {/* Suggestions List */}
        {!isLoading && !error && suggestions.length > 0 && (
          <>
            {/* Header */}
            <div className="px-4 py-2 border-b border-slate-700/50 bg-slate-700/20">
              <div className="flex items-center space-x-2 text-slate-400 text-xs">
                <Search className="w-3 h-3" />
                <span>Suggestions</span>
                {query.length >= 2 && (
                  <span className="text-slate-500">• based on "{query}"</span>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div ref={listRef} className="max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={cn(
                    "px-4 py-3 cursor-pointer transition-all duration-150 flex items-start space-x-3 group",
                    selectedIndex === index
                      ? "bg-emerald-500/20 border-l-2 border-emerald-400"
                      : "hover:bg-slate-700/50 border-l-2 border-transparent"
                  )}
                  onClick={() => onSuggestionClick(suggestion, index)}
                  onMouseEnter={() => onSuggestionHover(index)}
                >
                  {/* Icon */}
                  <div className={cn(
                    "w-4 h-4 mt-0.5 transition-colors",
                    selectedIndex === index 
                      ? "text-emerald-300" 
                      : "text-slate-500 group-hover:text-slate-400"
                  )}>
                    {index === 0 && query.length < 2 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </div>

                  {/* Suggestion Text */}
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "text-sm leading-relaxed transition-colors",
                      selectedIndex === index
                        ? "text-white"
                        : "text-slate-200 group-hover:text-white"
                    )}>
                      {highlightMatch(suggestion, query)}
                    </div>
                    
                    {/* Popular indicator for top suggestions */}
                    {index === 0 && query.length < 2 && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span className="text-xs text-amber-400/80">Popular</span>
                      </div>
                    )}
                  </div>

                  {/* Keyboard hint */}
                  {selectedIndex === index && (
                    <div className="flex items-center space-x-1 text-xs text-emerald-400/80 ml-2">
                      <span>↵</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer with keyboard hints */}
            <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-700/20">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-600/50 rounded text-xs">↑↓</kbd>
                    <span>navigate</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-600/50 rounded text-xs">↵</kbd>
                    <span>select</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-600/50 rounded text-xs">Esc</kbd>
                    <span>close</span>
                  </div>
                </div>
                <span className="text-slate-600">{suggestions.length} suggestions</span>
              </div>
            </div>
          </>
        )}

        {/* No Suggestions State */}
        {!isLoading && !error && suggestions.length === 0 && query.length >= 2 && (
          <div className="flex flex-col items-center justify-center py-6 px-6 text-slate-400">
            <Search className="w-8 h-8 mb-2 text-slate-600" />
            <p className="text-sm text-center">
              No suggestions found for "{query}"
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSuggestions;