"use client";

import React from "react";

export function GreenSmokeEffect() {
  return (
    <div className="fixed top-0 right-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {/* Multiple smoke layers for depth */}
      <div className="smoke-container">
        <div className="smoke smoke-1"></div>
        <div className="smoke smoke-2"></div>
        <div className="smoke smoke-3"></div>
        <div className="smoke smoke-4"></div>
        <div className="smoke smoke-5"></div>
      </div>

      <style jsx>{`
        .smoke-container {
          position: absolute;
          top: 0;
          right: -10%;
          width: 100%;
          height: 100%;
          opacity: 0.8;
        }

        .smoke {
          position: absolute;
          right: -20%;
          width: 1000px;
          height: 1000px;
          background: radial-gradient(
            circle,
            rgba(34, 197, 94, 0.7) 0%,
            rgba(34, 197, 94, 0.5) 25%,
            rgba(16, 185, 129, 0.3) 50%,
            rgba(5, 150, 105, 0.15) 70%,
            transparent 85%
          );
          border-radius: 50%;
          filter: blur(80px);
          animation: smokeFloat 20s infinite ease-in-out;
        }

        .smoke-1 {
          top: 10%;
          animation-delay: 0s;
          animation-duration: 25s;
          opacity: 1;
        }

        .smoke-2 {
          top: 30%;
          animation-delay: 5s;
          animation-duration: 30s;
          opacity: 0.9;
          background: radial-gradient(
            circle,
            rgba(16, 185, 129, 0.6) 0%,
            rgba(16, 185, 129, 0.4) 25%,
            rgba(5, 150, 105, 0.25) 50%,
            rgba(4, 120, 87, 0.12) 70%,
            transparent 85%
          );
        }

        .smoke-3 {
          top: 50%;
          animation-delay: 10s;
          animation-duration: 35s;
          opacity: 0.85;
        }

        .smoke-4 {
          top: 70%;
          animation-delay: 15s;
          animation-duration: 28s;
          opacity: 0.95;
          background: radial-gradient(
            circle,
            rgba(5, 150, 105, 0.65) 0%,
            rgba(5, 150, 105, 0.45) 25%,
            rgba(4, 120, 87, 0.3) 50%,
            rgba(6, 95, 70, 0.15) 70%,
            transparent 85%
          );
        }

        .smoke-5 {
          top: 20%;
          animation-delay: 8s;
          animation-duration: 32s;
          opacity: 0.8;
          background: radial-gradient(
            circle,
            rgba(16, 185, 129, 0.55) 0%,
            rgba(5, 150, 105, 0.35) 25%,
            rgba(4, 120, 87, 0.22) 50%,
            rgba(6, 95, 70, 0.1) 70%,
            transparent 85%
          );
        }

        @keyframes smokeFloat {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          50% {
            transform: translate(-30%, -20%) rotate(180deg) scale(1.3);
            opacity: 1;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translate(-60%, -40%) rotate(360deg) scale(0.9);
            opacity: 0;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .smoke {
            width: 600px;
            height: 600px;
          }
          
          .smoke-container {
            right: -20%;
          }
        }

        @media (max-width: 480px) {
          .smoke {
            width: 400px;
            height: 400px;
          }
        }
      `}</style>
    </div>
  );
}
