"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  ArrowLeft,
  ExternalLink,
  Lightbulb,
  Bug,
  HelpCircle,
} from "lucide-react";

const Page = () => {
  const [isFeaturebaseReady, setIsFeaturebaseReady] = useState(false);

  useEffect(() => {
    // Check if Featurebase is loaded
    const checkFeaturebase = () => {
      if (typeof window !== "undefined" && (window as any).Featurebase) {
        setIsFeaturebaseReady(true);
      }
    };

    checkFeaturebase();
    // Retry check in case script is still loading
    const timer = setTimeout(checkFeaturebase, 1000);
    return () => clearTimeout(timer);
  }, []);

  const openFeaturebaseWidget = () => {
    if (typeof window !== "undefined" && (window as any).Featurebase) {
      (window as any).Featurebase("open_feedback_widget");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 pt-40">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Feedback</h1>
        </div>

        {/* Quick Access Card */}
        <Card className="bg-slate-800/50 border-slate-700 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              Share Your Feedback
            </CardTitle>
            <p className="text-slate-400 text-sm">
              Help us improve Alchemist AI with your suggestions and ideas
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={openFeaturebaseWidget}
              disabled={!isFeaturebaseReady}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-emerald-500/20 transition-all"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Open Feedback Widget
            </Button>

            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                Powered by Featurebase
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featurebase Embedded Board */}
        <Card className="bg-slate-800/50 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center justify-between">
              <span>Community Feedback Board</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open("https://aichemist.featurebase.app", "_blank")
                }
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Full Page
              </Button>
            </CardTitle>
            <p className="text-slate-400 text-sm">
              Browse, vote, and comment on features and suggestions from the
              community
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative w-full" style={{ height: "600px" }}>
              <iframe
                src="https://aichemist.featurebase.app"
                className="w-full h-full rounded-lg border border-slate-700"
                style={{ border: "none" }}
                title="Featurebase Feedback Board"
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center space-y-4">
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-2">
              Why Use Featurebase?
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-400 mt-4">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Vote on features you want most</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Track progress on your requests</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Get updates when features ship</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Join discussions with the community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
