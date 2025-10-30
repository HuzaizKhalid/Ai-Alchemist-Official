"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Script from "next/script";
import { AuthModal } from "@/components/auth-modal";
// import { AuthDebugger } from "@/components/auth-debugger";
import { useAuth } from "@/hooks/use-auth";
import SearchForm from "@/components/SearchForm";
import LiveSuggestions from "@/components/LiveSuggestions";
import SimpleChatWidget from "@/components/SimpleChatWidget";
import ChatDemo from "@/components/ChatDemo";
import Background from "@/components/Background";
import { Spotlight } from "@/components/ui/spotlight-new";
import { addHistory } from "@/lib/historyClient";
import { useSearch } from "@/context/searchContext";
import HowItWorksTimeline from "@/components/assistant-ui/TimeLine";
import Footer from "@/components/footer";
import { SearchResults } from "@/components/search-results";
import ConversationHistory from "@/components/ConversationHistory";
import { toast } from "sonner";
import { GreenSmokeEffect } from "@/components/GreenSmokeEffect";

type SearchMode = "new" | "followup";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>("new");
  const { user } = useAuth();
  const { setSearchActive, isSearchActive } = useSearch();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Suggestions state management
  const [suggestionsState, setSuggestionsState] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!query.trim()) return;
    setIsLoading(true);

    // Initialize results with query and empty response for streaming
    const currentQuery = query;
    setSearchResults({
      query: currentQuery,
      response: "",
      environmental: {
        energyUsage: 0,
        carbonEmissions: 0,
        waterUsage: 0,
        efficiency: "medium" as const,
        tokenCount: 0,
      },
      tokenUsage: {
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      },
    });
    setSearchActive(true);
    setSearchMode("new");

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: currentQuery }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 429) {
          if (errorData.error?.includes("Daily search limit")) {
            toast.error(
              "Daily search limit reached! Try again tomorrow or upgrade to Pro."
            );
          } else if (errorData.error?.includes("Rate limit")) {
            toast.error(
              "Too many requests! Please wait a moment and try again."
            );
          } else {
            toast.error("Rate limit exceeded. Please try again later.");
          }
        } else {
          toast.error(`Search failed: ${errorData.error || "Unknown error"}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedResponse += chunk;

          // Update results with accumulated response
          setSearchResults((prev: any) => ({
            ...prev,
            response: accumulatedResponse,
          }));
        }
      }

      // Save to history after streaming completes
      const finalResults = {
        query: currentQuery,
        response: accumulatedResponse,
        environmental: searchResults?.environmental || {
          energyUsage: 0,
          carbonEmissions: 0,
          waterUsage: 0,
          efficiency: "medium" as const,
          tokenCount: 0,
        },
        tokenUsage: searchResults?.tokenUsage || {
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
        },
      };

      await addHistory({ ...finalResults, userId: user.id });
      toast.success("Search successful!");
    } catch (error) {
      // Only show generic error if we haven't shown a specific one
      if (!(error as Error).message.includes("HTTP error!")) {
        toast.error("Search failed. Please try again.");
      }
      console.error("Search failed:", error);
      setSearchResults(null);
      setSearchActive(false);
    } finally {
      setIsLoading(false);
      setQuery("");
    }
  };

  const handleSearchModeChange = (mode: SearchMode) => {
    setSearchMode(mode);
    if (mode === "followup") {
      setSearchActive(true);
    }
  };

  const handleNewSearch = () => {
    setSearchMode("new");
    setSearchResults(null);
    setQuery("");
    setSearchActive(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // ⏰ Climate Clock Injection
  useEffect(() => {
    const container = document.getElementById("climate-clock-container");
    if (container && !container.querySelector("climate-clock")) {
      const el = document.createElement("climate-clock");
      container.appendChild(el);
    }
  }, []);

  return (
    <div className="bg-slate-900 text-slate-50">
      <div className="relative min-h-screen flex flex-col pt-40 ">
        {/* Green Smoke Effect - Only in hero section */}
        <GreenSmokeEffect />

        <Spotlight />

        <main className="flex-1 flex flex-col justify-center overflow-y-auto pt-12 relative z-10">
          {/* Always show main content */}
          <div className="w-full max-w-4xl mx-auto px-6 text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-50 mb-6 leading-tight tracking-tight drop-shadow-md">
              What do you want to know{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                sustainably
              </span>
              ?
            </h1>

            <div className="relative max-w-3xl mx-auto rounded-3xl p-[1px] bg-gradient-to-r mb-16 from-cyan-400/20 to-violet-400/20">
              <div className="rounded-[23px] p-6 backdrop-blur-lg bg-slate-800/80">
                <p className="text-base lg:text-lg text-slate-100 leading-relaxed font-normal">
                  Get AI-powered answers while tracking the environmental impact
                  of your queries! Set daily limits and discover the most
                  energy-efficient models for your needs.
                </p>
              </div>
            </div>
          </div>

          {/* Search Results - only show when active */}
          {isSearchActive && (
            <div className="w-full mx-auto my-12 mt-16 md:mt-28">
              {searchMode === "followup" ? (
                <ConversationHistory onNewSearch={handleNewSearch} />
              ) : (
                <div className="w-full mx-auto px-6 lg:px-8">
                  <div className="backdrop-blur-lg">
                    <SearchResults
                      isHome={true}
                      results={searchResults}
                      onNewSearch={handleNewSearch}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Sticky Search Bar */}
        <div className="sticky bottom-0 bg-slate-900/60 backdrop-blur-md border-t border-slate-700/50">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600/40 to-transparent" />
          <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <SearchForm
              query={query}
              setQuery={setQuery}
              handleSearch={handleSearch}
              isLoading={isLoading}
              inputRef={inputRef}
              onSearchModeChange={handleSearchModeChange}
              onSuggestionsStateChange={setSuggestionsState}
            />
          </div>
        </div>

        {/* Live AI Suggestions - positioned right below search input */}
        <LiveSuggestions suggestionsState={suggestionsState} query={query} />
      </div>

      {/* Timeline */}
      <div className="">
        <HowItWorksTimeline />
      </div>

      {/* Footer */}
      <div className="">
        <Footer />
      </div>

      {/* Climate Clock Script */}
      <Script
        src="https://climateclock.world/widget-v2.js"
        strategy="lazyOnload"
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Simple Custom Chat Widget - No bot, clean contact form */}
      <SimpleChatWidget
        adminEmail="paulsemz17@gmail.com"
        siteName="Alchemist AI"
      />

      {/* Tawk.to Widget Removed - was causing console errors */}
      {/* <ChatWidget /> */}

      {/* Chat Demo Component for Testing */}
      <ChatDemo />

      {/* Auth Debugger - Remove in production */}
      {/* <AuthDebugger /> */}
    </div>
  );
}
