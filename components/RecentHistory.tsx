"use client";

import React from "react";
import { Clock, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { RecentHistoryItem } from "@/hooks/use-recent-global-history";

interface RecentHistoryProps {
  history: RecentHistoryItem[];
  isLoading: boolean;
  error: string | null;
  visible: boolean;
  selectedIndex: number;
  onHistoryClick: (query: string, index: number) => void;
  onHistoryHover: (index: number) => void;
}

const RecentHistory: React.FC<RecentHistoryProps> = ({
  history,
  isLoading,
  error,
  visible,
  selectedIndex,
  onHistoryClick,
  onHistoryHover,
}) => {
  if (!visible) return null;

  // Helper function to format time
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="bg-slate-800/95 backdrop-blur-md border border-slate-600/50 rounded-xl shadow-2xl max-h-80 overflow-hidden">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-4 px-6">
            <div className="flex items-center space-x-3 text-slate-400">
              <div className="w-4 h-4 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin" />
              <span className="text-sm">Loading recent searches...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex items-center justify-center py-4 px-6">
            <div className="text-red-400 text-sm flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Unable to load recent searches</span>
            </div>
          </div>
        )}

        {/* Recent History List */}
        {!isLoading && !error && history.length > 0 && (
          <>
            {/* Header */}
            <div className="px-4 py-2 border-b border-slate-700/50 bg-slate-700/20">
              <div className="flex items-center space-x-2 text-slate-400 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>Recent Searches</span>
                <span className="text-slate-500">• from community</span>
              </div>
            </div>

            {/* History Items */}
            <div className="max-h-64 overflow-y-auto">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => onHistoryClick(item.query, index)}
                  onMouseEnter={() => onHistoryHover(index)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-150 border-b border-slate-800/30 last:border-b-0",
                    selectedIndex === index
                      ? "bg-blue-500/20 border-l-4 border-l-blue-400"
                      : "hover:bg-slate-700/50"
                  )}
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Users className="w-3 h-3 text-blue-400 flex-shrink-0" />
                      <span className="text-blue-300 text-xs font-medium">
                        {item.userName}
                      </span>
                      <span className="text-slate-500 text-xs">
                        {formatTime(item.createdAt)}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-sm truncate transition-colors",
                        selectedIndex === index
                          ? "text-white font-medium"
                          : "text-slate-200 group-hover:text-white"
                      )}
                    >
                      {item.displayQuery}
                    </p>
                  </div>

                  {/* Indicator for selected item */}
                  {selectedIndex === index && (
                    <div className="flex-shrink-0 ml-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-700/10">
              <div className="flex items-center justify-center text-slate-500 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                <span>Start typing for AI suggestions</span>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <Users className="w-8 h-8 text-slate-500 mb-2" />
            <span className="text-slate-400 text-sm text-center">
              No recent searches found
            </span>
            <span className="text-slate-500 text-xs text-center mt-1">
              Start typing for AI suggestions
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentHistory;
