"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  CheckCircle,
  Calendar,
  DollarSign,
  Crown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Payment {
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  description: string;
  transactionId: string;
}

export default function PaymentInfoBlock() {
  const { user } = useAuth();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number, currency: string): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const truncateTransactionId = (id: string, length: number = 20): string => {
    return id.length > length ? `${id.substring(0, length)}...` : id;
  };

  useEffect(() => {
    // Reset states when user changes
    setPayment(null);
    setError(null);
    setLoading(true);

    // Check if user exists and has a valid ID
    if (!user) {
      console.log("User not authenticated, skipping payment fetch");
      setLoading(false);
      return;
    }

    if (!user.id) {
      console.error("User ID is null or undefined");
      setError("User authentication error: Missing user ID");
      setLoading(false);
      return;
    }

    // Validate user ID format (optional - adjust based on your ID format)
    if (typeof user.id !== "string" || user.id.trim() === "") {
      console.error("Invalid user ID format:", user.id);
      setError("User authentication error: Invalid user ID");
      setLoading(false);
      return;
    }

    // Fetch payment data from API
    const fetchPaymentData = async (): Promise<Payment[]> => {
      try {
        const response = await fetch(
          `/api/payments/${encodeURIComponent(user.id)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            // Add credentials if needed for authentication
            credentials: "include",
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Authentication failed");
          } else if (response.status === 404) {
            throw new Error("No payment data found");
          } else {
            throw new Error(
              `Failed to fetch payment data: ${response.status} ${response.statusText}`
            );
          }
        }

        const data = await response.json();

        // Validate response structure
        if (!data || !Array.isArray(data.payments)) {
          throw new Error("Invalid payment data format received");
        }

        return data.payments;
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        throw fetchError;
      }
    };

    fetchPaymentData()
      .then((payments: Payment[]) => {
        console.log("Fetched payments:", payments);
        setPayment(payments[0] || null);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching payment data:", error);
        setError(error.message || "Failed to load payment information");
        setPayment(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]); // Only depend on user object

  // Loading state
  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl font-semibold">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>Recent Payment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-white/70">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading payment information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl font-semibold">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span>Payment Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Unable to Load Payment Information
            </h3>
            <p className="text-white/70 max-w-md mx-auto text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200"
          >
            Try Again
          </button>
        </CardContent>
      </Card>
    );
  }

  // No user authenticated state
  if (!user) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl font-semibold">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <span>Authentication Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Please Log In
            </h3>
            <p className="text-white/70 max-w-md mx-auto text-sm">
              You need to be logged in to view your payment information.
            </p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200"
          >
            Go to Login
          </button>
        </CardContent>
      </Card>
    );
  }

  // No payment data state
  if (!payment) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl font-semibold">
            <Crown className="w-5 h-5 text-amber-400" />
            <span>No Payments Yet</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12 space-y-6">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Crown className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Become a Pro Member
              </h3>
              <p className="text-white/70 max-w-md mx-auto">
                Unlock premium features and get access to advanced tools by
                upgrading to our Pro membership.
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/pricing")}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Crown className="w-5 h-5 mr-2" />
            View Pricing Plans
          </button>

          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-white/50">
              Start your premium journey today
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success state with payment data
  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/10 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-xl font-semibold">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>Recent Payment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Amount */}
          <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
            <DollarSign className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-emerald-400 mb-1">
              {formatAmount(payment.amount, payment.currency)}
            </div>
            <p className="text-xs text-white/70">Payment Amount</p>
          </div>

          {/* Status */}
          <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 mb-1">
              {payment.status}
            </Badge>
            <p className="text-xs text-white/70">Status</p>
          </div>

          {/* Payment Method */}
          <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
            <CreditCard className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-sm font-medium text-white mb-1 capitalize">
              {payment.paymentMethod}
            </div>
            <p className="text-xs text-white/70">Payment Method</p>
          </div>

          {/* Date */}
          <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
            <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-sm font-medium text-white mb-1">
              {formatDate(payment.createdAt).split(",")[0]}
            </div>
            <p className="text-xs text-white/70">Payment Date</p>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="pt-4 border-t border-white/10">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-white/70 mb-2">Description</p>
              <p className="text-white bg-white/5 rounded-lg p-3 text-sm">
                {payment.description}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/70 mb-2">Transaction ID</p>
              <div className="bg-white/5 rounded-lg p-3">
                <p
                  className="text-white text-sm font-mono"
                  title={payment.transactionId}
                >
                  {truncateTransactionId(payment.transactionId)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Time */}
        <div className="pt-2">
          <p className="text-xs text-white/50 text-center">
            Processed on {formatDate(payment.createdAt)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}