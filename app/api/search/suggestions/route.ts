import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// Google Suggest API - Real-time autocomplete like Google Search
async function getGoogleSuggestions(
  query: string,
  limit: number = 8
): Promise<string[]> {
  try {
    // Use Google's public autocomplete API (same one used by google.com)
    const response = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      console.warn("Google Suggest API failed:", response.status);
      return [];
    }

    const data = await response.json();

    // Google returns format: [query, [suggestions], [], {}]
    if (Array.isArray(data) && data[1] && Array.isArray(data[1])) {
      return data[1].slice(0, limit);
    }

    return [];
  } catch (error) {
    console.warn("Error fetching Google suggestions:", error);
    return [];
  }
}

// DuckDuckGo Instant Answer API - For additional context and suggestions
async function getDuckDuckGoSuggestions(
  query: string,
  limit: number = 5
): Promise<string[]> {
  try {
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(
        query
      )}&format=json&pretty=1&no_html=1`,
      {
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    const suggestions: string[] = [];

    // Extract relevant suggestions from DuckDuckGo response
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      data.RelatedTopics.slice(0, limit).forEach((topic: any) => {
        if (topic.Text) {
          // Extract the main topic from the text
          const text = topic.Text.split(" - ")[0].trim();
          if (text && text.length > 0 && text.length < 100) {
            suggestions.push(text);
          }
        }
      });
    }

    return suggestions;
  } catch (error) {
    console.warn("Error fetching DuckDuckGo suggestions:", error);
    return [];
  }
}

// Groq AI API - Free high-speed AI for intelligent query completions
async function getGroqAISuggestions(
  query: string,
  limit: number = 6
): Promise<string[]> {
  try {
    // Check if we have Groq API key in environment
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return [];
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // Updated to current supported model
          messages: [
            {
              role: "system",
              content:
                "You are a search autocomplete system. Generate relevant search query completions for the partial query. Return only a simple JSON array of 4-6 completion strings. No explanations, just the array.",
            },
            {
              role: "user",
              content: `Complete this search: "${query}"`,
            },
          ],
          max_tokens: 150,
          temperature: 0.3,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        }),
        signal: AbortSignal.timeout(6000),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Groq AI API failed (${response.status}):`, errorText);
      return [];
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (content) {
      try {
        // Try to parse as JSON array
        const suggestions = JSON.parse(content);
        if (Array.isArray(suggestions)) {
          return suggestions
            .slice(0, limit)
            .filter(
              (s: any) =>
                typeof s === "string" && s.trim().length > 0 && s.length < 100
            );
        }
      } catch (parseError) {
        // If not valid JSON, try to extract suggestions from text
        const lines = content
          .split("\n")
          .map((line: string) =>
            line
              .replace(/^\d+\.\s*/, "")
              .replace(/^[-*"]\s*/, "")
              .replace(/["\]]/g, "")
              .trim()
          )
          .filter((line: string) => line.length > 0 && line.length < 100);

        return lines.slice(0, limit);
      }
    }

    return [];
  } catch (error) {
    // Don't log errors for missing API key - that's expected
    if (!process.env.GROQ_API_KEY) {
      return [];
    }
    console.warn(
      "Groq AI API error:",
      error instanceof Error ? error.message : String(error)
    );
    return [];
  }
}

// Wikipedia API - For factual query completions
async function getWikipediaSuggestions(
  query: string,
  limit: number = 4
): Promise<string[]> {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
        query
      )}&limit=${limit}&namespace=0&format=json&origin=*`,
      {
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) return [];

    const data = await response.json();

    // Wikipedia returns format: [query, [titles], [descriptions], [urls]]
    if (Array.isArray(data) && data[1] && Array.isArray(data[1])) {
      return data[1].slice(0, limit);
    }

    return [];
  } catch (error) {
    console.warn("Error fetching Wikipedia suggestions:", error);
    return [];
  }
}

// Master function to get live suggestions from multiple APIs
async function getLiveSuggestions(
  query: string,
  limit: number = 8
): Promise<string[]> {
  if (!query || query.trim().length === 0) {
    return [
      "artificial intelligence",
      "climate change",
      "how to learn programming",
      "renewable energy",
      "space exploration",
      "quantum computing",
      "sustainable living",
      "mental health",
    ].slice(0, limit);
  }

  const suggestions: string[] = [];
  const promises: Promise<string[]>[] = [];

  // Fetch from multiple APIs concurrently for better performance
  promises.push(getGoogleSuggestions(query, 4));
  promises.push(getWikipediaSuggestions(query, 3));
  promises.push(getDuckDuckGoSuggestions(query, 2));

  // Only add Groq AI if API key is available
  if (process.env.GROQ_API_KEY) {
    promises.push(getGroqAISuggestions(query, 3));
  }

  try {
    // Wait for all APIs with a timeout
    const results = await Promise.allSettled(promises);

    let apiSuccessCount = 0;

    // Combine results from all successful APIs
    results.forEach((result, index) => {
      const apiNames = ["Google", "Wikipedia", "DuckDuckGo", "Groq AI"];
      if (
        result.status === "fulfilled" &&
        Array.isArray(result.value) &&
        result.value.length > 0
      ) {
        suggestions.push(...result.value);
        apiSuccessCount++;
      }
    });

    // Remove duplicates and filter
    const uniqueSuggestions = [...new Set(suggestions)]
      .filter(
        (s) =>
          typeof s === "string" &&
          s.trim().length > 0 &&
          s.toLowerCase() !== query.toLowerCase() &&
          s.length < 100 // Avoid very long suggestions
      )
      .slice(0, limit);

    // Log success summary (less verbose)
    if (uniqueSuggestions.length > 0) {
      console.log(
        `✅ Live suggestions: ${uniqueSuggestions.length} from ${apiSuccessCount} APIs for "${query}"`
      );
    }

    // If we have good suggestions, return them
    if (uniqueSuggestions.length > 0) {
      return uniqueSuggestions;
    }

    // Fallback to basic completions if APIs fail
    return getFallbackSuggestions(query, limit);
  } catch (error) {
    console.error("Error fetching live suggestions:", error);
    return getFallbackSuggestions(query, limit);
  }
}

// Fallback suggestions for when APIs fail
function getFallbackSuggestions(query: string, limit: number = 8): string[] {
  const queryLower = query.toLowerCase().trim();
  const fallbacks: string[] = [];

  // Smart fallbacks based on query patterns
  if (queryLower.includes("who is") || queryLower.startsWith("who is")) {
    fallbacks.push(
      `${query} the founder of Google`,
      `${query} the CEO of Microsoft`,
      `${query} Elon Musk`,
      `${query} the president of USA`
    );
  } else if (
    queryLower.includes("what is") ||
    queryLower.startsWith("what is")
  ) {
    fallbacks.push(
      `${query} artificial intelligence`,
      `${query} climate change`,
      `${query} quantum computing`,
      `${query} blockchain`
    );
  } else if (queryLower.includes("how to") || queryLower.startsWith("how to")) {
    fallbacks.push(
      `${query} make money online`,
      `${query} learn programming`,
      `${query} start a business`,
      `${query} lose weight`
    );
  } else if (queryLower.includes("founder of")) {
    fallbacks.push(
      `${query} Google`,
      `${query} Microsoft`,
      `${query} Apple`,
      `${query} Amazon`
    );
  } else {
    // Generic trending topics
    fallbacks.push(
      `${query} news`,
      `${query} 2024`,
      `${query} explained`,
      `${query} benefits`,
      `${query} how to`
    );
  }

  return fallbacks
    .filter((s) => s.toLowerCase() !== queryLower)
    .slice(0, limit);
}

// Get popular searches from database (supplementary)
async function getPopularSearches(limit: number = 5): Promise<string[]> {
  try {
    const db = await getDatabase();
    const searches = await db
      .collection("searches")
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit * 3)
      .toArray();

    // Extract unique queries
    const queries = searches
      .map((search: any) => search.query)
      .filter(
        (query: string, index: number, arr: string[]) =>
          arr.indexOf(query) === index
      )
      .slice(0, limit);

    return queries;
  } catch (error) {
    console.error("Error fetching popular searches:", error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const limit = parseInt(searchParams.get("limit") || "8");
  const category = searchParams.get("category") || "";

  try {
    // Get suggestions from live APIs
    let suggestions = await getLiveSuggestions(query, limit);

    // If we have few suggestions, supplement with popular searches
    if (suggestions.length < Math.floor(limit / 2)) {
      const popularSearches = await getPopularSearches(
        limit - suggestions.length
      );
      suggestions = [...suggestions, ...popularSearches].slice(0, limit);
    }

    // Ensure we always have some suggestions
    if (suggestions.length === 0) {
      suggestions = [
        "artificial intelligence trends",
        "climate change solutions",
        "renewable energy future",
        "space exploration news",
        "quantum computing advances",
        "sustainable technology",
        "mental health awareness",
        "digital transformation",
      ].slice(0, limit);
    }

    return NextResponse.json({
      suggestions,
      query,
      source: "live_apis",
      count: suggestions.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error fetching live suggestions:", error);

    // Return fallback suggestions on error
    const fallbackSuggestions = getFallbackSuggestions(query, limit);

    return NextResponse.json({
      suggestions: fallbackSuggestions,
      query,
      source: "fallback",
      error: "Live API unavailable",
      timestamp: new Date().toISOString(),
    });
  }
}
