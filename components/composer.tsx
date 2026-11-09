"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ShareInput } from "@/lib/types";
import { MAX_CHARS, canShare, charactersRemaining } from "@/lib/validation";

export type ComposerProps = {
  disabled: boolean;
  onShare: (input: ShareInput) => Promise<void>;
};

export function Composer({ disabled, onShare }: ComposerProps) {
  const [text, setText] = useState("");
  const remaining = charactersRemaining(text);
  const canSubmit = !disabled && canShare(text, false);

  return (
    <section className="rounded-lg border border-[#dddfe2] bg-[#f7f8fa] p-4">
      <label htmlFor="composer-message" className="sr-only">
        Write a message
      </label>
      <Textarea
        id="composer-message"
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={MAX_CHARS}
        disabled={disabled}
        placeholder="What's on your mind, John?"
        className="min-h-24 resize-none bg-white"
      />
      <p aria-live="polite" aria-atomic="true" className="mt-2 text-xs text-[#65676b]">
        {remaining} character{remaining === 1 ? "" : "s"} remaining
      </p>
      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          disabled={!canSubmit}
          onClick={() => void onShare({ body: text.trim(), photo: null })}
        >
          Share
        </Button>
      </div>
    </section>
  );
}
