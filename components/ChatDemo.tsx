"use client";

import React, { useState } from "react";
import { Settings, MessageCircle, Mail, ExternalLink } from "lucide-react";

const ChatDemo: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);

  if (!showDemo) {
    return (
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setShowDemo(true)}
          className="bg-slate-800/80 backdrop-blur-sm text-slate-300 p-2 rounded-lg border border-slate-700/50 hover:bg-slate-700/80 transition-all text-sm flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Chat Demo
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-40 bg-slate-900/95 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-200 font-semibold">Chat Integration Demo</h3>
        <button
          onClick={() => setShowDemo(false)}
          className="text-slate-400 hover:text-slate-200"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-200 font-medium text-sm">
              Custom Chat Widget
            </span>
            <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded-full">
              ACTIVE
            </span>
          </div>
          <p className="text-slate-400 text-xs mb-3">
            Custom-built chat with email integration. Messages sent directly to
            admin email.
          </p>
          <div className="flex items-center gap-2 text-xs">
            <Mail className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-300">Email notifications</span>
          </div>
        </div>

        <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/20">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-violet-400" />
            <span className="text-slate-200 font-medium text-sm">
              Tawk.to Widget
            </span>
            <span className="text-slate-500 text-xs bg-slate-700/50 px-2 py-1 rounded-full">
              AVAILABLE
            </span>
          </div>
          <p className="text-slate-400 text-xs mb-3">
            Third-party live chat service. Professional features and mobile
            apps.
          </p>
          <div className="flex items-center gap-2 text-xs">
            <ExternalLink className="w-3 h-3 text-violet-400" />
            <span className="text-slate-300">External service</span>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-slate-400 text-xs">
            💡 Look for the chat bubble in the bottom-right corner
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatDemo;
