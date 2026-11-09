import { describe, expect, it } from "vitest";
import {
  ACCEPTED_PHOTO_TYPES,
  MAX_CHARS,
  MAX_PHOTO_BYTES,
  canShare,
  charactersRemaining,
  photoExtension,
  validatePhoto,
} from "@/lib/validation";

describe("composer validation", () => {
  it("counts remaining characters and blocks blank or over-limit text", () => {
    expect(charactersRemaining("hello")).toBe(MAX_CHARS - 5);
    expect(canShare("", false)).toBe(false);
    expect(canShare("   ", false)).toBe(false);
    expect(canShare("hello", false)).toBe(true);
    expect(canShare("x".repeat(MAX_CHARS), false)).toBe(true);
    expect(canShare("x".repeat(MAX_CHARS + 1), false)).toBe(false);
    expect(canShare("", true)).toBe(true);
  });

  it("accepts only the four photo types", () => {
    expect(ACCEPTED_PHOTO_TYPES).toEqual(["image/jpeg", "image/png", "image/webp", "image/gif"]);
    expect(validatePhoto({ type: "text/plain", size: 10 })).toBe(
      "Choose a JPEG, PNG, WebP, or GIF image.",
    );
    expect(validatePhoto({ type: "image/jpeg", size: 10 })).toBeNull();
  });

  it("accepts photos up to 5 MB", () => {
    expect(validatePhoto({ type: "image/png", size: MAX_PHOTO_BYTES })).toBeNull();
    expect(validatePhoto({ type: "image/png", size: MAX_PHOTO_BYTES + 1 })).toBe(
      "That photo is larger than 5 MB. Choose a smaller file.",
    );
  });

  it("maps accepted MIME types to storage extensions", () => {
    expect(photoExtension("image/jpeg")).toBe("jpg");
    expect(photoExtension("image/png")).toBe("png");
    expect(photoExtension("image/webp")).toBe("webp");
    expect(photoExtension("image/gif")).toBe("gif");
    expect(photoExtension("text/plain")).toBeNull();
  });
});
