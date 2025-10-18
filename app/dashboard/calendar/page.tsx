"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  Zap,
  Droplets,
  Leaf,
  Hash,
  Check,
} from "lucide-react";
import Background from "@/components/Background";
import { useRouter } from "next/navigation";
import { CarbonOffsetCalculator } from "@/components/CarbonOffsetCalculator";
import { CO2RiskDashboard } from "@/components/CO2RiskDashboard";

interface CalendarUsageData {
  year: number;
  yearlyStats: {
    totalSearches: number;
    totalTokens: number;
    totalEnergyUsage: number;
    totalCarbonEmissions: number;
    totalWaterUsage: number;
  };
  dailyUsage: Record<
    string,
    {
      searchCount: number;
      tokenCount: number;
      energyUsage: number;
      carbonEmissions: number;
      waterUsage: number;
    }
  >;
  specificDateUsage?: {
    totalSearches: number;
    totalTokens: number;
    totalEnergyUsage: number;
    totalCarbonEmissions: number;
    totalWaterUsage: number;
  };
  searchDates: string[];
}

export default function CalendarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarData, setCalendarData] = useState<CalendarUsageData | null>(
    null
  );
  const [dataLoading, setDataLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Redirect if not authenticated (but wait for loading to complete)
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
    }
  }, [user, loading, router]);

  // Fetch calendar data
  const fetchCalendarData = async (year: number, date?: Date) => {
    console.log("🚀 Starting calendar data fetch...", { year, date });
    setDataLoading(true);
    try {
      const dateParam = date ? date.toISOString().split("T")[0] : "";
      const url = `/api/calendar/usage?year=${year}${
        dateParam ? `&date=${dateParam}` : ""
      }`;

      console.log("📡 Fetching URL:", url);

      const response = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Response status:", response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log("📅 Calendar API Response:", data);
        setCalendarData(data);
      } else {
        const errorText = await response.text();
        console.error(
          "📅 Calendar API Error:",
          response.status,
          response.statusText,
          errorText
        );
      }
    } catch (error) {
      console.error("📅 Failed to fetch calendar data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    console.log("📅 useEffect triggered:", {
      user: !!user,
      loading,
      currentMonth,
    });
    if (user) {
      console.log("📅 User authenticated, fetching calendar data...");
      fetchCalendarData(currentMonth.getFullYear(), selectedDate);
    } else {
      console.log("📅 User not authenticated yet, waiting...");
    }
  }, [user, currentMonth]);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    fetchCalendarData(currentMonth.getFullYear(), date);
  };

  // Handle month navigation
  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
    fetchCalendarData(newMonth.getFullYear());
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // Previous month's trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }

    // Next month's leading days
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let day = 1; days.length < totalCells; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <Background />

      <div className="relative z-10 container max-w-6xl mx-auto px-4 py-8">
        {/* Debug Info - Remove this later */}
        <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded text-white text-sm">
          <p>
            <strong>Debug Info:</strong>
          </p>
          <p>User: {user ? "Authenticated" : "Not authenticated"}</p>
          <p>Data Loading: {dataLoading ? "true" : "false"}</p>
          <p>Calendar Data: {calendarData ? "Present" : "Null"}</p>
          {calendarData && (
            <>
              <p>
                Yearly Searches:{" "}
                {calendarData.yearlyStats?.totalSearches || "null"}
              </p>
              <p>
                Today's Data:{" "}
                {calendarData.specificDateUsage?.totalSearches || "null"}
              </p>
            </>
          )}
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center">
            <CalendarIcon className="w-8 h-8 mr-3 text-blue-400" />
            Search Calendar
          </h1>
          <p className="text-slate-300">
            Track your daily search patterns and environmental impact
          </p>
        </div>

        {/* Yearly Stats - 15% */}
        <Card className="bg-slate-900/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              {currentMonth.getFullYear()} Annual Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <div className="animate-pulse">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-slate-700/50 rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <Search className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                  <div className="text-2xl font-bold text-white">
                    {calendarData?.yearlyStats.totalSearches || 0}
                  </div>
                  <div className="text-xs text-slate-400">Searches</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <Hash className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                  <div className="text-2xl font-bold text-white">
                    {calendarData?.yearlyStats.totalTokens || 0}
                  </div>
                  <div className="text-xs text-slate-400">Tokens</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <Zap className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
                  <div className="text-2xl font-bold text-white">
                    {(calendarData?.yearlyStats.totalEnergyUsage || 0).toFixed(
                      2
                    )}
                  </div>
                  <div className="text-xs text-slate-400">kWh</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <Leaf className="w-6 h-6 mx-auto mb-1 text-green-400" />
                  <div className="text-2xl font-bold text-white">
                    {(
                      calendarData?.yearlyStats.totalCarbonEmissions || 0
                    ).toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400">g CO₂</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <Droplets className="w-6 h-6 mx-auto mb-1 text-cyan-400" />
                  <div className="text-2xl font-bold text-white">
                    {(calendarData?.yearlyStats.totalWaterUsage || 0).toFixed(
                      2
                    )}
                  </div>
                  <div className="text-xs text-slate-400">ml</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Stats - 15% */}
        <Card className="bg-slate-900/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-blue-400" />
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <div className="animate-pulse">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-slate-700/50 rounded"></div>
                  ))}
                </div>
              </div>
            ) : calendarData?.specificDateUsage ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <Search className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                  <div className="text-2xl font-bold text-white">
                    {calendarData.specificDateUsage.totalSearches}
                  </div>
                  <div className="text-xs text-slate-400">Searches</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <Hash className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                  <div className="text-2xl font-bold text-white">
                    {calendarData.specificDateUsage.totalTokens}
                  </div>
                  <div className="text-xs text-slate-400">Tokens</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <Zap className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
                  <div className="text-2xl font-bold text-white">
                    {calendarData.specificDateUsage.totalEnergyUsage.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400">kWh</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <Leaf className="w-6 h-6 mx-auto mb-1 text-green-400" />
                  <div className="text-2xl font-bold text-white">
                    {calendarData.specificDateUsage.totalCarbonEmissions.toFixed(
                      2
                    )}
                  </div>
                  <div className="text-xs text-slate-400">g CO₂</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <Droplets className="w-6 h-6 mx-auto mb-1 text-cyan-400" />
                  <div className="text-2xl font-bold text-white">
                    {calendarData.specificDateUsage.totalWaterUsage.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400">ml</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-6xl text-slate-500 block mb-4">∅</span>
                <p className="text-slate-400">
                  No searches performed on this date
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CO2 Risk Dashboard - Prominent Display */}
        <div className="mb-6">
          <CO2RiskDashboard 
            totalCO2Emissions={calendarData?.specificDateUsage?.totalCarbonEmissions || calendarData?.yearlyStats.totalCarbonEmissions || 0}
            timeFilter="D"
          />
        </div>

        {/* CO2 Offset Calculator - Full Width */}
        <div className="mb-6">
          <CarbonOffsetCalculator 
            carbonEmissions={calendarData?.yearlyStats.totalCarbonEmissions || 0} 
          />
        </div>

        {/* Calendar - 70% */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-blue-400" />
                {monthNames[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                  className="text-white hover:bg-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                  className="text-white hover:bg-slate-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week Headers */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-slate-400 font-medium py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayInfo, index) => {
                const dateKey = dayInfo.date.toISOString().split("T")[0];
                const hasSearches =
                  calendarData?.searchDates?.includes(dateKey);
                const isSelected =
                  selectedDate.toDateString() === dayInfo.date.toDateString();
                const isToday =
                  new Date().toDateString() === dayInfo.date.toDateString();

                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`
                      relative h-16 p-1 flex flex-col items-center justify-center text-sm
                      ${
                        dayInfo.isCurrentMonth ? "text-white" : "text-slate-600"
                      }
                      ${
                        isSelected
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "hover:bg-slate-700"
                      }
                      ${isToday ? "ring-2 ring-orange-400" : ""}
                    `}
                    onClick={() => handleDateSelect(dayInfo.date)}
                  >
                    <span className="mb-1">{dayInfo.date.getDate()}</span>
                    {dayInfo.isCurrentMonth && (
                      <div className="absolute bottom-1">
                        {hasSearches ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <span className="text-lg text-slate-600">∅</span>
                        )}
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex justify-center space-x-6 mt-6 text-sm">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-slate-300">Has searches</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg text-slate-600 mr-2">∅</span>
                <span className="text-slate-300">No searches</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-400 rounded mr-2"></div>
                <span className="text-slate-300">Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
