import OpenAI from "openai";
import { createDeepSeekClient } from "./client";
import type { Executor } from "./executor";

export type AgentRunConfig = {
  systemPrompt: string;
  messages: { role: string; content: string }[];
  tools: OpenAI.Chat.Completions.ChatCompletionTool[];
  executors: Record<string, Executor>;
  apiKey: string;
  model?: string;
  maxRounds?: number;
};

// ---------------------------------------------------------------------------
// Type guard for standard tool calls
// ---------------------------------------------------------------------------
function isStandardToolCall(
  tc: OpenAI.Chat.Completions.ChatCompletionMessageToolCall
): tc is OpenAI.Chat.Completions.ChatCompletionMessageToolCall & { function: { name: string; arguments: string } } {
  return tc.type === "function" && "function" in tc;
}

/**
 * Run the agent tool-calling loop and return an SSE ReadableStream.
 * Emits events: text | tool_call | tool_result | error | done
 */
export function runAgent(cfg: AgentRunConfig): ReadableStream {
  const { systemPrompt, messages, tools, executors, apiKey, model = "deepseek-v4-flash", maxRounds = 5 } = cfg;

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const emit = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        const client = createDeepSeekClient(apiKey);
        // 历史里的 role=tool 消息不能重放：它们的 tool_call_id 属于上一轮，
        // 重放无法配对（DeepSeek 会拒绝 "role 'tool' must be a response to a
        // preceding message with 'tool_calls'"）。只保留 user/assistant。
        const historyMessages = messages.filter((m) => m.role !== "tool");
        const conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
          { role: "system", content: systemPrompt },
          ...historyMessages.map((m) => {
            return {
              role: m.role as "user" | "assistant",
              content: m.content,
            };
          }),
        ];

        let rounds = maxRounds;

        while (rounds-- > 0) {
          const completion = await client.chat.completions.create({
            model,
            messages: conversation,
            tools,
          });

          const choice = completion.choices[0];
          const msg = choice.message;

          // Emit text content
          if (msg.content) {
            emit({ type: "text", content: msg.content });
          }

          // Handle tool calls
          if (msg.tool_calls && msg.tool_calls.length > 0) {
            const fnCalls = msg.tool_calls.filter(isStandardToolCall);

            if (fnCalls.length === 0) {
              break;
            }

            // Append assistant message with tool calls
            conversation.push({
              role: "assistant",
              content: msg.content,
              tool_calls: fnCalls.map((tc) => ({
                id: tc.id,
                type: "function" as const,
                function: {
                  name: tc.function.name,
                  arguments: tc.function.arguments,
                },
              })),
            });

            // Execute each tool call
            for (const tc of fnCalls) {
              const toolName = tc.function.name;
              let args: Record<string, unknown>;
              try {
                args = JSON.parse(tc.function.arguments);
              } catch {
                args = {};
              }

              emit({ type: "tool_call", id: tc.id, name: toolName, args });

              try {
                const executor = executors[toolName];
                if (!executor) throw new Error(`Unknown tool: ${toolName}`);
                const result = await executor(args);
                emit({ type: "tool_result", id: tc.id, name: toolName, result });
                conversation.push({
                  role: "tool",
                  tool_call_id: tc.id,
                  content: JSON.stringify(result),
                });
              } catch (err) {
                const errMsg = err instanceof Error ? err.message : String(err);
                emit({ type: "tool_result", id: tc.id, name: toolName, result: { error: errMsg } });
                conversation.push({
                  role: "tool",
                  tool_call_id: tc.id,
                  content: JSON.stringify({ error: errMsg }),
                });
              }
            }

            // Continue loop to let the model respond to tool results
            continue;
          }

          // No tool calls — done
          break;
        }

        emit({ type: "done" });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        emit({ type: "error", message: msg });
      } finally {
        controller.close();
      }
    },
  });
}
