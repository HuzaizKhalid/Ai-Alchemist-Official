"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Background from "@/components/Background";
import { CarbonOffsetCalculator } from "@/components/CarbonOffsetCalculator";
import { CO2RiskDashboard } from "@/components/CO2RiskDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TreePine, Leaf, Calculator } from "lucide-react";

interface UserEmissionsData {
  totalCarbonEmissions: number; // in grams
  dailyAverage: number;
  weeklyAverage: number;
  monthlyAverage: number;
}

export default function CO2OffsetCalculatorPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [emissionsData, setEmissionsData] = useState<UserEmissionsData>({
    totalCarbonEmissions: 0,
    dailyAverage: 0,
    weeklyAverage: 0,
    monthlyAverage: 0,
  });
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
    }
  }, [user, loading, router]);

  // Fetch user's emissions data
  const fetchEmissionsData = async () => {
    setDataLoading(true);
    try {
      // Get current year emissions
      const currentYear = new Date().getFullYear();
      const response = await fetch(`/api/calendar/usage?year=${currentYear}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const totalEmissions = data?.yearlyStats?.totalCarbonEmissions || 0;

        // Calculate averages (simplified)
        const daysInYear = 365;
        const dailyAvg = totalEmissions / daysInYear;
        const weeklyAvg = dailyAvg * 7;
        const monthlyAvg = dailyAvg * 30;

        setEmissionsData({
          totalCarbonEmissions: totalEmissions,
          dailyAverage: dailyAvg,
          weeklyAverage: weeklyAvg,
          monthlyAverage: monthlyAvg,
        });
      }
    } catch (error) {
      console.error("Failed to fetch emissions data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    if (user) {
      fetchEmissionsData();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <Background />

      <div className="relative z-10 container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center">
            <Calculator className="w-8 h-8 mr-3 text-green-400" />
            CO₂ Offset Calculator
          </h1>
          <p className="text-slate-300">
            Track your carbon footprint from AI usage and offset it by planting
            trees
          </p>
        </div>

        {/* Quick Stats Overview */}
        {!dataLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Total Emissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {emissionsData.totalCarbonEmissions.toFixed(1)}
                  <span className="text-sm text-slate-400 ml-1">g CO₂</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Daily Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {emissionsData.dailyAverage.toFixed(2)}
                  <span className="text-sm text-slate-400 ml-1">g CO₂</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Weekly Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {emissionsData.weeklyAverage.toFixed(1)}
                  <span className="text-sm text-slate-400 ml-1">g CO₂</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Monthly Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {emissionsData.monthlyAverage.toFixed(1)}
                  <span className="text-sm text-slate-400 ml-1">g CO₂</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* CO₂ Risk Dashboard */}
        <div className="mb-8">
          <CO2RiskDashboard
            totalCO2Emissions={emissionsData.totalCarbonEmissions}
            timeFilter="Y"
          />
        </div>

        {/* Carbon Offset Calculator */}
        <div className="mb-8">
          <CarbonOffsetCalculator
            carbonEmissions={emissionsData.totalCarbonEmissions}
          />
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TreePine className="w-5 h-5 mr-2 text-green-400" />
                How Tree Offsetting Works
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-3">
              <p>
                <strong className="text-white">Oak Trees:</strong> Each mature
                oak tree absorbs approximately 23 kg of CO₂ per year.
              </p>
              <p>
                <strong className="text-white">Lifetime Impact:</strong> Over
                200 years, one oak tree can absorb 4.6 tons of CO₂.
              </p>
              <p>
                <strong className="text-white">Daily Growth:</strong> Your trees
                grow and absorb CO₂ every day, starting from the planting date.
              </p>
              <p>
                <strong className="text-white">Real Impact:</strong> Track your
                trees as they age and see their cumulative environmental
                benefit.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Leaf className="w-5 h-5 mr-2 text-blue-400" />
                Carbon Credit Economics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-3">
              <p>
                <strong className="text-white">Market Rate:</strong> Carbon
                credits trade at approximately $14 per ton of CO₂.
              </p>
              <p>
                <strong className="text-white">Your Investment:</strong> See the
                real dollar value of your environmental impact.
              </p>
              <p>
                <strong className="text-white">Climate Positive:</strong> When
                your trees offset more than you emit, you become climate
                positive!
              </p>
              <p>
                <strong className="text-white">Surplus Value:</strong> Excess
                offsets have monetary value in carbon credit markets.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
