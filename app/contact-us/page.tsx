"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  Edit3,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

// Mock auth hook for demo - replace with your actual auth implementation

// Types
interface User {
  email: string;
}

interface FormData {
  email: string;
  subject: string;
  message: string;
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

// Background Component
const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 via-transparent to-cyan-900/20" />
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
          }}
        />
      </div>
    </div>
  );
};

// Themed UI Components
const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  onClick,
  type = "button",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/25 disabled:opacity-50 disabled:pointer-events-none shadow-lg backdrop-blur-sm";

  const variants = {
    default:
      "bg-emerald-400 hover:bg-emerald-300 text-black hover:shadow-xl hover:shadow-emerald-400/20",
    outline:
      "border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-xl",
    ghost: "text-white hover:bg-white/10 backdrop-blur-sm",
    secondary:
      "bg-white/12 text-white hover:bg-white/20 border border-white/12 backdrop-blur-xl",
  };

  const sizes = {
    default: "h-10 py-2 px-6",
    sm: "h-9 px-4 text-xs",
    lg: "h-12 px-8 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      className={`flex h-12 w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-3 text-sm text-white placeholder:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/25 focus-visible:border-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 shadow-lg ${className}`}
      {...props}
    />
  );
};

const Textarea: React.FC<TextareaProps> = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`flex min-h-[120px] w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-3 text-sm text-white placeholder:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/25 focus-visible:border-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 resize-y shadow-lg ${className}`}
      {...props}
    />
  );
};

const Label: React.FC<LabelProps> = ({ children, htmlFor, className = "" }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-semibold text-white drop-shadow-sm ${className}`}
    >
      {children}
    </label>
  );
};

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-2xl bg-white/5 backdrop-blur-xl border border-white/12 text-white shadow-2xl ${className}`}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`flex flex-col space-y-2 p-8 ${className}`}>{children}</div>
  );
};

const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
}) => {
  return <div className={`px-8 pb-8 ${className}`}>{children}</div>;
};

const CardTitle: React.FC<CardTitleProps> = ({ children, className = "" }) => {
  return (
    <h3 className={`text-2xl font-bold text-white drop-shadow-md ${className}`}>
      {children}
    </h3>
  );
};

const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = "",
}) => {
  return <p className={`text-base text-zinc-300 ${className}`}>{children}</p>;
};

// Status Messages Component
const StatusMessage: React.FC<{
  type: "success" | "error" | "loading";
  message: string;
  onClose?: () => void;
}> = ({ type, message, onClose }) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
    error: <AlertCircle className="h-5 w-5 text-red-400" />,
    loading: <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />,
  };

  const colors = {
    success: "border-emerald-400/50 bg-emerald-400/10",
    error: "border-red-400/50 bg-red-400/10",
    loading: "border-cyan-400/50 bg-cyan-400/10",
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-xl ${colors[type]}`}
    >
      {icons[type]}
      <span className="text-white text-sm flex-1">{message}</span>
      {onClose && type !== "loading" && (
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white ml-2"
        >
          ×
        </button>
      )}
    </div>
  );
};

const ContactUs: React.FC = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const [formData, setFormData] = useState<FormData>({
    email: "",
    subject: "",
    message: "",
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isEmailEditable, setIsEmailEditable] = useState<boolean>(
    !isAuthenticated
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "loading";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (isAuthenticated && user?.email && formData.email !== user.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
      }));
      setIsEmailEditable(false);
    }
  }, [isAuthenticated, user?.email]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditEmail = (): void => {
    setIsEmailEditable(true);
    setIsEditing(true);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    setStatusMessage({
      type: "loading",
      message: "Sending your message...",
    });

    try {
      const emailData = {
        subject: formData.subject,
        text: formData.message,
        senderEmail: formData.email,
        senderName: user?.email ? "Authenticated User" : "Website Visitor",
        // You can specify a recipient email here or let the API use default
        // to: 'support@yourcompany.com'
      };

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMessage({
          type: "success",
          message: "Message sent successfully! We'll get back to you soon.",
        });

        // Reset form after successful submission
        setFormData({
          email: isAuthenticated && user?.email ? user.email : "",
          subject: "",
          message: "",
        });

        // Reset editing state
        setIsEditing(false);
        if (isAuthenticated) {
          setIsEmailEditable(false);
        }

        console.log("Email sent successfully:", result);
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      setStatusMessage({
        type: "error",
        message:
          error.message || "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const router = useRouter();

  const handleGoBack = (): void => {
    router.push("/");
    setIsEditing(false);
    setIsEmailEditable(false);
  };

  const handleCancel = (): void => {
    if (isAuthenticated && user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
      setIsEmailEditable(false);
    }
    setIsEditing(false);
  };

  const clearStatusMessage = () => {
    setStatusMessage(null);
  };

  const isFormValid: boolean = !!(
    formData.email &&
    formData.subject &&
    formData.message
  );

  return (
    <>
      <Background />
      <main className="min-h-screen py-12 px-4 relative">
        <div className="max-w-2xl mx-auto pt-16 md:pt-28">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="flex items-center gap-2 text-zinc-300 hover:text-white"
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="mb-6">
              <StatusMessage
                type={statusMessage.type}
                message={statusMessage.message}
                onClose={clearStatusMessage}
              />
            </div>
          )}

          {/* Contact Form Card */}
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
                <Mail className="h-8 w-8 text-emerald-300 drop-shadow-lg" />
              </div>
              <CardTitle className="text-3xl mb-2">Contact Us</CardTitle>
              <CardDescription className="text-lg">
                Send us a message and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-8">
                {/* Email Field */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email">Email Address</Label>
                    {isAuthenticated && !isEmailEditable && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleEditEmail}
                        className="h-auto p-2 text-xs text-zinc-400 hover:text-white"
                        disabled={isSubmitting}
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEmailEditable || isSubmitting}
                      className={`pl-12 ${
                        !isEmailEditable ? "bg-white/5 text-zinc-300" : ""
                      }`}
                      required
                    />
                  </div>
                  {isAuthenticated && !isEmailEditable && (
                    <p className="text-xs text-zinc-400">
                      Using your account email. Click edit to change.
                    </p>
                  )}
                </div>

                {/* Subject Field */}
                <div className="space-y-3">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-3">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="min-h-[140px]"
                    disabled={isSubmitting}
                    required
                  />
                  <div className="text-xs text-zinc-400 text-right font-mono">
                    {formData.message.length} characters
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={handleSubmit}
                    disabled={!isFormValid || isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 text-base font-bold"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>

                  {isEditing && (
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      size="lg"
                      className="px-6"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/12">
              <p className="text-zinc-300 text-base">
                We typically respond within 24 hours during business days.
              </p>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm text-zinc-400">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Fast Response
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  Professional Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ContactUs;
