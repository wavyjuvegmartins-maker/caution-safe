// Settlement maths. All amounts are integer kobo.

export type DeductionStatus = "proposed" | "accepted" | "disputed";

export type DeductionLike = { amountKobo: number; status: DeductionStatus };

export type SettlementSummary = {
  cautionFeeKobo: number;
  acceptedKobo: number;
  disputedKobo: number;
  proposedKobo: number;
  /** caution fee − accepted deductions, never below zero */
  refundDueKobo: number;
  /** true when no deduction is still proposed */
  isFinal: boolean;
};

function assertKobo(n: number, what: string) {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`${what} must be a non-negative integer (kobo)`);
}

export function summariseSettlement(cautionFeeKobo: number, deductions: DeductionLike[]): SettlementSummary {
  assertKobo(cautionFeeKobo, "caution fee");
  let acceptedKobo = 0;
  let disputedKobo = 0;
  let proposedKobo = 0;
  for (const d of deductions) {
    assertKobo(d.amountKobo, "deduction amount");
    if (d.status === "accepted") acceptedKobo += d.amountKobo;
    else if (d.status === "disputed") disputedKobo += d.amountKobo;
    else proposedKobo += d.amountKobo;
  }
  return {
    cautionFeeKobo,
    acceptedKobo,
    disputedKobo,
    proposedKobo,
    refundDueKobo: Math.max(0, cautionFeeKobo - acceptedKobo),
    isFinal: proposedKobo === 0 && !deductions.some((d) => d.status === "proposed"),
  };
}
