"use client";

import React, { useEffect } from "react";

interface ChatWidgetProps {
  propertyId?: string;
  widgetId?: string;
}

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || "YOUR_PROPERTY_ID",
  widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "YOUR_WIDGET_ID",
}) => {
  useEffect(() => {
    // Initialize Tawk.to if not already loaded
    if (typeof window !== "undefined" && !window.Tawk_API) {
      // Set up Tawk API configuration
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      // Create and inject the Tawk.to script
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");

      // Add script to document
      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }

      // Configure Tawk.to settings
      window.Tawk_API.onLoad = function () {
        console.log("✅ Tawk.to chat widget loaded successfully");

        // Customize the widget appearance to match your theme
        window.Tawk_API.setAttributes({
          name: "Alchemist AI Support",
          email: "", // Let users provide their email
        });

        // Set custom styling to match your dark theme
        window.Tawk_API.customStyle = {
          visibility: {
            desktop: {
              position: "br", // bottom-right
              xOffset: 20,
              yOffset: 20,
            },
            mobile: {
              position: "br",
              xOffset: 10,
              yOffset: 10,
            },
          },
        };

        // 🎨 LOGO CUSTOMIZATION SECTION
        // Add your custom logo here - Replace 'YOUR_LOGO_URL' with your actual logo path
        // Example: '/logo.png' or '/images/alchemist-logo.svg'
        const customLogoUrl = "/public/live-chat_9165147.png"; // 👈 CHANGE THIS TO YOUR LOGO PATH

        // Apply custom CSS to style the chat widget with your logo
        const customCSS = `
          /* Custom logo styling for Tawk.to widget */
          .tawk-min-container .tawk-min-chat-icon {
            background-image: url('${customLogoUrl}') !important;
            background-size: 70% !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            background-color: #1a1a1a !important;
            border: 2px solid #3b82f6 !important;
            border-radius: 50% !important;
          }
          
          /* Hide default Tawk.to logo */
          .tawk-min-container .tawk-min-chat-icon svg {
            display: none !important;
          }
          
          /* Chat window header customization */
          .tawk-chat-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          }
          
          /* Match your dark theme */
          .tawk-chat-panel {
            background-color: #1a1a1a !important;
            color: white !important;
          }
        `;

        // Inject custom CSS
        const styleElement = document.createElement("style");
        styleElement.textContent = customCSS;
        document.head.appendChild(styleElement);
      };

      // Handle when chat is maximized/minimized
      window.Tawk_API.onChatMaximized = function () {
        console.log("📈 Chat window opened");
      };

      window.Tawk_API.onChatMinimized = function () {
        console.log("📉 Chat window minimized");
      };

      // Handle when visitor sends a message
      window.Tawk_API.onChatMessageVisitor = function (message: any) {
        console.log("💬 User sent message:", message);
      };

      // Handle when agent sends a message
      window.Tawk_API.onChatMessageAgent = function (message: any) {
        console.log("🤖 Agent replied:", message);
      };
    }

    // Cleanup function
    return () => {
      // Note: Tawk.to doesn't require explicit cleanup as it handles this internally
    };
  }, [propertyId, widgetId]);

  // This component renders nothing visible - Tawk.to creates its own UI
  return null;
};

export default ChatWidget;
