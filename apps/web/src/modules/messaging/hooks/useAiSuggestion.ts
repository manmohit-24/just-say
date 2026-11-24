import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AiSuggestionDto } from "@repo/contracts";

import { getErrorMessage } from "@/shared/api";

import { streamAiSuggestion } from "../api";

// Generates a message and exposes it in `completion` while it is still being written.
const useAiSuggestion = () => {
  const [completion, setCompletion] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: async (dto: AiSuggestionDto) => {
      setCompletion("");

      const stream = await streamAiSuggestion(dto);
      const reader = stream.pipeThrough(new TextDecoderStream()).getReader();

      for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
        setCompletion((text) => text + chunk.value);
      }
    },
    onError: (error) => toast.error(getErrorMessage(error, "Couldn't generate a message")),
  });

  return { completion, generate: mutate, isGenerating: isPending };
};

export { useAiSuggestion };
