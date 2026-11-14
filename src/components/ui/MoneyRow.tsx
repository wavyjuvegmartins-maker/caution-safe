import type { ReactNode } from "react";
import { formatKobo } from "@/lib/money";

type Tone = "default" | "muted" | "green" | "red";

const toneClass: Record<Tone, string> = {
  default: "text-ink",
  muted: "text-ink-muted",
  green: "text-green",
  red: "text-red",
};

/** Label left, amount right in Plex Mono, e.g. ₦150,000.00 */
export function MoneyRow({
  label,
  kobo,
  sign,
  tone = "default",
  strong = false,
}: {
  label: ReactNode;
  kobo: number;
  sign?: "minus";
  tone?: Tone;
  strong?: boolean;
}) {
  return (
    <div className={`flex items-baseline justify-between gap-4 border-b border-rule py-2 ${toneClass[tone]}`}>
      <span className={strong ? "font-semibold" : undefined}>{label}</span>
      <span className={`shrink-0 font-mono ${strong ? "text-md font-medium" : ""}`}>
        {sign === "minus" ? "−" : ""}
        {formatKobo(kobo)}
      </span>
    </div>
  );
}
