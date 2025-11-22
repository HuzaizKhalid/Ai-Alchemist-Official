"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CustomFeedbackFormProps {
  userEmail?: string;
  userId?: string;
  userPlan?: string;
}

export function CustomFeedbackForm({
  userEmail,
  userId,
  userPlan,
}: CustomFeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    email: userEmail || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use Featurebase widget instead of API
      if (typeof window !== "undefined" && (window as any).Featurebase) {
        (window as any).Featurebase("open", {
          prefill: {
            title: formData.title,
            content: formData.description,
            email: formData.email,
          },
        });

        toast.success("Opening feedback widget with your details...");

        // Reset form after a delay
        setTimeout(() => {
          setFormData({
            title: "",
            description: "",
            email: userEmail || "",
          });
        }, 1000);
      } else {
        toast.error(
          "Feedback widget is loading, please try again in a moment."
        );
      }
    } catch (error) {
      console.error("Error opening feedback widget:", error);
      toast.error("An error occurred. Please try the feedback button instead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <MessageSquare className="w-6 h-6 text-emerald-400" />
          Quick Feedback Form
        </CardTitle>
        <p className="text-sm text-slate-400">
          Fill in your details and we'll open the feedback widget for you
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Title
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief description of your feedback"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please provide details about your feedback, feature request, or issue..."
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 min-h-[120px]"
              disabled={isSubmitting}
              required
            />
          </div>

          {!userEmail && (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email (optional)
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                disabled={isSubmitting}
              />
              <p className="text-xs text-slate-400 mt-1">
                We'll use this to keep you updated on your feedback
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Opening Widget...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Open Widget with Details
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
