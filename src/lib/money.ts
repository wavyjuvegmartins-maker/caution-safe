// Money is stored as integer kobo (bigint in Postgres). 100 kobo = ₦1.
import { z } from "zod";

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const koboSchema = z.number().int().nonnegative().safe();

/** 15000000 -> "₦150,000.00" */
export function formatKobo(kobo: number): string {
  koboSchema.parse(kobo);
  return naira.format(kobo / 100);
}

/**
 * Parse what a user types ("150,000", "₦150000.5", "150000.50") into kobo.
 * Returns null for anything that isn't a valid non-negative amount with at most 2 decimals.
 */
export function parseNairaToKobo(input: string): number | null {
  const cleaned = input.replace(/[₦,\s]/g, "");
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(cleaned);
  if (!match) return null;
  const whole = match[1] ?? "0";
  const frac = (match[2] ?? "").padEnd(2, "0");
  const kobo = Number(whole) * 100 + Number(frac);
  return Number.isSafeInteger(kobo) ? kobo : null;
}
