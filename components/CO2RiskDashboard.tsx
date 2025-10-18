"use client";

import { useState, useEffect } from "react";
import { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Leaf,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  TreePine,
  Activity,
} from "lucide-react";

interface CO2RiskDashboardProps {
  totalCO2Emissions: number; // in grams
  timeFilter?: "D" | "W" | "M" | "Y"; // Day, Week, Month, Year
}

interface RiskLevel {
  level: "low" | "medium" | "high" | "critical";
  color: string;
  bgColor: string;
  icon: ReactElement;
  message: string;
  percentage: number;
}

export function CO2RiskDashboard({ 
  totalCO2Emissions, 
  timeFilter = "D" 
}: CO2RiskDashboardProps) {
  const [animatedEmissions, setAnimatedEmissions] = useState(0);
  const [currentFilter, setCurrentFilter] = useState(timeFilter);

  // Convert grams to kg for better display
  const emissionsInKg = totalCO2Emissions / 1000;
  const emissionsDisplay = emissionsInKg < 1 
    ? `${totalCO2Emissions.toFixed(0)} g` 
    : `${emissionsInKg.toFixed(3)} kg`;

  // Risk thresholds based on time period (in grams)
  const getRiskThresholds = (filter: string) => {
    const thresholds = {
      D: { low: 50, medium: 150, high: 300, critical: 500 }, // Daily
      W: { low: 350, medium: 1050, high: 2100, critical: 3500 }, // Weekly  
      M: { low: 1500, medium: 4500, high: 9000, critical: 15000 }, // Monthly
      Y: { low: 18000, medium: 54000, high: 108000, critical: 180000 }, // Yearly
    };
    return thresholds[filter as keyof typeof thresholds] || thresholds.D;
  };

  const thresholds = getRiskThresholds(currentFilter);

  // Calculate risk level
  const calculateRiskLevel = (): RiskLevel => {
    const emissions = totalCO2Emissions;
    
    if (emissions <= thresholds.low) {
      return {
        level: "low",
        color: "text-green-400",
        bgColor: "bg-green-500/20 border-green-500/50",
        icon: <CheckCircle className="w-5 h-5" />,
        message: "Excellent! Your emissions are within sustainable limits.",
        percentage: Math.min((emissions / thresholds.low) * 25, 25),
      };
    } else if (emissions <= thresholds.medium) {
      return {
        level: "medium",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20 border-yellow-500/50",
        icon: <Activity className="w-5 h-5" />,
        message: "Moderate emissions. Consider optimizing your AI usage.",
        percentage: 25 + ((emissions - thresholds.low) / (thresholds.medium - thresholds.low)) * 25,
      };
    } else if (emissions <= thresholds.high) {
      return {
        level: "high",
        color: "text-orange-400",
        bgColor: "bg-orange-500/20 border-orange-500/50",
        icon: <TrendingUp className="w-5 h-5" />,
        message: "High emissions detected. Time to plant some trees!",
        percentage: 50 + ((emissions - thresholds.medium) / (thresholds.high - thresholds.medium)) * 25,
      };
    } else {
      return {
        level: "critical",
        color: "text-red-400",
        bgColor: "bg-red-500/20 border-red-500/50",
        icon: <AlertTriangle className="w-5 h-5" />,
        message: "Critical emissions level. Immediate action recommended.",
        percentage: Math.min(75 + ((emissions - thresholds.high) / (thresholds.critical - thresholds.high)) * 25, 100),
      };
    }
  };

  const riskData = calculateRiskLevel();

  // Animate the CO2 level display
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = totalCO2Emissions / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalCO2Emissions) {
        setAnimatedEmissions(totalCO2Emissions);
        clearInterval(timer);
      } else {
        setAnimatedEmissions(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [totalCO2Emissions]);

  // Calculate trees needed (based on your specifications: 1 tree = 4.6 tCO2e lifetime)
  const treesNeeded = Math.ceil((emissionsInKg / 1000) / 4.6);

  // Calculate daily offset rate (0.000063 tCO2e per day)
  const dailyOffsetKg = 0.063; // kg per day
  const daysToOffset = Math.ceil(emissionsInKg / dailyOffsetKg);

  // Calculate cost to offset (based on $14 per tCO2e)
  const offsetCost = (emissionsInKg / 1000) * 14;

  // Time period labels
  const filterLabels = {
    D: "Today's",
    W: "This Week's", 
    M: "This Month's",
    Y: "This Year's"
  };

  return (
    <div className="space-y-6">
      {/* Main CO2 Risk Gauge */}
      <Card className={`${riskData.bgColor} border shadow-xl`}>
        <CardHeader className="flex-row items-center space-x-3">
          <div className={`w-8 h-8 lg:w-10 lg:h-10 ${riskData.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Leaf className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
          </div>
          <CardTitle className="text-lg lg:text-xl font-semibold text-white">
            CO₂ Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Time Filter Buttons */}
          <div className="flex gap-2 justify-center">
            {(["D", "W", "M", "Y"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setCurrentFilter(filter)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  currentFilter === filter
                    ? "bg-blue-500 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Main CO2 Display */}
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              {/* Circular Progress */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-700"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - riskData.percentage / 100)}`}
                  className={riskData.color}
                  strokeLinecap="round"
                  style={{
                    transition: "stroke-dashoffset 2s ease-in-out",
                  }}
                />
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`mb-2 ${riskData.color}`}>
                  {riskData.icon}
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {animatedEmissions < 1000 
                      ? `${animatedEmissions.toFixed(0)}`
                      : `${(animatedEmissions / 1000).toFixed(2)}`
                    }
                  </div>
                  <div className="text-xs text-slate-400">
                    {animatedEmissions < 1000 ? "g CO₂" : "kg CO₂"}
                  </div>
                  <div className={`text-xs font-medium mt-1 ${riskData.color}`}>
                    {riskData.level.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            <div className={`text-sm ${riskData.color} mb-4`}>
              {filterLabels[currentFilter as keyof typeof filterLabels]} CO₂ Level
            </div>
            <p className="text-slate-300 text-sm px-4">
              {riskData.message}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="text-center p-3 bg-slate-900/30 rounded-lg">
              <TreePine className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <p className="text-xs text-white/60">Trees Needed</p>
              <p className="text-lg font-bold text-white">
                {treesNeeded || "< 1"}
              </p>
            </div>
            <div className="text-center p-3 bg-slate-900/30 rounded-lg">
              <Activity className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <p className="text-xs text-white/60">Days to Offset</p>
              <p className="text-lg font-bold text-white">
                {daysToOffset || "< 1"}
              </p>
            </div>
            <div className="text-center p-3 bg-slate-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <p className="text-xs text-white/60">Offset Cost</p>
              <p className="text-lg font-bold text-white">
                ${offsetCost < 0.01 ? "< 0.01" : offsetCost.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-3 bg-slate-900/30 rounded-lg">
              <Leaf className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <p className="text-xs text-white/60">CO₂ (tons)</p>
              <p className="text-lg font-bold text-white">
                {(emissionsInKg / 1000).toFixed(3)}
              </p>
            </div>
          </div>

          {/* Risk Level Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Risk Level</span>
              <span>{riskData.percentage.toFixed(0)}%</span>
            </div>
            <Progress 
              value={riskData.percentage} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Low</span>
              <span>Critical</span>
            </div>
          </div>

          {/* Environmental Impact Equivalences */}
          <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-600">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Environmental Impact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400 mb-2">Equivalent to driving:</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-white/80">🚗 Miles:</span>
                    <span className="text-white font-semibold">
                      {((totalCO2Emissions) / 0.4).toLocaleString()} mi
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">🚗 Kilometers:</span>
                    <span className="text-white font-semibold">
                      {((totalCO2Emissions) / 0.248).toLocaleString()} km
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-slate-400 mb-2">Forest impact:</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-white/80">🌳 Trees/lifetime:</span>
                    <span className="text-white font-semibold">
                      {treesNeeded} oak trees
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">💰 Carbon value:</span>
                    <span className="text-white font-semibold">
                      ${offsetCost.toFixed(2)} USD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
