import type { AiSuggestionDto } from "@repo/contracts";

import { apiStream } from "@/shared/api";

// The API is expected to stream the generated text as plain text (see the TODO in
// aiSuggestionController). If it ends up returning JSON instead, only this file has to change.
const streamAiSuggestion = (dto: AiSuggestionDto, signal?: AbortSignal) =>
  apiStream("/messages/suggestions", { method: "POST", body: dto, signal });

export { streamAiSuggestion };
