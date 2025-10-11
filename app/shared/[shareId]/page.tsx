"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import SearchForm from "@/components/SearchForm";
import { SearchResults } from "@/components/search-results";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Copy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";

interface SharedSearchData {
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
}

export default function SharedSearchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const shareId = params.shareId as string;
  const queryParam = searchParams.get("q") || "";

  const [sharedData, setSharedData] = useState<SharedSearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [sharedDate, setSharedDate] = useState<Date | null>(null);

  // Search form state
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SharedSearchData | null>(
    null
  );

  useEffect(() => {
    if (shareId && shareId !== "fallback") {
      // Try to fetch stored shared search first
      fetchStoredSharedSearch(shareId);
    } else if (queryParam) {
      // Fallback to re-running the search
      fetchSharedSearch(queryParam);
    }
  }, [shareId, queryParam]);

  const fetchStoredSharedSearch = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/share?shareId=${id}`);

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSharedData(result.data);
          setSharedDate(new Date(result.data.createdAt));
          setLoading(false);
          return;
        }
      }

      // If stored search not found, fallback to re-running search
      if (queryParam) {
        setError("Original search not found. Recreating similar results...");
        fetchSharedSearch(queryParam);
      } else {
        setError("Shared search not found");
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch stored shared search:", error);
      setError("Failed to load shared search. Trying to recreate...");
      if (queryParam) {
        fetchSharedSearch(queryParam);
      } else {
        setLoading(false);
      }
    }
  };

  const fetchSharedSearch = async (searchQuery: string) => {
    setLoading(true);
    setIsSearching(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        setSharedData(data);
      }
    } catch (error) {
      console.error("Failed to fetch shared search:", error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const copyShareLink = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border border-slate-700 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Loading shared search...
                </h2>
                <p className="text-slate-400">
                  {error || `Recreating the AI response for: "${queryParam}"`}
                </p>
                {error && (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-amber-400 text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Shared Search Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-300 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Search
                  </Button>
                </Link>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Shared Search</span>
                </div>
              </div>

              <Button
                onClick={copyShareLink}
                variant="outline"
                size="sm"
                className={`border-slate-600 transition-all duration-300 ${
                  copySuccess
                    ? "bg-green-500/20 text-green-400 border-green-500/40"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
                disabled={copySuccess}
              >
                <Copy className="w-4 h-4 mr-2" />
                {copySuccess ? "Copied!" : "Copy Link"}
              </Button>
            </div>

            <Card className="bg-slate-800/30 border border-slate-700/50">
              <CardContent className="p-4">
                <p className="text-white font-medium">"{queryParam}"</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-slate-400 text-sm">
                    This search was shared from Alchemist AI
                  </p>
                  {sharedDate && (
                    <p className="text-slate-500 text-xs">
                      Shared {sharedDate.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Results */}
          {sharedData && (
            <SearchResults
              results={sharedData}
              onNewSearch={() => {}}
              isHome={false}
            />
          )}

          {/* Error State */}
          {!loading && !sharedData && !searchResults && error && (
            <Card className="bg-slate-800/50 border border-slate-700 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Shared Search Not Found
                </h2>
                <p className="text-slate-400 mb-6">
                  This shared search may have expired or the link may be
                  invalid.
                </p>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go to Search
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* New Search Results */}
          {searchResults && (
            <div className="mt-8">
              <SearchResults
                results={searchResults}
                onNewSearch={() => {}}
                isHome={false}
              />
            </div>
          )}

          {/* New Search Form */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                Try Your Own Search
              </h3>
              <p className="text-slate-400">
                Search for anything and get AI-powered answers with
                environmental insights
              </p>
            </div>
            <SearchForm
              query={query}
              setQuery={setQuery}
              handleSearch={handleSearch}
              isLoading={isSearching}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
