import { describe, expect, it } from "vitest";
import { summariseSettlement } from "./settlement";

describe("summariseSettlement", () => {
  it("refund due = caution fee − accepted deductions (kobo)", () => {
    const s = summariseSettlement(15_000_000, [
      { amountKobo: 1_800_000, status: "accepted" },
      { amountKobo: 1_200_000, status: "accepted" },
      { amountKobo: 750_000, status: "disputed" },
    ]);
    expect(s.refundDueKobo).toBe(12_000_000);
    expect(s.acceptedKobo).toBe(3_000_000);
    expect(s.disputedKobo).toBe(750_000);
    expect(s.isFinal).toBe(true);
  });

  it("disputed and proposed amounts do not reduce the refund", () => {
    const s = summariseSettlement(10_000_000, [
      { amountKobo: 500_000, status: "proposed" },
      { amountKobo: 300_000, status: "disputed" },
    ]);
    expect(s.refundDueKobo).toBe(10_000_000);
    expect(s.isFinal).toBe(false);
  });

  it("never goes below zero", () => {
    expect(summariseSettlement(100, [{ amountKobo: 500, status: "accepted" }]).refundDueKobo).toBe(0);
  });

  it("is exact for odd kobo values", () => {
    expect(summariseSettlement(15_000_001, [{ amountKobo: 1, status: "accepted" }]).refundDueKobo).toBe(15_000_000);
  });

  it("rejects non-integer kobo", () => {
    expect(() => summariseSettlement(100.5, [])).toThrow();
    expect(() => summariseSettlement(100, [{ amountKobo: 1.5, status: "accepted" }])).toThrow();
  });
});
