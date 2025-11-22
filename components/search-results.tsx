"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Bot,
  Droplets,
  GitCompare,
  Hash,
  Leaf,
  User,
  Zap,
  Share2,
  Copy,
  Check,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "./ui/button";
import { useSearch } from "@/context/searchContext";
import { useState, useEffect } from "react";
import ImageGallery from "./ImageGallery";
import { ClimateWidget } from "./ClimateWidget";
import { EndangeredAnimals } from "./EndangeredAnimals";

// Interface remains the same for data compatibility
export interface SearchResultsProps {
  isHome?: boolean; // Optional prop to handle home page specific logic
  results: {
    query: string;
    response: string;
    environmental: {
      energyUsage: number;
      carbonEmissions: number;
      waterUsage: number;
      efficiency: "low" | "medium" | "high";
      tokenCount: number;
    };
    tokenUsage?: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
    };
  };
  onNewSearch: () => void;
}

// A custom tooltip component styled to match the dark theme
const ThemedTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg">
        <p className="label text-white font-bold">{`${payload[0].value} Tokens`}</p>
      </div>
    );
  }
  return null;
};

// --- UPDATED BAR CHART COMPONENT ---
// A reusable bar chart for displaying environmental impact metrics.
const ImpactBarChart = ({
  icon,
  label,
  value,
  unit,
  color,
  title,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  color: string;
  title: string;
}) => {
  // Data for the bar chart
  const chartData = [{ name: label, value: value }];

  return (
    <Card className="bg-slate-800/50 border border-slate-700 shadow-xl h-full">
      <CardHeader className="flex-row items-center space-x-3 pb-2">
        <div
          className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center flex-shrink-0`}
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
        <CardTitle className="text-base lg:text-lg font-semibold text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-24 lg:h-32 w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                hide={true}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="p-2 bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg">
                        <p className="label text-white font-bold">{`${payload[0].value?.toFixed(
                          4
                        )} ${unit}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{ fill: "rgba(100, 116, 139, 0.1)" }}
              />
              <Bar
                dataKey="value"
                fill="url(#tokenGradient)"
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  style={{ fill: "#e2e8f0", fontSize: "10px" }}
                  formatter={(value: any) =>
                    typeof value === "number" ? value.toFixed(4) : value
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center border-t border-slate-700 pt-4">
          <p className="text-xs lg:text-sm text-white/60">{label}</p>
          <p className="text-lg lg:text-2xl font-bold text-white">
            {value.toFixed(4)}{" "}
            <span className="text-xs lg:text-sm text-white/50">{unit}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export function SearchResults({ results, isHome = false }: SearchResultsProps) {
  if (!results) {
    return null; // Robustness check
  }

  const { query, response, environmental, tokenUsage } = results;

  // Debug: Log the received data
  console.log("SearchResults received tokenUsage:", tokenUsage);
  console.log("SearchResults received environmental:", environmental);
  const { setSearchActive } = useSearch();

  // Dynamic stats state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyPrompts, setDailyPrompts] = useState<number | null>(null);

  // Image search state
  const [images, setImages] = useState<any[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);

  // Share functionality state
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Fetch daily prompts statistics
  useEffect(() => {
    const fetchDailyStats = async () => {
      try {
        const response = await fetch("/api/daily-prompts");
        const data = await response.json();

        if (data.success) {
          setDailyPrompts(data.dailyPrompts);
        }
      } catch (error) {
        console.error("Failed to fetch daily stats:", error);
        // Set fallback value
        setDailyPrompts(45);
      }
    };

    fetchDailyStats();

    // Refresh stats every 5 minutes
    const statsInterval = setInterval(fetchDailyStats, 5 * 60 * 1000);

    // Check if it's a new day and refresh data
    const checkNewDay = () => {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0
      );
      const timeUntilMidnight = midnight.getTime() - now.getTime();

      setTimeout(() => {
        fetchDailyStats(); // Refresh at midnight
        // Set up daily refresh
        setInterval(fetchDailyStats, 24 * 60 * 60 * 1000);
      }, timeUntilMidnight);
    };

    checkNewDay();

    return () => clearInterval(statsInterval);
  }, []);

  // Fetch images when component mounts or query changes
  useEffect(() => {
    const fetchImages = async () => {
      if (!query) return;

      setImagesLoading(true);
      try {
        const response = await fetch(
          `/api/search/images?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        if (data.success && data.images) {
          setImages(data.images);
        }
      } catch (error) {
        console.error("Failed to fetch images:", error);
        setImages([]);
      } finally {
        setImagesLoading(false);
      }
    };

    fetchImages();
  }, [query]);

  // Share functionality
  const handleShare = async () => {
    setIsSharing(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          response,
          environmental,
          tokenUsage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShareUrl(data.shareUrl);
        // Auto-copy to clipboard
        await navigator.clipboard.writeText(data.shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        alert("Failed to create share link");
      }
    } catch (error) {
      console.error("Share error:", error);
      alert("Failed to create share link");
    }
    setIsSharing(false);
  };

  const copyToClipboard = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tokenChartData = tokenUsage
    ? [
        { name: "Input", value: tokenUsage.inputTokens },
        { name: "Output", value: tokenUsage.outputTokens },
      ]
    : [];

  console.log("tokenChartData:", tokenChartData);

  return (
    // Main container with better height management
    <div className="w-full min-h-0 flex-1 overflow-y-auto">
      <div className="container max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {isHome && (
          <div>
            <Button
              variant="link"
              onClick={() => setSearchActive(false)}
              className="mb-4 p-0 h-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Search
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Conversation thread & Comparison Card */}
          <div className="xl:col-span-5 space-y-6">
            {/* User Message */}
            <div className="flex items-start gap-3 lg:gap-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0 bg-slate-800/50 border border-slate-700 rounded-xl p-3 lg:p-4">
                <p className="text-white/90 leading-relaxed text-sm lg:text-base break-words">
                  {query}
                </p>
              </div>
            </div>

            {/* Bot Response */}
            <div className="flex items-start gap-3 lg:gap-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0 bg-slate-800/30 border border-slate-700/80 rounded-xl p-3 lg:p-4">
                <div className="prose prose-sm lg:prose prose-invert max-w-none text-white/80">
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Share Actions */}
            {/* Share Actions - Bottom Center of Chat */}
            <div className="w-full flex justify-center mt-6">
              {/* Share button moved to daily stats section */}
            </div>

            {/* Image Gallery - Related Images */}
            <ImageGallery
              images={images}
              query={query}
              isLoading={imagesLoading}
            />

            {/* Endangered Animals Card */}
            <EndangeredAnimals />
          </div>

          {/* Right Column: Data Visualizations */}
          <div className="xl:col-span-7 space-y-6">
            {/* Token Usage Chart */}
            {tokenUsage && (
              <Card className="bg-slate-800/50 border border-slate-700 shadow-xl">
                <CardHeader className="flex-row items-center space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Hash className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                  </div>
                  <CardTitle className="text-lg lg:text-xl font-semibold text-white">
                    Token Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 lg:h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={tokenChartData}
                        margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
                        barCategoryGap="35%"
                      >
                        <XAxis
                          dataKey="name"
                          stroke="#64748b"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#64748b"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          content={<ThemedTooltip />}
                          cursor={{ fill: "rgba(100, 116, 139, 0.1)" }}
                        />
                        <Bar
                          dataKey="value"
                          fill="url(#tokenGradient)"
                          radius={[4, 4, 0, 0]}
                        >
                          <LabelList
                            dataKey="value"
                            position="top"
                            style={{ fill: "#e2e8f0", fontSize: "12px" }}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-4 border-t border-slate-700 pt-4">
                    <p className="text-xs lg:text-sm text-white/60">
                      Total Tokens
                    </p>
                    <p className="text-2xl lg:text-4xl font-bold text-white">
                      {tokenUsage.totalTokens.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Environmental Impact Bar Charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <ImpactBarChart
                icon={<Zap className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400" />}
                title="Energy Usage"
                label="Energy Consumed"
                value={environmental.energyUsage}
                unit="kWh"
                color="#eab308"
              />

              <ImpactBarChart
                icon={<Leaf className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />}
                title="Carbon Emissions"
                label="CO₂ Equivalent"
                value={environmental.carbonEmissions}
                unit="g CO₂e"
                color="#22c55e"
              />

              <ImpactBarChart
                icon={
                  <Droplets className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                }
                title="Water Usage"
                label="Water Consumed"
                value={environmental.waterUsage}
                unit="mL"
                color="#3b82f6"
              />
            </div>

            {/* Climate Widget */}
            <ClimateWidget carbonEmissions={environmental.carbonEmissions} />

            {/* Daily Stats Section */}
            <section className="bg-gray-900 text-white py-8 lg:py-12 px-4 lg:px-6 text-center rounded-xl">
              <h2 className="text-xl lg:text-3xl font-bold mb-4">
                Daily prompts as of{" "}
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at{" "}
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-2xl mx-auto">
                <div>
                  <h3 className="text-2xl lg:text-4xl font-bold text-blue-400">
                    {dailyPrompts !== null
                      ? dailyPrompts.toLocaleString()
                      : "..."}
                  </h3>
                  <p className="text-gray-400 text-xs lg:text-base">
                    Text Prompts Today
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-4xl font-bold text-green-400">
                    Video
                  </h3>
                  <p className="text-gray-400 text-xs lg:text-base">
                    Coming soon
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-4xl font-bold text-yellow-400">
                    Audio
                  </h3>
                  <p className="text-gray-400 text-xs lg:text-base">
                    Coming soon
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-4xl font-bold text-red-400">
                    Image
                  </h3>
                  <p className="text-gray-400 text-xs lg:text-base">
                    Coming soon
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Share Button - Bottom Center of Main Container */}
        <div className="mt-8 flex justify-center">
          {shareUrl ? (
            <div className="flex items-center gap-3 bg-slate-800/30 border border-slate-700 rounded-lg p-3">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white/90 min-w-0"
                style={{ width: 280 }}
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleShare}
              disabled={isSharing}
              variant="outline"
              size="default"
              className="bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 flex items-center gap-2 px-6 py-3"
            >
              <Share2 className="w-5 h-5" />
              {isSharing ? "Creating link..." : "Share this conversation"}
            </Button>
          )}

          {/* Feedback Button */}
          <Button
            onClick={() => (window.location.href = "/feedback")}
            variant="outline"
            size="default"
            className="bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30 text-emerald-300 hover:text-emerald-200 flex items-center gap-2 px-6 py-3"
          >
            <MessageSquare className="w-5 h-5" />
            Give Feedback
          </Button>
        </div>
      </div>

      {/* SVG Definitions for Gradients */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.7} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
