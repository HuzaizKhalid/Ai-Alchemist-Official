import { cn } from "@/lib/utils";
import React from "react";

const Background = () => {
  return (
    <div className="fixed inset-0 bg-slate-950">
      {/* Main gradient overlay - lighter top, darker bottom */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/30 via-slate-900/20 to-slate-950" />
      </div>

      {/* Center light effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-slate-700/20 via-slate-800/10 to-transparent blur-3xl" />
      </div>

      {/* Top light source */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-b from-slate-600/15 via-slate-700/10 to-transparent" />
      </div>

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 via-transparent to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-slate-950/30" />
      </div>

      {/* Optional: Uncomment for subtle grid texture */}
      {/* <div
        className={cn(
          "absolute inset-0 pointer-events-none animate-diagonal",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)]",
          "opacity-5"
        )}
      /> */}
    </div>
  );
};

export default Background;