"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { PhotoPreview } from "@/components/photo-preview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ShareInput } from "@/lib/types";
import {
  MAX_CHARS,
  canShare,
  charactersRemaining,
  validatePhoto,
} from "@/lib/validation";

export type ComposerProps = {
  disabled: boolean;
  onShare: (input: ShareInput) => Promise<void>;
};

export function Composer({ disabled, onShare }: ComposerProps) {
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const remaining = charactersRemaining(text);

  useEffect(() => {
    if (!photo) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const validationError = validatePhoto(file);
    if (validationError) {
      setError(validationError);
      event.target.value = "";
      return;
    }
    setError(null);
    setPhoto(file);
  }

  function removePhoto() {
    setPhoto(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit() {
    const body = text.trim();
    if (disabled || submitting || !canShare(body, Boolean(photo))) return;
    setSubmitting(true);
    setError(null);
    try {
      await onShare({ body, photo });
      setText("");
      setPhoto(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't share your post. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

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
      <input
        ref={fileInputRef}
        type="file"
        aria-label="Photo file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        tabIndex={-1}
        disabled={disabled}
        onChange={handleFileChange}
      />
      {previewUrl ? (
        <PhotoPreview
          src={previewUrl}
          alt="Selected photo preview"
          onRemove={removePhoto}
        />
      ) : null}
      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      <p aria-live="polite" aria-atomic="true" className="mt-2 text-xs text-[#65676b]">
        {remaining} character{remaining === 1 ? "" : "s"} remaining
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          Add photo
        </Button>
        <Button
          type="button"
          disabled={disabled || submitting || !canShare(text, Boolean(photo))}
          onClick={() => void handleSubmit()}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Sharing…
            </>
          ) : (
            "Share"
          )}
        </Button>
      </div>
    </section>
  );
}
