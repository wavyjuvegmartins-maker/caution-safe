"use client";
import type { Condition } from "@/components/ui/ConditionBadge";

const options: { value: Condition; label: string; selected: string }[] = [
  { value: "good", label: "Good", selected: "border-green bg-green/12 text-green" },
  { value: "fair", label: "Fair", selected: "border-amber bg-amber/12 text-amber" },
  { value: "damaged", label: "Damaged", selected: "border-red bg-red/12 text-red" },
  { value: "missing", label: "Missing", selected: "border-red bg-red/12 text-red" },
];

/**
 * Four segmented buttons. The selected one fills with its colour at 12% tint
 * and a 1px border in full colour (SPEC section 6). Without onChange it is display-only.
 */
export function ConditionPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Condition | null;
  onChange?: (v: Condition) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-4 gap-1">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            disabled={!onChange}
            onClick={onChange ? () => onChange(o.value) : undefined}
            className={`rounded-sm border px-1 py-2 text-xs font-medium disabled:cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              on ? o.selected : "border-rule bg-card text-ink-muted"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
