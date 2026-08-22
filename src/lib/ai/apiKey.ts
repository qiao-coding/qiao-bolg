// Client-side DeepSeek API key stored in localStorage.
// Sent to /api/ai/* routes via the `x-api-key` header; falls back to the server env key.

export const AI_API_KEY_STORAGE_KEY = "ai_api_key";

export function getApiKey(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(AI_API_KEY_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setApiKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    if (key) window.localStorage.setItem(AI_API_KEY_STORAGE_KEY, key);
    else window.localStorage.removeItem(AI_API_KEY_STORAGE_KEY);
  } catch {
    // storage unavailable — ignore
  }
}

export function clearApiKey(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AI_API_KEY_STORAGE_KEY);
  } catch {
    // ignore
  }
}
