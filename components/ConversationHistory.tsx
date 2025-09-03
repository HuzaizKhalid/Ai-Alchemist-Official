"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getHistory } from "@/lib/historyClient";
import { SearchResults } from "./search-results";
import { Button } from "./ui/button";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Hash,
  History,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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

interface ConversationHistoryProps {
  onNewSearch: () => void;
}

export default function ConversationHistory({
  onNewSearch,
}: ConversationHistoryProps) {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (user?.id) {
      fetchHistory();
    }
  }, [user?.id]);

  const fetchHistory = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
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

  const formatDate = (item: HistoryItem) => {
    const date = new Date(item.createdAt || item.timestamp || Date.now());
    return date.toLocaleDateString();
  };

  const truncateQuery = (query: string, maxLength: number) => {
    return query.length > maxLength
      ? query.substring(0, maxLength) + "..."
      : query;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 lg:px-8">
      <div className="backdrop-blur-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-6 h-6 text-blue-300" />
              <h1 className="text-2xl font-bold text-white">
                Conversation History
              </h1>
            </div>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40">
              {history.length} conversations
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={fetchHistory}
              disabled={!user?.id}
              className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              variant="ghost"
              onClick={onNewSearch}
              className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <History className="w-4 h-4" />
              <span>New Search</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="ml-3 text-slate-300">
              Loading conversation history...
            </span>
          </div>
        ) : history.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-500" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Conversations Yet
              </h3>
              <p className="text-slate-400 mb-6">
                Start your first search to build conversation history
              </p>
              <Button
                onClick={onNewSearch}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Start New Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => {
              const isExpanded = expandedItems.has(index);
              const isFirst = index === 0;

              return (
                <Card
                  key={index}
                  className="bg-slate-800/50 border-slate-600/50 backdrop-blur-sm overflow-hidden"
                >
                  {/* Conversation Header */}
                  <CardHeader className="pb-0">
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="w-full flex items-start justify-between hover:bg-slate-700/30 transition-colors duration-200 rounded-lg p-2 -m-2"
                    >
                      <div className="flex items-start space-x-4 flex-1 text-left min-w-0">
                        <div className="flex-shrink-0 mt-1">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-blue-300" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-blue-300" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium text-lg truncate pr-4">
                            {truncateQuery(item.query, 80)}
                          </h3>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1 text-white/50 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>{formatDate(item)}</span>
                            </div>

                            <div className="flex items-center space-x-1 text-white/50 text-sm">
                              <Hash className="w-4 h-4" />
                              <span>
                                {item.environmental?.tokenCount?.toLocaleString() ||
                                  "N/A"}{" "}
                                tokens
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                        <Badge
                          className={`text-xs whitespace-nowrap border ${
                            item.environmental?.efficiency === "high"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : item.environmental?.efficiency === "medium"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                          }`}
                        >
                          {item.environmental?.efficiency?.toUpperCase() ||
                            "UNKNOWN"}
                        </Badge>

                        {isFirst && (
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 text-xs whitespace-nowrap">
                            Latest
                          </Badge>
                        )}
                      </div>
                    </button>
                  </CardHeader>

                  {/* Conversation Content */}
                  {isExpanded && item.response && (
                    <CardContent className="pt-0">
                      <div className="border-t border-slate-600/50 pt-4">
                        <SearchResults
                          results={{
                            query: item.query,
                            response: item.response,
                            environmental: {
                              energyUsage: 0,
                              carbonEmissions: 0,
                              waterUsage: 0,
                              efficiency:
                                item.environmental?.efficiency || "medium",
                              tokenCount: item.environmental?.tokenCount || 0,
                            },
                            tokenUsage: undefined,
                          }}
                          onNewSearch={onNewSearch}
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
