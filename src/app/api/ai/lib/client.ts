import OpenAI from "openai";

/** Build an OpenAI-compatible client pointed at DeepSeek. */
export function createDeepSeekClient(apiKey: string): OpenAI {
  return new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com",
  });
}
