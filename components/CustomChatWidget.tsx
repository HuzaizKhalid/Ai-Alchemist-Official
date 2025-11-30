"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "admin";
  timestamp: Date;
  senderName?: string;
  senderEmail?: string;
}

interface CustomChatWidgetProps {
  adminEmail?: string;
  siteName?: string;
}

const CustomChatWidget: React.FC<CustomChatWidgetProps> = ({
  adminEmail = "admin@example.com",
  siteName = "Alchemist AI",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hi! Welcome to ${siteName}. How can we help you today?`,
      sender: "admin",
      timestamp: new Date(),
      senderName: "Support Team",
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isEmailSet, setIsEmailSet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendEmailNotification = async (
    message: string,
    userInfo: { name: string; email: string }
  ) => {
    try {
      // Using a simple fetch to send email via your backend
      // You'll need to implement this endpoint
      const response = await fetch("/api/send-chat-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: adminEmail,
          from: userInfo.email,
          senderName: userInfo.name,
          message: message,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.warn("Failed to send email notification");
      }
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    setIsLoading(true);

    // Create new user message
    const newMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage.trim(),
      sender: "user",
      timestamp: new Date(),
      senderName: userName,
      senderEmail: userEmail,
    };

    // Add message to chat
    setMessages((prev) => [...prev, newMessage]);

    // Send email notification to admin
    await sendEmailNotification(currentMessage.trim(), {
      name: userName,
      email: userEmail,
    });

    // Clear input
    setCurrentMessage("");
    setIsLoading(false);

    // Auto-reply after a short delay (optional)
    setTimeout(() => {
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! We'll get back to you as soon as possible via email.",
        sender: "admin",
        timestamp: new Date(),
        senderName: "Support Team",
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1500);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() && userEmail.trim()) {
      setIsEmailSet(true);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
          aria-label="Open chat"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed z-50 bg-slate-900/95 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl flex flex-col overflow-hidden
                    /* Mobile: Better left-aligned with minimal right margin */
                    top-4 left-2 right-2 bottom-4
                    /* Desktop: Traditional chat window */
                    sm:bottom-6 sm:right-6 sm:left-auto sm:top-auto sm:w-96 sm:h-[32rem]">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-violet-600 p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-sm sm:text-base truncate">
              {siteName} Support
            </h3>
            <p className="text-xs text-cyan-100 hidden sm:block">Typically replies instantly</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {!isEmailSet ? (
        /* Email Collection Form */
        <div className="flex-1 px-2 py-3 sm:p-4 flex flex-col justify-center overflow-y-auto">
          <div className="text-center mb-4 px-1 sm:px-2">
            <h4 className="text-slate-200 font-medium mb-2 text-sm sm:text-base">
              Start a conversation
            </h4>
            <p className="text-slate-400 text-xs sm:text-sm">
              We'll send our replies to your email
            </p>
          </div>
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-cyan-400 focus:outline-none text-xs sm:text-sm"
              required
            />
            <input
              type="email"
              placeholder="Your email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-cyan-400 focus:outline-none text-xs sm:text-sm"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white p-2 rounded-lg font-medium hover:shadow-lg transition-all text-xs sm:text-sm"
            >
              Start Chat
            </button>
          </form>
        </div>
      ) : (
        /* Chat Interface */
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-2 py-3 sm:p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[90%] sm:max-w-[80%] p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm break-words",
                    message.sender === "user"
                      ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-br-sm"
                      : "bg-slate-700 text-slate-200 rounded-bl-sm"
                  )}
                >
                  <p>{message.text}</p>
                  <p
                    className={cn(
                      "text-xs mt-1 opacity-70",
                      message.sender === "user"
                        ? "text-cyan-100"
                        : "text-slate-400"
                    )}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-slate-700/50 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !isLoading && handleSendMessage()
                }
                placeholder="Type your message..."
                className="flex-1 p-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-cyan-400 focus:outline-none text-xs sm:text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !currentMessage.trim()}
                className="p-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomChatWidget;
