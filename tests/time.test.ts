import { describe, expect, it } from "vitest";
import { timeAgo } from "@/lib/time";

const now = new Date(2026, 10, 9, 12, 0, 0).getTime();
const ago = (ms: number) => new Date(now - ms).toISOString();

describe("timeAgo", () => {
  it("returns now for the last minute", () => {
    expect(timeAgo(ago(30_000), now)).toBe("now");
  });

  it("formats minutes, hours, and days", () => {
    expect(timeAgo(ago(60_000), now)).toBe("1m");
    expect(timeAgo(ago(59 * 60_000), now)).toBe("59m");
    expect(timeAgo(ago(60 * 60_000), now)).toBe("1h");
    expect(timeAgo(ago(23 * 60 * 60_000), now)).toBe("23h");
    expect(timeAgo(ago(24 * 60 * 60_000), now)).toBe("1d");
    expect(timeAgo(ago(6 * 24 * 60 * 60_000 + 23 * 60 * 60_000), now)).toBe("6d");
  });

  it("uses a short date at seven days and beyond", () => {
    expect(timeAgo(ago(7 * 24 * 60 * 60_000), now)).toBe("Nov 2");
    expect(timeAgo(new Date(2025, 2, 29, 12).toISOString(), now)).toBe("Mar 29, 2025");
  });

  it("returns now for future or invalid timestamps", () => {
    expect(timeAgo(new Date(now + 60_000).toISOString(), now)).toBe("now");
    expect(timeAgo("not-a-date", now)).toBe("now");
  });
});
