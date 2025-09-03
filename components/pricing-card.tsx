"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Loader2,
  ExternalLink,
  Zap,
  Shield,
  Headphones,
  TrendingUp,
} from "lucide-react";
import { JSX } from "react";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  price_id: string;
}

interface PricingCardProps {
  plan: Plan;
  isCurrentPlan?: boolean;
  onSubscribe?: (priceId: string) => void;
  isLoading?: boolean;
}

interface PlanFeature {
  text: string;
  icon: React.ReactNode;
  highlighted?: boolean;
}

// Static features for the Pro plan - you can make this dynamic too if needed
const getProPlanFeatures = (): PlanFeature[] => [
  {
    text: "Unlimited searches",
    icon: <Zap className="w-4 h-4" />,
    highlighted: true,
  },
  {
    text: "No API key required",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    text: "Priority support",
    icon: <Headphones className="w-4 h-4" />,
  },
  {
    text: "Advanced analytics & insights",
    icon: <TrendingUp className="w-4 h-4" />,
    highlighted: true,
  },
];

export function PricingCard({
  plan,
  isCurrentPlan = false,
  onSubscribe,
  isLoading = false,
}: PricingCardProps): JSX.Element {
  const features = getProPlanFeatures();

  // const handleUpgradeClick = (): void => {
  //   if (onSubscribe && plan.price_id) {
  //     onSubscribe(plan.price_id);
  //   } else {
  //     // Fallback to direct Stripe checkout if no onSubscribe handler
  //     window.open(
  //       "https://buy.stripe.com/test_5kQ8wOfXJ136d19ahN6Ri01",
  //       "_blank",
  //       "noopener,noreferrer"
  //     );
  //   }
  // };

  // Calculate discount percentage if you have original price data
  const originalPrice = 999; // You can make this dynamic or remove if not needed
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - plan.price) / originalPrice) * 100)
    : 0;

  return (
    <Card
      className={`relative flex flex-col backdrop-blur-xl border text-white transition-all duration-500 hover:scale-[1.02] group shadow-2xl ${
        isCurrentPlan
          ? "bg-gradient-to-br from-emerald-900/40 to-cyan-900/40 border-emerald-400/60 shadow-emerald-500/20"
          : "bg-gradient-to-br from-black/40 to-emerald-900/20 border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-emerald-500/10"
      }`}
    >
      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold rounded-full px-6 py-2 animate-pulse shadow-lg">
          Current Plan
        </Badge>
      )}

      <CardHeader className="text-center relative">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent mb-2">
            {plan.name}
          </CardTitle>

          <p className="text-sm text-gray-400 mb-4">{plan.description}</p>

          <div className="flex items-center justify-center gap-3 mb-2">
            {originalPrice && plan.price < originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ${(originalPrice / 100).toFixed(0)}
              </span>
            )}

            <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
              ${(plan.price / 100).toFixed(0)}
            </div>
          </div>

          <span className="text-lg font-normal text-gray-400">
            /{plan.interval}
          </span>

          {discountPercentage > 0 && (
            <div className="mt-2">
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                Save {discountPercentage}%
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-8 flex-1 flex flex-col justify-between px-6 pb-8">
        {/* Features List */}
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-emerald-400 mb-4 uppercase tracking-wider">
            What's Included:
          </h4>

          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center space-x-3 opacity-0 animate-[slideInLeft_0.6s_ease_forwards] group-hover:translate-x-1 transition-transform duration-300"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 ${
                    feature.highlighted
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-gray-700/50 text-gray-300"
                  }`}
                >
                  {feature.icon}
                </div>

                <span
                  className={`text-sm font-medium ${
                    feature.highlighted ? "text-emerald-300" : "text-gray-300"
                  }`}
                >
                  {feature.text}
                </span>

                {feature.highlighted && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 border-emerald-500/30">
                    Popular
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => onSubscribe && onSubscribe(plan.price_id)}
          disabled={isCurrentPlan || isLoading}
          className={`w-full mt-8 rounded-full font-bold transition-all duration-300 transform group-hover:scale-105 ${
            isCurrentPlan
              ? "bg-emerald-500/30 text-emerald-300 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:from-emerald-400 hover:to-cyan-400 shadow-lg hover:shadow-emerald-500/30 active:scale-95"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : isCurrentPlan ? (
            <div className="flex items-center justify-center">
              <Check className="w-5 h-5 mr-2" />
              <span>Active Plan</span>
            </div>
          ) : (
            <div className="flex items-center justify-center group">
              <span>Upgrade to {plan.name}</span>
              <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </div>
          )}
        </Button>

        {/* Trust Indicators */}
        {!isCurrentPlan && (
          <div className="flex items-center justify-center text-xs text-gray-500 mt-4 space-x-4">
            <span>✨ Instant access</span>
            <span>•</span>
            <span>🔒 Secure checkout</span>
            <span>•</span>
            <span>↩️ Cancel anytime</span>
          </div>
        )}
      </CardContent>

      {/* Animated Border Effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </Card>
  );
}