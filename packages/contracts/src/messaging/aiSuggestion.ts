import { z } from "zod";

export const aiSuggestionModeSchema = z.enum([
  "fun_compliment",
  "witty_roast",
  "serious_feedback",
  "parse_message",
  "motivational_message",
  "joke",
  "short_story",
  "casual_conversation",
  "romantic_message",
  "default",
]);

export const aiSuggestionSchema = z.object({
  prompt: z
    .string()
    .min(1)
    .min(10, "Prompt should atleast be of 10 characters.")
    .max(500, "Prompt cannot exceed 500 characters."),
  mode: aiSuggestionModeSchema,
});

export type AiSuggestionDto = z.infer<typeof aiSuggestionSchema>;

export type AiSuggestionMode = z.infer<typeof aiSuggestionModeSchema>;
