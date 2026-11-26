import type { AiSuggestionDto } from "@repo/contracts";

import { apiStream } from "@/shared/api";

const streamAiSuggestion = async function* (
  dto: AiSuggestionDto,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const body = await apiStream("/messages/suggestions", {
    method: "POST",
    body: dto,
    signal,
  });

  const reader = body.pipeThrough(new TextDecoderStream()).getReader();

  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += value;

      // SSE events are separated by a blank line.
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() ?? "";

      for (const event of events) {
        const data = event
          .split(/\r?\n/)
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trim())
          .join("\n");

        if (!data || data === "[DONE]") continue;

        const chunk = JSON.parse(data);

        if (chunk.type === "text-delta") {
          yield chunk.delta;
        }

        if (chunk.type === "error") {
          throw new Error(chunk.errorText ?? "Couldn't generate a message");
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
};

export { streamAiSuggestion };
