"use client";

import { useAuth } from "@/hooks/use-auth";
import { useWindowSize } from "@/hooks/use-client";
import { getHistory } from "@/lib/historyClient";
import React from "react";
import { SearchResults } from "./search-results";
import { Button } from "./ui/button";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Clock,
  Hash,
  RefreshCw,
  Trash2,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { clearHistory } from "@/lib/historyClient";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Type definitions
interface HistoryItem {
  id?: string | number;
  query: string;
  response: string; // Added response field
  createdAt?: string | number;
  timestamp?: string | number;
  environmental?: {
    efficiency?: "high" | "medium" | "low";
    tokenCount?: number;
    energyUsage?: number;
    carbonEmissions?: number;
    waterUsage?: number;
  };
  tokenUsage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    reasoningTokens: number;
    cachedInputTokens: number;
  };
}

interface HistoryListProps {
  onNewSearch: () => void;
  isLoading: boolean;
}

const HistoryList: React.FC<HistoryListProps> = ({
  onNewSearch,
  isLoading,
}) => {
  const { user } = useAuth();
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [expandedItems, setExpandedItems] = React.useState<Set<number>>(
    new Set()
  );

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(3);

  const userId = user?.id;

  // ref that will point to the last item in the list
  const lastItemRef = React.useRef<HTMLDivElement | null>(null);

  const fetchHistory = async () => {
    if (!userId) return;
    try {
      const historyData = await getHistory(userId);

      // Ensure we have an array and sort by createdAt date (newest first for pagination)
      const sortedHistory = (
        Array.isArray(historyData) ? historyData : []
      ).sort((a: HistoryItem, b: HistoryItem) => {
        const dateA = new Date(a.createdAt || a.timestamp || 0);
        const dateB = new Date(b.createdAt || b.timestamp || 0);
        return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
      });

      setHistory(sortedHistory);

      // Auto-expand the most recent item (first item in the sorted list)
      if (sortedHistory.length > 0) {
        setExpandedItems(new Set([0]));
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
      setHistory([]); // Set empty array on error
    }
  };

  const handleClearHistory = async () => {
    if (!userId) return;
    try {
      await clearHistory(userId);
      setHistory([]);
      setExpandedItems(new Set());
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  };

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(history.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = history.slice(startIndex, endIndex);

  // Update expanded items indices for current page
  const toggleExpanded = (pageIndex: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pageIndex)) {
        newSet.delete(pageIndex);
      } else {
        newSet.add(pageIndex);
      }
      return newSet;
    });
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
    setExpandedItems(new Set()); // Clear expanded items when changing pages
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Fetch whenever userId or external isLoading flag changes
  React.useEffect(() => {
    if (userId) {
      fetchHistory();
    }
  }, [userId, isLoading]);

  // Scroll into view whenever currentItems or the expandedItems set changes
  // React.useEffect(() => {
  //   if (!currentItems || currentItems.length === 0) return;

  //   // Find the first expanded item in current page
  //   const expandedIndex = Array.from(expandedItems).find(
  //     (index) => index < currentItems.length
  //   );

  //   if (expandedIndex !== undefined && lastItemRef.current) {
  //     const timeoutId = window.setTimeout(() => {
  //       lastItemRef.current?.scrollIntoView({
  //         behavior: "smooth",
  //         block: "center",
  //       });
  //     }, 80);
  //     return () => window.clearTimeout(timeoutId);
  //   }
  // }, [currentItems, expandedItems]);

  const formatDate = (item: HistoryItem) => {
    const timestamp = item.createdAt || item.timestamp || Date.now();
    const date = new Date(timestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const truncateQuery = (query: string, maxLength: number = 80) => {
    if (!query || typeof query !== "string") return "";
    return query.length > maxLength
      ? query.substring(0, maxLength) + "..."
      : query;
  };

  // Generate page numbers for pagination display
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  // Use window size hook to determine mobile view safely
  const { width } = useWindowSize();
  const isMobile = width < 640;

  return (
    <div className="mx-auto container space-y-4 sm:space-y-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            onClick={onNewSearch}
            className="flex items-center justify-center sm:justify-start space-x-2 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>New Search</span>
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={fetchHistory}
              disabled={!userId}
              className="flex items-center justify-center gap-2 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              variant="ghost"
              onClick={handleClearHistory}
              disabled={!userId || history.length === 0}
              className="flex items-center justify-center gap-2 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>
        </div>

        <div className="text-white/60 text-sm text-center sm:text-right">
          {history.length} search{history.length !== 1 ? "es" : ""} in history
          {history.length > 0 && (
            <div className="text-xs text-white/40 mt-1">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>
      </div>

      {/* Items per page selector */}
      {history.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <span>Show:</span>

            <Select
              value={String(itemsPerPage)}
              onValueChange={(val) => {
                const n = Number(val);
                if (!isNaN(n) && n > 0) {
                  setItemsPerPage(n);
                  setCurrentPage(1);
                  setExpandedItems(new Set());
                }
              }}
            >
              <SelectTrigger className="w-[90px] bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20">
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>

            <span>per page</span>
          </div>

          <div className="text-white/60 text-sm">
            Showing {startIndex + 1}-{Math.min(endIndex, history.length)} of{" "}
            {history.length}
          </div>
        </div>
      )}

      {/* History Accordion */}
      {history.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {currentItems.map((item, pageIndex) => {
            const globalIndex = startIndex + pageIndex;
            const isFirst = pageIndex === 0 && currentPage === 1;
            const itemKey = item.id || globalIndex;

            return (
              <div
                key={itemKey}
                ref={expandedItems.has(pageIndex) ? lastItemRef : undefined}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleExpanded(pageIndex)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-start sm:items-center justify-between hover:bg-white/5 transition-colors duration-200"
                >
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 text-left min-w-0">
                    <div className="flex-shrink-0 mt-1 sm:mt-0">
                      {expandedItems.has(pageIndex) ? (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                      ) : (
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm sm:text-base truncate pr-2">
                        {truncateQuery(item.query, isMobile ? 40 : 80)}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 space-y-1 sm:space-y-0">
                        <div className="flex items-center space-x-1 text-white/50 text-xs sm:text-sm">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(item)}</span>
                        </div>

                        <div className="flex items-center space-x-1 text-white/50 text-xs sm:text-sm">
                          <Hash className="w-3 h-3" />
                          <span>
                            {item.environmental?.tokenCount?.toLocaleString() ||
                              "N/A"}{" "}
                            tokens
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 ml-2 sm:ml-4 flex-shrink-0">
                    <Badge
                      className={`text-xs whitespace-nowrap border ${
                        item.environmental?.efficiency === "high"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                          : item.environmental?.efficiency === "medium"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30"
                      }`}
                    >
                      <span className="hidden sm:inline">
                        {item.environmental?.efficiency?.toUpperCase() ||
                          "UNKNOWN"}{" "}
                        Efficiency
                      </span>
                      <span className="sm:hidden">
                        {item.environmental?.efficiency
                          ?.charAt(0)
                          .toUpperCase() || "U"}
                      </span>
                    </Badge>

                    {isFirst && (
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30 text-xs whitespace-nowrap">
                        Latest
                      </Badge>
                    )}
                  </div>
                </button>

                {/* Accordion Content */}
                {expandedItems.has(pageIndex) && (
                  <div className="border-t border-white/10">
                    <div className="p-4 sm:p-6">
                      <SearchResults 
                        results={{
                          query: item.query,
                          response: item.response,
                          environmental: {
                            energyUsage: item.environmental?.energyUsage || 0,
                            carbonEmissions: item.environmental?.carbonEmissions || 0,
                            waterUsage: item.environmental?.waterUsage || 0,
                            efficiency: (item.environmental?.efficiency as "low" | "medium" | "high") || "medium",
                            tokenCount: item.environmental?.tokenCount || 0
                          },
                          tokenUsage: item.tokenUsage
                        }} 
                        onNewSearch={onNewSearch} 
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-white/10">
            <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-white/40" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
            No Search History
          </h3>
          <p className="text-white/60 max-w-md mx-auto text-base sm:text-lg leading-relaxed">
            Your search history will appear here once you start making queries.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {history.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 pb-4">
          {/* Mobile pagination */}
          <div className="flex items-center gap-2 sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="text-white/60 text-sm px-3">
              {currentPage} / {totalPages}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Desktop pagination */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex gap-1">
              {getPageNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  variant="ghost"
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  className={`min-w-[2rem] h-8 ${
                    currentPage === pageNum
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {pageNum}
                </Button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryList;