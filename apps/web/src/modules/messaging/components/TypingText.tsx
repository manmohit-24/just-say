"use client";

import { useEffect, useState } from "react";

const DELAY_MS = 20;
// a long backlog is shown faster, so the animation never falls far behind the stream
const CATCH_UP_STEPS = 20;

// Shows text letter by letter. The text can keep growing (streamed), the animation just
// continues from where it was.
const TypingText = ({ text, isGenerating }: { text: string; isGenerating: boolean }) => {
  const [length, setLength] = useState(0);

  const shown = Math.min(length, text.length);
  const isTyping = isGenerating || shown < text.length;

  useEffect(() => {
    if (shown >= text.length) return;

    const step = Math.max(1, Math.ceil((text.length - shown) / CATCH_UP_STEPS));
    const timer = setTimeout(() => setLength(shown + step), DELAY_MS);

    return () => clearTimeout(timer);
  }, [shown, text.length]);

  return (
    <>
      {text.slice(0, shown)}
      {isTyping && (
        <span className="inline-block w-3 h-3 ml-1 bg-foreground rounded-full animate-pulse" />
      )}
    </>
  );
};

export { TypingText };
