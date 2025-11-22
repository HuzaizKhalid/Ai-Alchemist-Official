"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ArrowLeft, Send, Mail } from "lucide-react";
import { toast } from "sonner";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          "Feedback submitted successfully! We'll get back to you soon."
        );
        setFormData({
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(result.error || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
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
          <h1 className="text-4xl font-bold text-white mb-2">
            We Value Your Feedback
          </h1>
          <p className="text-slate-400">
            Help us improve Alchemist AI by sharing your thoughts, ideas, and
            feature requests.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Info Cards */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-colors">
            <CardContent className="pt-6 text-center">
              <MessageSquare className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Share Ideas</h3>
              <p className="text-slate-400 text-sm">
                Suggest features and improvements
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-colors">
            <CardContent className="pt-6 text-center">
              <Mail className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Report Issues</h3>
              <p className="text-slate-400 text-sm">
                Let us know about bugs and problems
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-colors">
            <CardContent className="pt-6 text-center">
              <Send className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Get Support</h3>
              <p className="text-slate-400 text-sm">
                Ask questions and get help
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Form */}
        <Card className="bg-slate-800/50 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              Send Us Your Feedback
            </CardTitle>
            <p className="text-slate-400 text-sm">
              We read every message and typically respond within 24 hours
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Your Email Address <span className="text-red-400">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Subject Field */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Subject <span className="text-red-400">*</span>
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief description of your feedback"
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Your Message <span className="text-red-400">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please provide detailed feedback, suggestions, or describe any issues you're experiencing..."
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 min-h-[180px] focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isSubmitting}
                  required
                />
                <p className="text-xs text-slate-400 mt-2">
                  The more details you provide, the better we can help you
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-emerald-500/20 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending Feedback...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Your feedback will be sent to our team at{" "}
            <span className="text-emerald-400 font-medium">
              paulsemz17@gmail.com
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
