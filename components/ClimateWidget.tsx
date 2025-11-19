"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TreePine,
  ThermometerSun,
  TrendingUp,
  Globe,
  Plus,
  Minus,
  RefreshCw,
} from "lucide-react";

interface PlantedTree {
  id: string;
  plantingDate: Date;
  ageInDays: number;
  cumulativeOffset: number;
}

interface ClimateData {
  currentTemp: number;
  targetTemp: number;
  difference: number;
  percentOfLimit: number;
  status: "Safe" | "Warning" | "Critical";
  isRealTime?: boolean;
  source?: string;
  lastUpdated?: string;
}

interface ClimateWidgetProps {
  carbonEmissions?: number;
}

export function ClimateWidget({ carbonEmissions }: ClimateWidgetProps) {
  const [userTrees, setUserTrees] = useState<PlantedTree[]>([]);
  const [climateData, setClimateData] = useState<ClimateData>({
    currentTemp: 1.38,
    targetTemp: 1.5,
    difference: -0.12,
    percentOfLimit: 92.0,
    status: "Warning",
  });
  const [loading, setLoading] = useState(false);
  const [showAddTree, setShowAddTree] = useState(false);
  const [newTreeDate, setNewTreeDate] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Load trees from API
  useEffect(() => {
    loadTrees();
  }, []);

  // Update tree ages every hour
  useEffect(() => {
    const updateTrees = () => {
      setUserTrees((prev) =>
        prev.map((tree) => {
          const plantDate =
            tree.plantingDate instanceof Date
              ? tree.plantingDate
              : new Date(tree.plantingDate);
          const now = new Date();
          const ageInDays = Math.floor(
            (now.getTime() - plantDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          // Calculate CO2 offset (simplified - 23kg per year = 63g per day)
          const cumulativeOffset = (ageInDays * 63) / 1000; // in kg

          return {
            ...tree,
            ageInDays,
            cumulativeOffset,
          };
        })
      );
    };

    updateTrees();
    const interval = setInterval(updateTrees, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(interval);
  }, []);

  // Fetch climate data from API
  useEffect(() => {
    fetchClimateData();
  }, []);

  const loadTrees = async () => {
    try {
      const response = await fetch("/api/trees", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const normalized: PlantedTree[] = (data.trees || []).map((t: any) => ({
          id: t.id,
          plantingDate: new Date(t.plantingDate),
          ageInDays: t.ageInDays ?? 0,
          cumulativeOffset: t.cumulativeOffset ?? 0,
        }));
        setUserTrees(normalized);
      }
    } catch (error) {
      console.error("Failed to load trees:", error);
    }
  };

  const fetchClimateData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/climate-data");
      if (response.ok) {
        const data = await response.json();
        setClimateData(data);
        console.log("Climate data updated:", {
          temperature: data.currentTemp,
          isRealTime: data.isRealTime,
          source: data.source,
        });
      }
    } catch (error) {
      console.error("Failed to fetch climate data:", error);
      // Keep default values if API fails
    } finally {
      setRefreshing(false);
    }
  };

  const addTree = async () => {
    if (!newTreeDate || loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/trees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ plantingDate: newTreeDate }),
      });

      if (response.ok) {
        const data = await response.json();
        const t = data.tree;
        const normalized: PlantedTree = {
          id: t.id,
          plantingDate: new Date(t.plantingDate),
          ageInDays: t.ageInDays ?? 0,
          cumulativeOffset: t.cumulativeOffset ?? 0,
        };
        setUserTrees((prev) => [...prev, normalized]);
        setNewTreeDate("");
        setShowAddTree(false);
      } else {
        console.error("Failed to add tree");
      }
    } catch (error) {
      console.error("Error adding tree:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeTree = async (id: string) => {
    try {
      const response = await fetch(`/api/trees?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setUserTrees((prev) => prev.filter((tree) => tree.id !== id));
      } else {
        console.error("Failed to remove tree");
      }
    } catch (error) {
      console.error("Error removing tree:", error);
    }
  };

  const formatTreeAge = (days: number) => {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = days % 30;

    if (years > 0) {
      return `${years}y ${months}m ${remainingDays}d`;
    } else if (months > 0) {
      return `${months}m ${remainingDays}d`;
    }
    return `${remainingDays}d`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Safe":
        return "text-green-400 bg-green-500/20 border-green-500/50";
      case "Warning":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50";
      case "Critical":
        return "text-red-400 bg-red-500/20 border-red-500/50";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/50";
    }
  };

  return (
    <Card className="bg-slate-800/50 border border-slate-700 shadow-xl">
      <CardHeader className="flex-row items-center space-x-3">
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Globe className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
        </div>
        <CardTitle className="text-lg lg:text-xl font-semibold text-white">
          Climate Widget
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tree Ages Section - Top Part */}
        <div className="border-b border-slate-700 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <TreePine className="w-5 h-5 text-green-400" />
              Your Trees Ages ({userTrees.length})
            </h3>
            <Button
              onClick={() => setShowAddTree(!showAddTree)}
              size="sm"
              variant="outline"
              className="bg-green-500/20 border-green-500/50 hover:bg-green-500/30 text-green-300"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Tree
            </Button>
          </div>

          {showAddTree && (
            <div className="flex gap-2 mb-3 p-3 bg-slate-900/30 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="tree-date" className="text-white/80 text-sm">
                  Planting Date
                </Label>
                <Input
                  id="tree-date"
                  type="date"
                  value={newTreeDate}
                  onChange={(e) => setNewTreeDate(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={addTree}
                  size="sm"
                  disabled={!newTreeDate || loading}
                >
                  {loading ? "Adding..." : "Add"}
                </Button>
                <Button
                  onClick={() => setShowAddTree(false)}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {userTrees.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                {userTrees.map((tree, index) => (
                  <div
                    key={tree.id}
                    className="bg-slate-900/50 rounded-lg p-3 border border-slate-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TreePine className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm font-medium">
                          Tree #{index + 1}
                        </span>
                      </div>
                      <span className="text-green-400 font-bold text-lg">
                        {formatTreeAge(tree.ageInDays)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-white/60 text-xs">
                        CO₂ absorbed: {tree.cumulativeOffset.toFixed(2)} kg
                      </p>
                      <Button
                        onClick={() => removeTree(tree.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20 h-6 w-6 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {userTrees.length > 4 && (
                <div className="text-center mt-2">
                  <p className="text-white/40 text-xs italic">
                    Scroll to view all {userTrees.length} trees 👆
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 text-white/60 bg-slate-900/30 rounded-lg">
              <TreePine className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No trees planted yet</p>
              <p className="text-xs">Plant trees to track their age!</p>
            </div>
          )}
        </div>

        {/* Temperature Section - Bottom Part */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2 text-sm sm:text-base">
              <ThermometerSun className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              Paris Agreement Target
            </h3>
            <Button
              onClick={fetchClimateData}
              disabled={refreshing}
              size="sm"
              variant="outline"
              className="bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30 text-blue-300 w-full sm:w-auto text-xs sm:text-sm"
            >
              <RefreshCw
                className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              {refreshing ? "Updating..." : "Refresh"}
            </Button>
          </div>

          {/* Data Source Info */}
          {climateData.source && (
            <div className="mb-4 p-2.5 sm:p-3 bg-slate-900/30 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
                <span className="text-white/60 text-[11px] sm:text-xs">
                  {climateData.isRealTime ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></span>
                      <span className="font-medium">Live Data</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></span>
                      <span className="font-medium">Static Data</span>
                    </span>
                  )}
                </span>
                <span className="text-white/50 text-[10px] sm:text-xs line-clamp-2 sm:line-clamp-1">
                  {climateData.source}
                </span>
              </div>
              {climateData.lastUpdated && (
                <p className="text-white/40 text-[10px] sm:text-xs mt-1.5">
                  Last updated:{" "}
                  {(() => {
                    try {
                      const date = new Date(climateData.lastUpdated);
                      if (isNaN(date.getTime())) {
                        return climateData.lastUpdated;
                      }
                      return date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      });
                    } catch (e) {
                      return climateData.lastUpdated;
                    }
                  })()}
                </p>
              )}
            </div>
          )}

          {/* Status Badge */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80 text-xs sm:text-sm">Status</span>
            <span
              className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border ${getStatusColor(
                climateData.status
              )}`}
            >
              {climateData.status}
            </span>
          </div>

          {/* Temperature Display */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:gap-4 mb-4">
            <div className="text-center p-2.5 sm:p-3 lg:p-4 bg-slate-900/50 rounded-lg border border-slate-600">
              <p className="text-[10px] sm:text-xs lg:text-sm text-white/60 mb-0.5 sm:mb-1 font-medium">
                CURRENT
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-orange-400 leading-tight">
                +{climateData.currentTemp.toFixed(2)}°C
              </p>
            </div>
            <div className="text-center p-2.5 sm:p-3 lg:p-4 bg-slate-900/50 rounded-lg border border-slate-600">
              <p className="text-[10px] sm:text-xs lg:text-sm text-white/60 mb-0.5 sm:mb-1 font-medium">
                TARGET
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-blue-400 leading-tight">
                +{climateData.targetTemp.toFixed(1)}°C
              </p>
            </div>
          </div>

          {/* Difference Display */}
          <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-lg p-3 sm:p-4 border border-orange-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 mb-2">
              <span className="text-white/80 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />
                <span>Difference from target:</span>
              </span>
              <span className="text-orange-400 font-bold text-xl sm:text-2xl">
                +{Math.abs(climateData.difference).toFixed(2)}°C
              </span>
            </div>
            <p className="text-white/70 text-xs sm:text-sm">
              {climateData.percentOfLimit.toFixed(1)}% of the 1.5°C limit
            </p>
          </div>

          {/* Temperature Scale */}

          {/* Info text */}
        </div>
      </CardContent>
    </Card>
  );
}
