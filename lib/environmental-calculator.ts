// Research-based environmental impact calculations
export interface EnvironmentalMetrics {
  energyUsage: number // kWh
  carbonEmissions: number // g CO₂
  waterUsage: number // mL
  efficiency: "low" | "medium" | "high"
  tokenCount: number
}

export interface ModelMetrics {
  energyPerKTokens: number // kWh per 1000 tokens
  baseWaterPerQuery: number // mL per query
  baseCarbonPerQuery: number // g CO₂ per query (inference only)
  fullLifecycleCarbonPerQuery: number // g CO₂ per query (full lifecycle)
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
}

export function calculateEnvironmentalImpact(
  modelName: string,
  inputTokens: number,
  outputTokens: number,
  useFullLifecycle = false,
): EnvironmentalMetrics {
  const totalTokens = inputTokens + outputTokens
  const modelKey = getModelKey(modelName)
  const metrics = MODEL_METRICS[modelKey] || MODEL_METRICS["gpt-4o"]

  // Energy calculation based on token count
  const energyUsage = (totalTokens / 1000) * metrics.energyPerKTokens

  // Water usage scales with energy consumption
  const waterUsage = metrics.baseWaterPerQuery * (totalTokens / 1000)

  // Carbon emissions - choose between inference-only or full lifecycle
  const carbonBase = useFullLifecycle ? metrics.fullLifecycleCarbonPerQuery : metrics.baseCarbonPerQuery
  const carbonEmissions = carbonBase * (totalTokens / 1000)

  // Efficiency rating based on energy per token
  let efficiency: "low" | "medium" | "high"
  if (metrics.energyPerKTokens <= 0.015) {
    efficiency = "high"
  } else if (metrics.energyPerKTokens <= 0.03) {
    efficiency = "medium"
  } else {
    efficiency = "low"
  }

  return {
    energyUsage: Math.round(energyUsage * 10000) / 10000, // Round to 4 decimal places
    carbonEmissions: Math.round(carbonEmissions * 100) / 100, // Round to 2 decimal places
    waterUsage: Math.round(waterUsage * 100) / 100, // Round to 2 decimal places
    efficiency,
    tokenCount: totalTokens,
  }
}

function getModelKey(modelName: string): string {
  if (modelName.includes("gpt-4o")) return "gpt-4o"
  if (modelName.includes("gpt-4")) return "gpt-4"
  if (modelName.includes("gpt-3.5")) return "gpt-3.5-turbo"
  return "gpt-4o" // Default fallback
}

export function getModelDisplayName(modelName: string): string {
  const key = getModelKey(modelName)
  const displayNames: Record<string, string> = {
    "gpt-4o": "GPT-4o",
    "gpt-4": "GPT-4",
    "gpt-3.5-turbo": "GPT-3.5 Turbo",
  }
  return displayNames[key] || "GPT-4o"
}
