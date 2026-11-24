"use client";

import { useState, type ComponentType } from "react";
import {
  Check,
  Coffee,
  Copy,
  Feather,
  Flame,
  Heart,
  Laugh,
  MessageSquare,
  Quote,
  Smile,
  Sparkles,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { aiSuggestionSchema, type AiSuggestionMode } from "@repo/contracts";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

import { useAiSuggestion } from "../hooks/useAiSuggestion";

const modes: Record<
  AiSuggestionMode,
  { label: string; icon: ComponentType<{ className?: string }> }
> = {
  fun_compliment: { label: "Fun Compliment", icon: Sparkles },
  witty_roast: { label: "Witty Roast", icon: Flame },
  serious_feedback: { label: "Serious Feedback", icon: MessageSquare },
  parse_message: { label: "Parse Message", icon: Quote },
  motivational_message: { label: "Motivational Message", icon: Feather },
  joke: { label: "Joke", icon: Laugh },
  short_story: { label: "Short Story", icon: Wand2 },
  casual_conversation: { label: "Casual Conversation", icon: Coffee },
  romantic_message: { label: "Romantic Message", icon: Heart },
  default: { label: "Default", icon: Smile },
};

const AIMessageHelper = ({ onUse }: { onUse: (message: string) => void }) => {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<AiSuggestionMode>("fun_compliment");
  const [copied, setCopied] = useState(false);
  const { completion, generate, isGenerating } = useAiSuggestion();

  const handleGenerate = () => {
    // the API checks the same rules, so mistakes are caught before the request
    const result = aiSuggestionSchema.safeParse({ prompt, mode });

    if (!result.success) {
      toast.warning(result.error.issues[0]?.message ?? "Write something first!");
      return;
    }

    generate(result.data);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(completion);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy the message");
    }
  };

  return (
    <Card className="mt-6 border border-muted/40 gap-1">
      <CardHeader>
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="h-5 w-5 text-yellow-500" /> AI Message Generator
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <Textarea
          placeholder='e.g. "Write a cute message for her"'
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="flex-1"
        />
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Select value={mode} onValueChange={(value) => setMode(value as AiSuggestionMode)}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="Choose tone" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(modes).map(([value, { label, icon: Icon }]) => (
                <SelectItem key={value} value={value}>
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            className="w-50 sm:w-32"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Thinking..." : "Generate"}
          </Button>
        </div>

        {completion && (
          <div className="relative border rounded-md bg-muted/30 p-3">
            <p className="p-4 bg-muted/30 rounded-lg font-medium text-foreground whitespace-pre-wrap">
              {completion}
            </p>

            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => onUse(completion)}
                disabled={isGenerating}
              >
                Use this message
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCopy}
                disabled={isGenerating}
                aria-label="Copy message"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { AIMessageHelper };
