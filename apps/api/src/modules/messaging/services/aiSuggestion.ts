import { google } from "@ai-sdk/google";
import type { AiSuggestionDto, AiSuggestionMode } from "@repo/contracts";
import { streamText } from "ai";

const SYSTEM_PROMPTS: { [key in AiSuggestionMode]: string } = {
  fun_compliment:
    "Write a short, fun, and friendly compliment like an expert giving encouragement. Keep it cheerful, creative, and playful.",

  witty_roast:
    "Write a short, clever, and sharp roast like an experienced comedian. Make it funny, bold, and memorable.",

  serious_feedback:
    "Give clear and professional feedback on an idea or work like an expert reviewer. Focus on improvements and actionable points.",

  parse_message:
    "Rewrite the user’s message clearly and concisely. Keep the main idea and make it easy to read.",

  motivational_message:
    "Write a short, inspiring, and uplifting message that motivates someone. Keep it positive and easy to understand.",

  joke: "Write a short, funny joke or pun. Keep it clever.",

  short_story: "Write a very short story or scene that is engaging and imaginative. Be creative.",

  casual_conversation:
    "Write a short, natural, and friendly conversational message. Make it sound like casual human chat.",

  romantic_message:
    "Write a short, warm, and heartfelt romantic message or confession. Make it sweet and sincere.",

  default: "Write short, simple, and positive messages.",
};

const model = google("gemini-2.5-flash");

export const aiSuggestion = ({ prompt, mode }: AiSuggestionDto) => {
  return streamText({
    model,
    prompt,
    instructions: SYSTEM_PROMPTS[mode],
    maxOutputTokens: 1000,
    temperature: 0.7,
  });
};
