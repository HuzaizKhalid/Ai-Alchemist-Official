"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Leaf,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Show loading toast
    const loadingToast = toast.loading("Signing you in...", {
      description: "Please wait while we verify your credentials",
    });

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success("Welcome back!", {
          description: "You've been successfully signed in.",
          icon: <CheckCircle2 className="h-4 w-4" />,
          duration: 3000,
          style: {
            zIndex: 9999,
          },
        });

        onClose();
        // Add slight delay for better UX
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        // Dismiss loading toast and show error
        toast.dismiss(loadingToast);
        toast.error("Sign in failed", {
          description:
            data?.message || "Invalid email or password. Please try again.",
          icon: <AlertCircle className="h-4 w-4" />,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      toast.dismiss(loadingToast);
      toast.error("Connection error", {
        description:
          "Unable to connect to our servers. Please check your internet connection and try again.",
        icon: <AlertCircle className="h-4 w-4" />,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate API key format for free tier
    if (apiKey && !apiKey.startsWith("sk-")) {
      toast.error("Invalid API key format", {
        description: "OpenAI API keys should start with 'sk-'",
        icon: <AlertCircle className="h-4 w-4" />,
        duration: 4000,
        style: {
          zIndex: 9999,
        },
      });
      setIsLoading(false);
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Creating your account...", {
      description: "Setting up your Alchemist AI experience",
    });

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, apiKey }),
      });

      const data = await response.json();

      if (response.ok) {
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success("Account created successfully!", {
          description: `Welcome to Alchemist AI, ${name}! You're all set to get started.`,
          icon: <CheckCircle2 className="h-4 w-4" />,
          duration: 4000,
          style: {
            zIndex: 9999,
          },
        });

        onClose();
        // Add slight delay for better UX
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        // Dismiss loading toast and show specific error
        toast.dismiss(loadingToast);

        if (response.status === 409) {
          toast.error("Email already exists", {
            description:
              "An account with this email already exists. Try signing in instead.",
            icon: <AlertCircle className="h-4 w-4" />,
            duration: 5000,
          });
        } else if (response.status === 400) {
          toast.error("Invalid information", {
            description:
              data?.message || "Please check your information and try again.",
            icon: <AlertCircle className="h-4 w-4" />,
            duration: 5000,
          });
        } else {
          toast.error("Sign up failed", {
            description:
              data?.message || "Unable to create account. Please try again.",
            icon: <AlertCircle className="h-4 w-4" />,
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error("Sign up failed:", error);
      toast.dismiss(loadingToast);
      toast.error("Connection error", {
        description:
          "Unable to connect to our servers. Please check your internet connection and try again.",
        icon: <AlertCircle className="h-4 w-4" />,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Image
              src={"/earth.png"}
              alt={"Earth Logo"}
              className="w-10 h-10 lg:w-12 lg:h-12"
              width={48}
              height={48}
            />
          </div>
          <DialogTitle className="text-center text-2xl">
            Welcome to Alchemist Ai
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name"> Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your Username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Create a password"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">OpenAI API Key (Free Tier)</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Required for free tier. Get yours from OpenAI dashboard.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Free tier: 3 searches per day</p>
          <p>Pro plan: Unlimited searches for $5/month</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}