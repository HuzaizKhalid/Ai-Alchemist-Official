"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Background from "@/components/Background";

export default function CalendarPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <Background />
      
      <div className="relative z-10 container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            📅 Search Calendar
          </h1>
          <p className="text-slate-300">Track your daily search patterns and environmental impact</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Calendar Page - Testing
          </h2>
          <p className="text-slate-300">
            If you can see this, the Calendar page is working correctly!
          </p>
          <p className="text-slate-400 mt-2">
            User: {user.email}
          </p>
        </div>
      </div>
    </div>
  );
}