"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

declare global {
  interface Window {
    Featurebase: any;
  }
}

interface FeaturebaseWidgetProps {
  variant?: "button" | "inline";
  className?: string;
  buttonText?: string;
}

/**
 * Featurebase Widget Component
 *
 * This component provides easy access to the Featurebase feedback widget.
 *
 * @param variant - Display type: "button" (default) shows a clickable button, "inline" renders nothing but ensures widget is loaded
 * @param className - Additional CSS classes for the button
 * @param buttonText - Custom text for the button (default: "Give Feedback")
 *
 * @example
 * // As a button
 * <FeaturebaseWidget />
 *
 * @example
 * // Custom button text
 * <FeaturebaseWidget buttonText="Share Your Ideas" />
 *
 * @example
 * // Inline (for programmatic control)
 * <FeaturebaseWidget variant="inline" />
 */
export function FeaturebaseWidget({
  variant = "button",
  className = "",
  buttonText = "Give Feedback",
}: FeaturebaseWidgetProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if Featurebase is loaded
    const checkFeaturebase = () => {
      if (typeof window !== "undefined" && window.Featurebase) {
        setIsReady(true);
      }
    };

    // Initial check
    checkFeaturebase();

    // Retry check in case script is still loading
    const timer = setTimeout(checkFeaturebase, 1000);
    const timer2 = setTimeout(checkFeaturebase, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  const openWidget = () => {
    if (typeof window !== "undefined" && window.Featurebase) {
      window.Featurebase("open_feedback_widget");
    }
  };

  if (variant === "inline") {
    return null;
  }

  return (
    <Button
      onClick={openWidget}
      disabled={!isReady}
      className={className}
      variant="outline"
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      {buttonText}
    </Button>
  );
}

/**
 * Hook to programmatically control Featurebase widget
 *
 * @example
 * const { openWidget, isReady, identifyUser } = useFeaturebase();
 *
 * // Open the widget
 * openWidget();
 *
 * // Identify a user
 * identifyUser({ email: 'user@example.com', name: 'John Doe' });
 */
export function useFeaturebase() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkFeaturebase = () => {
      if (typeof window !== "undefined" && window.Featurebase) {
        setIsReady(true);
      }
    };

    checkFeaturebase();
    const timer = setTimeout(checkFeaturebase, 1000);

    return () => clearTimeout(timer);
  }, []);

  const openWidget = () => {
    if (typeof window !== "undefined" && window.Featurebase) {
      window.Featurebase("open_feedback_widget");
    }
  };

  const identifyUser = (userData: {
    email?: string;
    name?: string;
    userId?: string;
    [key: string]: any;
  }) => {
    if (typeof window !== "undefined" && window.Featurebase) {
      window.Featurebase("identify", userData);
    }
  };

  return {
    openWidget,
    identifyUser,
    isReady,
  };
}
