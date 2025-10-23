// Research-based environmental impact calculations
export interface EnvironmentalMetrics {
  energyUsage: number; // kWh
  carbonEmissions: number; // g CO₂
  waterUsage: number; // mL
  efficiency: "low" | "medium" | "high";
  tokenCount: number;
}

export interface ModelMetrics {
  energyPerKTokens: number; // kWh per 1000 tokens
  baseWaterPerQuery: number; // mL per query
  baseCarbonPerQuery: number; // g CO₂ per query (inference only)
  fullLifecycleCarbonPerQuery: number; // g CO₂ per query (full lifecycle)
}

// Research-based metrics from Stanford, HuggingFace, MIT
const MODEL_METRICS: Record<string, ModelMetrics> = {
  "gpt-4o": {
    energyPerKTokens: 0.01, // 0.005–0.015 kWh / 1,000 tokens (using middle value)
    baseWaterPerQuery: 0.32, // 0.32 mL per query
    baseCarbonPerQuery: 0.15, // 0.15 g CO₂ per query (inference only)
    fullLifecycleCarbonPerQuery: 2.9, // 1.5–4.3 g CO₂ (using middle value)
  },
  "gpt-4": {
    energyPerKTokens: 0.04, // 0.03–0.05 kWh / 1,000 tokens (using middle value)
    baseWaterPerQuery: 0.45, // Estimated higher for GPT-4
    baseCarbonPerQuery: 0.21, // Scaled from energy usage
    fullLifecycleCarbonPerQuery: 4.1, // Higher for more complex model
  },
  "gpt-3.5-turbo": {
    energyPerKTokens: 0.02, // 0.02 kWh / 1,000 tokens
    baseWaterPerQuery: 0.25, // Lower for smaller model
    baseCarbonPerQuery: 0.12, // Lower carbon footprint
    fullLifecycleCarbonPerQuery: 2.2, // Lower full lifecycle impact
  },
};

export function calculateEnvironmentalImpact(
  modelName: string,
  inputTokens: number,
  outputTokens: number,
  useFullLifecycle = false
): EnvironmentalMetrics {
  const totalTokens = inputTokens + outputTokens;
  const modelKey = getModelKey(modelName);
  const metrics = MODEL_METRICS[modelKey] || MODEL_METRICS["gpt-4o"];

  // Energy calculation based on token count
  const energyUsage = (totalTokens / 1000) * metrics.energyPerKTokens;

  // Water usage scales with energy consumption
  const waterUsage = metrics.baseWaterPerQuery * (totalTokens / 1000);

  // Carbon emissions - choose between inference-only or full lifecycle
  const carbonBase = useFullLifecycle
    ? metrics.fullLifecycleCarbonPerQuery
    : metrics.baseCarbonPerQuery;
  const carbonEmissions = carbonBase * (totalTokens / 1000);

  // Efficiency rating based on energy per token
  let efficiency: "low" | "medium" | "high";
  if (metrics.energyPerKTokens <= 0.015) {
    efficiency = "high";
  } else if (metrics.energyPerKTokens <= 0.03) {
    efficiency = "medium";
  } else {
    efficiency = "low";
  }

  return {
    energyUsage: Math.round(energyUsage * 10000) / 10000, // Round to 4 decimal places
    carbonEmissions: Math.round(carbonEmissions * 100) / 100, // Round to 2 decimal places
    waterUsage: Math.round(waterUsage * 100) / 100, // Round to 2 decimal places
    efficiency,
    tokenCount: totalTokens,
  };
}

function getModelKey(modelName: string): string {
  if (modelName.includes("gpt-4o")) return "gpt-4o";
  if (modelName.includes("gpt-4")) return "gpt-4";
  if (modelName.includes("gpt-3.5")) return "gpt-3.5-turbo";
  return "gpt-4o"; // Default fallback
}

export function getModelDisplayName(modelName: string): string {
  const key = getModelKey(modelName);
  const displayNames: Record<string, string> = {
    "gpt-4o": "GPT-4o",
    "gpt-4": "GPT-4",
    "gpt-3.5-turbo": "GPT-3.5 Turbo",
  };
  return displayNames[key] || "GPT-4o";
}

// CO₂ Offset Calculator Functions based on your specifications
export interface CO2OffsetCalculations {
  treesRequired: number;
  offsetCost: number; // USD
  carMilesEquivalent: number;
  carKilometersEquivalent: number;
  dailyOffsetFromTree: number; // kg CO₂
  treeLiftimeOffset: number; // tCO₂e
}

export function calculateCO2Offset(
  carbonEmissionsGrams: number
): CO2OffsetCalculations {
  // Convert grams to kg and tons
  const emissionsKg = carbonEmissionsGrams / 1000;
  const emissionsTons = emissionsKg / 1000;

  // Constants from your specifications
  const TREE_LIFETIME_OFFSET = 4.6; // tCO₂e per tree over lifetime (200 years)
  const OFFSET_COST_PER_TON = 14; // USD per tCO₂e (average of nature-based and agriculture projects)
  const MILES_PER_KG_CO2 = 0.4; // kg CO₂e per mile driven
  const KM_PER_KG_CO2 = 0.248; // kg CO₂e per km driven
  const DAILY_OFFSET_RATE = 0.063; // kg CO₂ per day (converted from 0.000063 tCO₂e)

  // Calculate trees required (always round up to nearest integer)
  const treesRequired = Math.ceil(emissionsTons / TREE_LIFETIME_OFFSET);

  // Calculate offset cost
  const offsetCost = emissionsTons * OFFSET_COST_PER_TON;

  // Calculate car equivalences
  const carMilesEquivalent = Math.round(emissionsKg / MILES_PER_KG_CO2);
  const carKilometersEquivalent = Math.round(emissionsKg / KM_PER_KG_CO2);

  return {
    treesRequired,
    offsetCost,
    carMilesEquivalent,
    carKilometersEquivalent,
    dailyOffsetFromTree: DAILY_OFFSET_RATE,
    treeLiftimeOffset: TREE_LIFETIME_OFFSET,
  };
}

export interface TreeGrowthCalculation {
  ageInDays: number;
  cumulativeOffsetKg: number; // kg CO₂
  cumulativeOffsetTons: number; // tCO₂e
  yearlyAbsorption: number; // kg CO₂ per year (simplified to average)
}

function toValidDate(input: Date | string | number): Date | null {
  const d = input instanceof Date ? input : new Date(input as any);
  return isNaN(d.getTime()) ? null : d;
}

export function calculateTreeGrowth(
  plantingDate: Date | string | number
): TreeGrowthCalculation {
  const now = new Date();
  const planted = toValidDate(plantingDate);
  const ageInDays = planted
    ? Math.max(
        0,
        Math.floor((now.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24))
      )
    : 0;

  // Daily offset rate: 0.000063 tCO₂e per day
  const DAILY_OFFSET_TONS = 0.000063;
  const DAILY_OFFSET_KG = DAILY_OFFSET_TONS * 1000;

  const cumulativeOffsetTons = ageInDays * DAILY_OFFSET_TONS;
  const cumulativeOffsetKg = cumulativeOffsetTons * 1000;

  // Average yearly absorption (simplified from your growth curve)
  const YEARLY_ABSORPTION_KG = 23; // kg CO₂ per year for mature oak

  return {
    ageInDays,
    cumulativeOffsetKg,
    cumulativeOffsetTons,
    yearlyAbsorption: YEARLY_ABSORPTION_KG,
  };
}

export interface UserTreeBalance {
  totalUserOffset: number; // tCO₂e
  netEmissions: number; // tCO₂e (negative = carbon negative)
  isClimatePositive: boolean;
  surplusOffset: number; // tCO₂e
  surplusValue: number; // USD
}

export function calculateUserTreeBalance(
  totalEmissionsTons: number,
  userTrees: Array<{ plantingDate: Date | string | number }>
): UserTreeBalance {
  // Calculate total offset from user trees
  let totalUserOffset = 0;

  userTrees.forEach((tree) => {
    const growth = calculateTreeGrowth(tree.plantingDate);
    totalUserOffset += growth.cumulativeOffsetTons;
  });

  // Calculate net emissions
  const netEmissions = totalEmissionsTons - totalUserOffset;
  const isClimatePositive = netEmissions < 0;

  // Calculate surplus if climate positive
  const surplusOffset = isClimatePositive ? Math.abs(netEmissions) : 0;
  const surplusValue = surplusOffset * 14; // $14 per tCO₂e

  return {
    totalUserOffset,
    netEmissions,
    isClimatePositive,
    surplusOffset,
    surplusValue,
  };
}

export function formatTreeAge(ageInDays: number): string {
  const years = Math.floor(ageInDays / 365);
  const months = Math.floor((ageInDays % 365) / 30);

  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""} and ${months} month${
      months !== 1 ? "s" : ""
    }`;
  }
  return `${months} month${months !== 1 ? "s" : ""}`;
}

export function getTreeGrowthMessage(
  ageInDays: number,
  cumulativeOffsetKg: number
): string {
  const ageString = formatTreeAge(ageInDays);
  return `Your oak tree is now ${ageString} old — it has absorbed approximately ${cumulativeOffsetKg.toFixed(
    1
  )} kg of CO₂ so far! 🌱`;
}
