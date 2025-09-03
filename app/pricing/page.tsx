"use client";

import { JSX, useState, useEffect } from "react";
import { PricingCard } from "@/components/pricing-card";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "@/components/auth-modal";
import { Check, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Background from "@/components/Background";
import { useRouter } from "next/navigation";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  price_id: string;
}

interface FreePlanFeature {
  text: string;
  highlighted?: boolean;
}

export default function PricingPage(): JSX.Element {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/stripe/subscription-plans");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched plans:", data); // Debug log

        if (Array.isArray(data)) {
          setPlans(data);
        } else if (data.plans && Array.isArray(data.plans)) {
          setPlans(data.plans);
        } else {
          console.error("Invalid plans data structure:", data);
          setError("Invalid plans data received");
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (priceId: string) => {
    setCheckoutLoading(true);
    try {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, userId: user?.id }),
      });

      if (!response.ok) {
        throw new Error(`${response}`);
      }

      const { sessionId } = await response.json();

      if (sessionId) {
        // Import getStripe dynamically
        const { getStripe } = await import("@/lib/stripe-client");
        const stripe = await getStripe();

        if (stripe) {
          await stripe.redirectToCheckout({ sessionId });
        } else {
          throw new Error("Failed to load Stripe");
        }
      } else {
        throw new Error("Failed to get session ID");
      }
    } catch (error) {
      console.error("Error initiating checkout:");
      console.log(error);
      setError(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const freePlanFeatures: FreePlanFeature[] = [
    { text: "3 searches per day" },
    { text: "Bring your own API key" },
    { text: "Environmental impact tracking", highlighted: true },
    { text: "Basic analytics" },
  ];

  // Fallback plans in case API fails
  const fallbackPlans: Plan[] = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for getting started",
      price: 0,
      interval: "month",
      price_id: "free",
    },
    {
      id: "pro",
      name: "Pro",
      description: "For power users who need more",
      price: 499, // $9.99
      interval: "month",
      price_id: "price_1S0mrYCdShX7Tzf1ZC0ppIDO",
    },
  ];

  // Use fallback plans if API failed or returned empty
  const activePlans = plans.length > 0 ? plans : fallbackPlans;

  // Find free and pro plans from active data
  const freePlan = activePlans.find(
    (plan) => plan.name.toLowerCase() === "free"
  );
  const proPlan = activePlans.find((plan) => plan.name.toLowerCase() === "pro");

  const isUserOnFreePlan = !user?.plan || user?.plan === "free";

  // Loading state
  if (loading) {
    return (
      <>
        <Background />
        <main className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16 z-10">
          <div className="flex flex-col items-center gap-4 text-white">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-lg">Loading pricing plans...</p>
          </div>
        </main>
      </>
    );
  }

  // Error state
  if (error && !freePlan && !proPlan) {
    return (
      <>
        <Background />
        <main className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16 z-10">
          <div className="flex flex-col items-center gap-4 text-white max-w-md text-center">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <h2 className="text-xl font-semibold">Failed to Load Pricing</h2>
            <p className="text-gray-300">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-white/10 hover:bg-white/20"
            >
              Retry
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Background />
      <main className="relative min-h-screen flex flex-col justify-center px-4 py-16 z-10">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-16 relative z-10 py-8 md:py-12 pt-16 md:pt-28">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 md:px-6 py-2 mb-4 md:mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-xs md:text-sm font-medium">
              Sustainable AI for Everyone
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Start with our generous free tier or upgrade to Pro for unlimited
            sustainable AI searches with advanced features and priority support.
          </p>
        </div>

        {/* Error banner if API failed but we have fallback data */}
        {error && (freePlan || proPlan) && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-300 text-sm text-center">
            Using cached pricing data. Some information may be outdated.
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto relative z-10 px-4">
          <Card className="relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-700 text-white flex flex-col shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <Badge className="absolute -top-3 left-4 md:left-6 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full px-3 md:px-4 py-1 text-xs">
              Most Popular
            </Badge>

            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                {freePlan?.name}
              </CardTitle>

              <div className="text-4xl md:text-5xl font-bold text-white mt-4 drop-shadow-lg">
                ${(freePlan?.price || 0 / 100).toFixed(0)}
                <span className="text-base md:text-lg font-normal text-zinc-400">
                  /{freePlan?.interval}
                </span>
              </div>

              <p className="text-xs md:text-sm text-zinc-400 mt-2 px-2">
                {freePlan?.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-6 flex-1 flex flex-col justify-between px-4 md:px-6 pb-6 md:pb-8">
              <ul className="space-y-3 md:space-y-4">
                {freePlanFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-3 opacity-0 animate-[fadeInUp_0.6s_ease_forwards] group-hover:translate-x-1 transition-transform duration-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Check
                      className={`w-4 md:w-5 h-4 md:h-5 flex-shrink-0 ${feature.highlighted
                        ? "text-emerald-400"
                        : "text-blue-400"
                        }`}
                    />
                    <span
                      className={`text-xs md:text-sm ${feature.highlighted
                        ? "text-emerald-300 font-medium"
                        : "text-zinc-300"
                        }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full mt-6 rounded-full bg-zinc-800/60 border border-zinc-600/50 text-zinc-300 cursor-default hover:bg-zinc-800/60 text-sm"
                disabled
              >
                {isUserOnFreePlan ? "Your Current Plan" : "Downgrade Available"}
              </Button>
            </CardContent>
          </Card>

          <div className="relative">
            <PricingCard
              plan={proPlan || fallbackPlans[1]}
              isCurrentPlan={user?.plan === "pro"}
              isLoading={checkoutLoading}
              onSubscribe={handleSubscribe}
            />
          </div>

          {/* Fallback message if no plans are available */}
          {!freePlan && !proPlan && (
            <div className="col-span-full text-center py-12 text-white">
              <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Plans Unavailable</h3>
              <p className="text-gray-300">
                Please try refreshing the page or contact support.
              </p>
            </div>
          )}
        </div>

        {/* Additional Info Section */}
        <div className="text-center mt-12 md:mt-16 relative z-10 px-4">
          <p className="text-zinc-400 text-xs md:text-sm mb-4">
            🔒 Secure payments powered by Stripe • Cancel anytime • No hidden
            fees
          </p>

          <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs text-zinc-500">
            <span className="hidden md:inline">•</span>
            <span>🌱 Carbon-neutral infrastructure</span>
            <span className="hidden md:inline">•</span>
            <span>📧 Email support included</span>
          </div>
        </div>
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}