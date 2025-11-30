"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/hooks/use-auth";
import {
  Settings,
  Droplets,
  Zap,
  Leaf,
  Calendar,
  TrendingUp,
} from "lucide-react";
import Background from "@/components/Background";
import HistoryList from "@/components/HistoryList";
import { useRouter } from "next/navigation";
import { getDailyUsage, DailyUsageStats } from "@/lib/dailyUsageClient";

// --- Helper Component for Setting Goals ---
interface GoalSetterProps {
  label: string;
  unit: string;
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step: number;
  icon: React.ReactNode;
}

function GoalSetter({
  label,
  unit,
  value,
  setValue,
  min,
  max,
  step,
  icon,
}: GoalSetterProps) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="rounded-full p-1.5 bg-white/6">{icon}</div>
        <label className="font-semibold text-white">{label}</label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px] md:grid-cols-[1fr_120px] gap-3 sm:gap-4 items-center">
        {/* Slider styling uses role selector for shadcn/ui slider */}
        <Slider
          value={[value]}
          onValueChange={(vals) => setValue(vals[0])}
          min={min}
          max={max}
          step={step}
          aria-label={label}
          className={
            // Large visible track + prominent thumb + subtle shadow for daylight visibility
            "[&>div]:h-3 [&>div]:rounded-full [&>div]:bg-white/12 [&>[role=slider]]:h-6 [&>[role=slider]]:w-6 [&>[role=slider]]:rounded-full [&>[role=slider]]:shadow-md [&>[role=slider]]:ring-2 [&>[role=slider]]:ring-white/10 [&>[role=slider]]:bg-gradient-to-br [&>[role=slider]]:from-emerald-400 [&>[role=slider]]:to-cyan-400"
          }
        />

        <div className="relative">
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="bg-white/12 border border-white/12 text-white placeholder-zinc-300 pl-2 pr-10 sm:pl-3 sm:pr-12 h-10 text-sm focus:ring-2 focus:ring-emerald-400/25"
            aria-label={`${label} input`}
          />
          <span className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-200 bg-white/6 px-1.5 sm:px-2 py-0.5 rounded">
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}

// --- Helper Component for Daily Usage Display ---
interface DailyUsageDisplayProps {
  label: string;
  unit: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function DailyUsageDisplay({
  label,
  unit,
  value,
  icon,
  color,
}: DailyUsageDisplayProps) {
  return (
    <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/5 backdrop-blur-md border border-white/12 rounded-xl shadow-2xl">
      <div className="flex items-center space-x-3">
        <div className={`rounded-full p-2 ${color}`}>{icon}</div>
        <div>
          <div className="font-semibold text-white">{label}</div>
          <div className="text-xs text-zinc-300">Today's Total</div>
        </div>
      </div>

      <div className="text-xl sm:text-2xl font-bold text-white">
        {value.toFixed(4)}{" "}
        <span className="text-xs sm:text-sm text-zinc-300">{unit}</span>
      </div>
    </div>
  );
}

// --- Helper Component for Tracking Progress ---
interface UsageTrackerProps {
  label: string;
  unit: string;
  goal: number;
  actual: number;
  icon: React.ReactNode;
}

function UsageTracker({ label, unit, goal, actual, icon }: UsageTrackerProps) {
  const percentage = goal > 0 ? (actual / goal) * 100 : 0;
  const isOver = percentage > 100;

  const getStatus = () => {
    if (isOver)
      return {
        text: "Over Target",
        gradient: "from-rose-500 to-rose-400",
        textColor: "text-rose-300",
        pillBg: "bg-rose-500/8",
      };
    if (percentage >= 90)
      return {
        text: "Nearing Target",
        gradient: "from-yellow-400 to-yellow-300",
        textColor: "text-yellow-300",
        pillBg: "bg-yellow-400/8",
      };
    return {
      text: "Under Target",
      gradient: "from-emerald-400 to-cyan-400",
      textColor: "text-emerald-300",
      pillBg: "bg-emerald-400/8",
    };
  };

  const status = getStatus();

  return (
    <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/5 backdrop-blur-md border border-white/12 rounded-xl shadow-2xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="rounded-full p-2 bg-white/6">{icon}</div>
          <div>
            <div className="font-semibold text-white">{label}</div>
            <div className="text-xs text-zinc-300">Daily</div>
          </div>
        </div>

        <div
          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${status.textColor} ${status.pillBg} border border-white/8`}
        >
          {status.text}
        </div>
      </div>

      <div className="w-full bg-white/12 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full bg-gradient-to-r ${status.gradient} transition-all duration-700 ease-out`}
          style={{
            width: `${Math.min(percentage, 100)}%`,
            boxShadow: status.gradient.includes("rose")
              ? "0 6px 18px rgba(240,82,82,0.14)"
              : "0 6px 18px rgba(34,197,94,0.12)",
          }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-zinc-300">
          <span className="font-medium text-white">{actual.toFixed(4)}</span>
          <span className="ml-2">
            / {goal.toFixed(4)} {unit}
          </span>
        </div>
        <div className="text-xs text-zinc-400 font-mono">
          {Math.min(percentage, 9999).toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

// --- Main ProfilePage ---
export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [waterGoal, setWaterGoal] = useState(150);
  const [energyGoal, setEnergyGoal] = useState(0.002);
  const [co2Goal, setCo2Goal] = useState(5);

  const [actualWater, setActualWater] = useState(0);
  const [actualEnergy, setActualEnergy] = useState(0);
  const [actualCo2, setActualCo2] = useState(0);

  // Daily usage state
  const [dailyUsage, setDailyUsage] = useState<DailyUsageStats>({
    totalSearches: 0,
    totalEnergyUsage: 0,
    totalCarbonEmissions: 0,
    totalWaterUsage: 0,
    totalTokens: 0,
  });
  const [isLoadingDailyUsage, setIsLoadingDailyUsage] = useState(true);

  // Fetch daily usage data
  useEffect(() => {
    const fetchDailyUsage = async () => {
      if (!user?.id) return;

      try {
        setIsLoadingDailyUsage(true);
        const response = await getDailyUsage(user.id);
        if (response.success) {
          setDailyUsage(response.dailyStats);
          // Update actual values for progress tracking
          setActualWater(response.dailyStats.totalWaterUsage);
          setActualEnergy(response.dailyStats.totalEnergyUsage);
          setActualCo2(response.dailyStats.totalCarbonEmissions);
        }
      } catch (error) {
        console.error("Failed to fetch daily usage:", error);
      } finally {
        setIsLoadingDailyUsage(false);
      }
    };

    fetchDailyUsage();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="min-h-screen py-28 flex items-center justify-center text-white">
        <div className="text-center p-8 bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl shadow-2xl">
          <h1 className="text-2xl font-bold mb-4 text-white drop-shadow-md">
            Please sign in to view your Profile
          </h1>
          <Link href="/">
            <Button className="bg-emerald-400 hover:bg-emerald-300 text-black font-bold rounded-full px-6 transition-colors shadow-lg">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 relative py-12 pt-16">
      {/* keep Background component (gradient/dark) */}
      <Background />

      <div className="grid gap-4 sm:gap-6 md:gap-8 relative md:pt-28">
        {/* Card: Today's Usage from History */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/12 text-white shadow-2xl rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-2xl font-bold text-white drop-shadow">
              <Calendar className="w-6 h-6 text-blue-300" />
              <span>Today’s Total Usage</span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isLoadingDailyUsage ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
                <span className="ml-3 text-zinc-300">
                  Loading daily usage...
                </span>
              </div>
            ) : dailyUsage.totalSearches === 0 ? (
              <div className="text-center py-8 text-zinc-300">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
                <p>No searches found for today</p>
                <p className="text-sm">
                  Start searching to see your environmental impact
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  <DailyUsageDisplay
                    label="Water Usage"
                    unit="mL"
                    value={dailyUsage.totalWaterUsage}
                    icon={<Droplets className="w-5 h-5 text-cyan-300" />}
                    color="bg-cyan-500/10"
                  />
                  <DailyUsageDisplay
                    label="Energy Consumption"
                    unit="kWh"
                    value={dailyUsage.totalEnergyUsage}
                    icon={<Zap className="w-5 h-5 text-yellow-300" />}
                    color="bg-yellow-500/10"
                  />
                  <DailyUsageDisplay
                    label="CO2 Emissions"
                    unit="g"
                    value={dailyUsage.totalCarbonEmissions}
                    icon={<Leaf className="w-5 h-5 text-green-300" />}
                    color="bg-green-500/10"
                  />
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full p-2 bg-purple-500/10">
                        <TrendingUp className="w-5 h-5 text-purple-300" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          Total Searches Today
                        </div>
                        <div className="text-xs text-zinc-300">
                          AI interactions
                        </div>
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {dailyUsage.totalSearches}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Card: Set Your Daily Goals */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/12 text-white shadow-2xl rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-2xl font-bold text-white drop-shadow">
              <Settings className="w-6 h-6 text-emerald-300" />
              <span>Set Your Daily Goals</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 md:space-y-8">
            <GoalSetter
              label="Water Usage"
              unit="mL"
              value={waterGoal}
              setValue={setWaterGoal}
              min={0}
              max={500}
              step={1}
              icon={<Droplets className="w-5 h-5 text-cyan-300" />}
            />

            <GoalSetter
              label="Energy Consumption"
              unit="kWh"
              value={energyGoal}
              setValue={setEnergyGoal}
              min={0}
              max={0.01}
              step={0.0001}
              icon={<Zap className="w-5 h-5 text-yellow-300" />}
            />

            <GoalSetter
              label="CO2 Emissions"
              unit="g"
              value={co2Goal}
              setValue={setCo2Goal}
              min={0}
              max={20}
              step={0.1}
              icon={<Leaf className="w-5 h-5 text-green-300" />}
            />

            <div className="pt-6 border-t border-white/10 text-right">
              <Button className="bg-emerald-400 hover:bg-emerald-300 text-black font-bold rounded-full px-8 py-2 shadow-lg transition-colors">
                Save Goals
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card: Today's Progress Log */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/12 text-white shadow-2xl rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Today’s Progress Log
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            <UsageTracker
              label="Water"
              unit="mL"
              goal={waterGoal}
              actual={actualWater}
              icon={<Droplets className="w-5 h-5 text-cyan-300" />}
            />

            <UsageTracker
              label="Energy"
              unit="kWh"
              goal={energyGoal}
              actual={actualEnergy}
              icon={<Zap className="w-5 h-5 text-yellow-300" />}
            />

            <UsageTracker
              label="CO2"
              unit="g"
              goal={co2Goal}
              actual={actualCo2}
              icon={<Leaf className="w-5 h-5 text-green-300" />}
            />
          </CardContent>
        </Card>

        {/* History List */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/12 text-white shadow-2xl rounded-xl p-3 sm:p-4 md:p-6">
          <HistoryList
            isLoading={false}
            onNewSearch={() => {
              router.push("/");
            }}
          />
        </div>
      </div>
    </main>
  );
}
