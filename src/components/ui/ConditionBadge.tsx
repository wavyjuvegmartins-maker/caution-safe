export type Condition = "good" | "fair" | "damaged" | "missing";

const styles: Record<Condition, string> = {
  good: "border-green bg-green/12 text-green",
  fair: "border-amber bg-amber/12 text-amber",
  damaged: "border-red bg-red/12 text-red",
  missing: "border-red bg-red/12 text-red",
};

const labels: Record<Condition, string> = {
  good: "Good",
  fair: "Fair",
  damaged: "Damaged",
  missing: "Missing",
};

export function ConditionBadge({ condition }: { condition: Condition }) {
  return (
    <span className={`inline-block rounded-sm border px-2 text-xs font-medium ${styles[condition]}`}>
      {labels[condition]}
    </span>
  );
}
