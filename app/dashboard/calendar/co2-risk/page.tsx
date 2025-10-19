import { CO2RiskDashboard } from "@/components/CO2RiskDashboard";
import Background from "@/components/Background";

export default function CO2RiskStatisticsPage() {
  return (
    <div className="min-h-screen relative">
      <Background />
      <div className="relative z-10 container max-w-4xl mx-auto px-4 py-8">
        <CO2RiskDashboard totalCO2Emissions={1000} timeFilter="D" />
      </div>
    </div>
  );
}
