export const MAX_CHARS = 280;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function charactersRemaining(text: string): number {
  return Math.max(0, MAX_CHARS - text.length);
}

export function canShare(text: string, hasPhoto: boolean): boolean {
  const trimmed = text.trim();
  if (trimmed.length > MAX_CHARS) return false;
  return trimmed.length > 0 || hasPhoto;
}

export function validatePhoto(file: { type: string; size: number }): string | null {
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type as (typeof ACCEPTED_PHOTO_TYPES)[number])) {
    return "Choose a JPEG, PNG, WebP, or GIF image.";
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return "That photo is larger than 5 MB. Choose a smaller file.";
  }
  return null;
}

export function photoExtension(mime: string): string | null {
  return EXTENSIONS[mime] ?? null;
}
