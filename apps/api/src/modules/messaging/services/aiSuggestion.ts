import type { AiSuggestionDto } from "@repo/contracts";
export const aiSuggestion = async (_input: AiSuggestionDto): Promise<unknown> => {
  // TODO: Migrate AI prompt parsing, provider/model setup, and streaming response.
  throw new Error("aiSuggestion service is not implemented");
};