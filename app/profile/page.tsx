"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import {
  Settings,
  CreditCard,
  Search,
  TrendingUp,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import Background from "@/components/Background";
import PaymentInfoBlock from "@/components/paymentInfo";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create portal session");
      }
    } catch (error) {
      console.error("Portal creation failed:", error);
      alert("Failed to open billing portal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-white">
        <Background />
        <div className="text-center p-8 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl z-10">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to view your dashboard
          </h1>
          <Link href="/">
            <Button className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      <Background />

      <div className="grid gap-8 py-12 pt-16 md:pt-28">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-white/80">
            Manage your account and track your usage
          </p>
        </div>

        {/* Account Overview */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl font-semibold">
              <Settings className="w-5 h-5 text-emerald-400" />
              <span>Account Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-white/70">Email</p>
                <p className="font-medium text-white">{user.email}</p>
              </div>

              <div>
                <p className="text-sm text-white/70">Current Plan</p>
                <div className="flex items-center space-x-3 mt-1">
                  <Badge
                    variant={user.plan === "pro" ? "default" : "outline"}
                    className="capitalize bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  >
                    {user.plan}
                  </Badge>
                  {user.plan === "free" && (
                    <Link href="/pricing">
                      <Button
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 text-white rounded-full"
                      >
                        Upgrade
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-white/70">Today's Searches</p>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-2xl font-bold text-emerald-400">
                    {user.searchesUsed}
                  </span>
                  <span className="text-sm text-white/70">
                    {user.plan === "free" ? "/ 3" : "used"}
                  </span>
                </div>
              </div>
            </div>

            {user.plan === "pro" && (
              <div className="pt-6 border-t border-white/10">
                <Button
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white rounded-full"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {isLoading ? "Loading..." : "Manage Subscription"}
                  </span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <PaymentInfoBlock />

        {/* Usage Statistics */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl font-semibold">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Usage Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg bg-white/5 border border-white/10">
                <Search className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">
                  {user.searchesUsed}
                </div>
                <p className="text-sm text-white/70">Searches Today</p>
              </div>

              <div className="text-center p-6 rounded-lg bg-white/5 border border-white/10">
                <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">
                  {user.plan === "free" ? "3" : "Unlimited"}
                </div>
                <p className="text-sm text-white/70">Daily Limit</p>
              </div>

              <div className="text-center p-6 rounded-lg bg-white/5 border border-white/10 md:col-span-2 lg:col-span-1">
                <div className="w-8 h-8 bg-purple-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user.plan.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-lg font-bold text-white mb-1 capitalize">
                  {user.plan} Plan
                </div>
                <p className="text-sm text-white/70">Current Subscription</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/">
                <Button className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-full">
                  Start New Search
                </Button>
              </Link>

              {user.plan === "free" ? (
                <Link href="/pricing">
                  <Button className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-full">
                    Upgrade Plan
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                  className="w-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-full"
                >
                  Billing Settings
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Features */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 border-dashed text-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white/90">
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-white/80">Detailed search analytics</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-white/80">
                  Search history & bookmarks
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-white/80">
                  Environmental impact tracking
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-white/80">Advanced search filters</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}