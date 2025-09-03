// lib/historyClient.ts
export type EnvironmentalData = {
  energyUsage: number;
  carbonEmissions: number;
  waterUsage: number;
  efficiency: "low" | "medium" | "high" | string;
  tokenCount: number;
};

export type TokenUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  reasoningTokens: number;
  cachedInputTokens: number;
};

export type HistoryItem = {
  _id?: string;
  userId: string;
  query: string;
  response: string;
  environmental: EnvironmentalData;
  tokenUsage?: TokenUsage;
  createdAt?: string;
};

async function handleJSONResponse(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    // If API returns non-json, throw raw
    throw new Error(`Invalid JSON response: ${text}`);
  }
}

export async function addHistory(item: Omit<HistoryItem, "_id" | "createdAt">) {
  const res = await fetch("/api/history/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const payload = await handleJSONResponse(res);
    throw new Error(payload?.error || `Failed to add history (${res.status})`);
  }
  const payload = await handleJSONResponse(res);
  return payload.history ?? payload;
}

export async function getHistory(userId: string) {
  const res = await fetch(
    `/api/history/get?userId=${encodeURIComponent(userId)}`
  );
  if (!res.ok) {
    const payload = await handleJSONResponse(res);
    throw new Error(
      payload?.error || `Failed to fetch history (${res.status})`
    );
  }
  const payload = await handleJSONResponse(res);
  // endpoint returns { success: true, histories }
  return payload.histories ?? payload;
}

export async function clearHistory(userId: string) {
  const res = await fetch(
    `/api/history/clear?userId=${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    }
  );
  if (!res.ok) {
    const payload = await handleJSONResponse(res);
    throw new Error(
      payload?.error || `Failed to clear history (${res.status})`
    );
  }
  const payload = await handleJSONResponse(res);
  return payload;
}
