"use client";

import React, { useState } from "react";
import { X, Send } from "lucide-react";
import Image from "next/image";

interface CustomChatWidgetProps {
  adminEmail: string;
  siteName: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const CustomChatWidget: React.FC<CustomChatWidgetProps> = ({
  adminEmail,
  siteName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/send-chat-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          adminEmail,
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setShowForm(false);
        setFormData({ name: "", email: "", subject: "", message: "" });

        // Auto close after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setIsOpen(false);
        }, 5000);
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }

    setIsLoading(false);
  };

  const resetChat = () => {
    setShowForm(false);
    setShowSuccess(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      {/* Mobile: "24/7 Live support" text only */}
      <div className="fixed z-50 top-32 left-6 sm:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          data-chat-widget
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                     text-white px-3 py-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105
                     text-sm font-medium"
        >
          💬 24/7 Live support
        </button>
      </div>

      {/* Desktop: Traditional chat icon (hidden on mobile) */}
      <div className="fixed z-50 bottom-6 right-6 hidden sm:block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          data-chat-widget
          className="relative group bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                     rounded-full p-2.5 shadow-2xl transition-all duration-300 transform hover:scale-105
                     ring-4 ring-blue-500/20 hover:ring-blue-500/40"
        >
          {/* Your Custom Logo */}
          <Image
            src="/live-chat_9165147.png"
            alt="Chat Support"
            width={28}
            height={28}
            className="w-7 h-7 object-contain filter brightness-0 invert"
            priority
          />

          {/* Notification dot (optional) */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      </div>

      {/* Chat Window - Responsive positioning */}
      {isOpen && (
        <div
          className="fixed z-50 w-96 h-[32rem] bg-gray-900/95 backdrop-blur-xl 
                        rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden
                        max-h-[90vh]
                        /* Mobile: Position below top-left icon */
                        top-36 left-6
                        /* Desktop: Traditional positioning */
                        sm:bottom-20 sm:right-6 sm:left-auto sm:top-auto sm:w-80 sm:h-[28rem]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Image
                src="/live-chat_9165147.png"
                alt="Support"
                width={24}
                height={24}
                className="w-6 h-6 object-contain filter brightness-0 invert"
              />
              <div>
                <h3 className="text-white font-semibold">{siteName} Support</h3>
                <p className="text-blue-100 text-xs">We're here to help!</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                resetChat();
              }}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex flex-col h-full">
            {!showForm && !showSuccess && (
              /* Welcome Screen */
              <div className="p-6 flex-1 flex flex-col justify-center items-center space-y-6">
                <div className="text-center">
                  <h4 className="text-white text-lg font-medium mb-2">
                    👋 Hi! How can we help?
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Click below to get started
                  </p>
                </div>

                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                           text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105
                           shadow-lg hover:shadow-xl"
                >
                  💬 I have a question
                </button>
              </div>
            )}

            {showForm && (
              /* Contact Form */
              <div className="flex flex-col h-full">
                <div className="p-4 flex-1 overflow-y-auto">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg 
                                 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none
                                 transition-colors text-sm"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg 
                                 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none
                                 transition-colors text-sm"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg 
                                 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none
                                 transition-colors text-sm"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg 
                                 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none
                                 transition-colors text-sm resize-none"
                        placeholder="Tell us how we can help..."
                      />
                    </div>
                  </form>
                </div>

                {/* Fixed Button Area */}
                <div className="p-4 border-t border-gray-700/50 bg-gray-900/95">
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg
                               transition-colors text-sm font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      onClick={handleSubmit}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
                               hover:from-blue-600 hover:to-purple-700 text-white rounded-lg
                               transition-all text-sm font-medium disabled:opacity-50 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={14} className="mr-1" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showSuccess && (
              /* Success Screen */
              <div className="p-6 flex-1 flex flex-col justify-center items-center space-y-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <h4 className="text-white text-lg font-medium mb-2">
                    ✅ Message Sent Successfully!
                  </h4>
                  <p className="text-gray-400 text-sm">
                    We have received your message and will get back to you soon.
                  </p>
                  <p className="text-blue-400 text-xs mt-2">
                    This window will close automatically...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CustomChatWidget;
