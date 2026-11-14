import { describe, expect, it } from "vitest";
import { formatCaptureTime, formatDay } from "./dates";

describe("dates", () => {
  it("formats in Africa/Lagos (UTC+1)", () => {
    const d = new Date("2026-11-14T09:42:00Z");
    expect(formatCaptureTime(d)).toBe("14 Nov 2026, 10:42");
    expect(formatDay(d)).toBe("14 Nov 2026");
  });
});
