import { describe, expect, it } from "vitest";
import { formatKobo, parseNairaToKobo } from "./money";

describe("formatKobo", () => {
  it("formats kobo as naira", () => {
    expect(formatKobo(15_000_000)).toBe("₦150,000.00");
    expect(formatKobo(0)).toBe("₦0.00");
    expect(formatKobo(1)).toBe("₦0.01");
  });
  it("rejects fractional kobo", () => {
    expect(() => formatKobo(1.5)).toThrow();
  });
});

describe("parseNairaToKobo", () => {
  it("parses common inputs", () => {
    expect(parseNairaToKobo("150,000")).toBe(15_000_000);
    expect(parseNairaToKobo("₦150000.5")).toBe(15_000_050);
    expect(parseNairaToKobo(" 120000.00 ")).toBe(12_000_000);
  });
  it("rejects bad input", () => {
    expect(parseNairaToKobo("")).toBeNull();
    expect(parseNairaToKobo("-500")).toBeNull();
    expect(parseNairaToKobo("12.345")).toBeNull();
    expect(parseNairaToKobo("abc")).toBeNull();
  });
});
