"use client";

import React from "react";

export function GreenSmokeEffect() {
  return (
    <div className="absolute top-0 left-0 w-full h-[70vh] pointer-events-none overflow-hidden">
      {/* Fade out mask to prevent affecting bottom section */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900 pointer-events-none z-10"></div>

      {/* Sharp bright glow at extreme right edge */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-400/40 via-emerald-500/15 to-transparent"></div>

      {/* Intense edge glow */}
      <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-emerald-300/50 via-emerald-400/20 to-transparent"></div>

      {/* Animated glow layers */}
      <div className="glow-container">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
        <div className="glow glow-3"></div>
        <div className="glow glow-4"></div>
        <div className="glow glow-5"></div>
      </div>

      <style jsx>{`
        .glow-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          right: 0;
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          will-change: transform, opacity;
        }

        .glow-1 {
          top: 0%;
          right: -15%;
          width: 900px;
          height: 900px;
          background: radial-gradient(
            circle at center,
            rgba(16, 185, 129, 1) 0%,
            rgba(5, 150, 105, 0.9) 20%,
            rgba(4, 120, 87, 0.6) 40%,
            rgba(6, 95, 70, 0.3) 60%,
            transparent 75%
          );
          animation: moveLeftSlow1 6s ease-in-out infinite;
        }

        .glow-2 {
          top: 25%;
          right: -10%;
          width: 800px;
          height: 800px;
          background: radial-gradient(
            circle at center,
            rgba(34, 197, 94, 0.95) 0%,
            rgba(16, 185, 129, 0.8) 20%,
            rgba(5, 150, 105, 0.5) 40%,
            rgba(4, 120, 87, 0.25) 60%,
            transparent 75%
          );
          animation: moveLeftSlow2 7s ease-in-out infinite;
          animation-delay: -2s;
        }

        .glow-3 {
          top: 50%;
          right: -12%;
          width: 950px;
          height: 950px;
          background: radial-gradient(
            circle at center,
            rgba(5, 150, 105, 0.9) 0%,
            rgba(4, 120, 87, 0.75) 20%,
            rgba(6, 95, 70, 0.45) 40%,
            rgba(4, 120, 87, 0.22) 60%,
            transparent 75%
          );
          animation: moveLeftSlow3 8s ease-in-out infinite;
          animation-delay: -4s;
        }

        .glow-4 {
          top: 15%;
          right: -8%;
          width: 850px;
          height: 850px;
          background: radial-gradient(
            circle at center,
            rgba(16, 185, 129, 0.85) 0%,
            rgba(5, 150, 105, 0.65) 20%,
            rgba(4, 120, 87, 0.4) 40%,
            rgba(6, 95, 70, 0.18) 60%,
            transparent 75%
          );
          animation: moveLeftSlow4 7.5s ease-in-out infinite;
          animation-delay: -5s;
        }

        .glow-5 {
          top: 40%;
          right: -18%;
          width: 1000px;
          height: 1000px;
          background: radial-gradient(
            circle at center,
            rgba(34, 197, 94, 0.8) 0%,
            rgba(16, 185, 129, 0.6) 20%,
            rgba(5, 150, 105, 0.35) 40%,
            rgba(4, 120, 87, 0.15) 60%,
            transparent 75%
          );
          animation: moveLeftSlow5 9s ease-in-out infinite;
          animation-delay: -6s;
        }

        @keyframes moveLeftSlow1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translate(-350px, -50px) scale(1.2) rotate(8deg);
            opacity: 0.8;
          }
        }

        @keyframes moveLeftSlow2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translate(-320px, 40px) scale(1.15) rotate(-5deg);
            opacity: 0.85;
          }
        }

        @keyframes moveLeftSlow3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translate(-380px, -30px) scale(1.25) rotate(6deg);
            opacity: 0.82;
          }
        }

        @keyframes moveLeftSlow4 {
          0%,
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translate(-340px, 35px) scale(1.18) rotate(-4deg);
            opacity: 0.88;
          }
        }

        @keyframes moveLeftSlow5 {
          0%,
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translate(-400px, -45px) scale(1.3) rotate(7deg);
            opacity: 0.8;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .glow-1 {
            width: 700px;
            height: 700px;
            right: -12%;
          }
          .glow-2 {
            width: 650px;
            height: 650px;
            right: -8%;
          }
          .glow-3 {
            width: 750px;
            height: 750px;
            right: -10%;
          }
          .glow-4 {
            width: 680px;
            height: 680px;
            right: -6%;
          }
          .glow-5 {
            width: 800px;
            height: 800px;
            right: -15%;
          }
        }

        @media (max-width: 768px) {
          .glow-1 {
            width: 500px;
            height: 500px;
            right: -18%;
          }
          .glow-2 {
            width: 450px;
            height: 450px;
            right: -12%;
          }
          .glow-3 {
            width: 550px;
            height: 550px;
            right: -15%;
          }
          .glow-4 {
            width: 480px;
            height: 480px;
            right: -10%;
          }
          .glow-5 {
            width: 600px;
            height: 600px;
            right: -20%;
          }
        }
      `}</style>
    </div>
  );
}
