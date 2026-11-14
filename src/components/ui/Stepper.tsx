import type { ReactNode } from "react";

export type Step = { title: string; body?: ReactNode };

/** Flat vertical line with numbered dots. Steps are a real sequence. */
export function Stepper({ steps, current }: { steps: Step[]; current?: number }) {
  return (
    <ol className="m-0 list-none p-0">
      {steps.map((step, i) => {
        const done = current !== undefined && i < current;
        const last = i === steps.length - 1;
        return (
          <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && <span aria-hidden="true" className="absolute left-3 top-6 bottom-0 w-px bg-rule" />}
            <span
              aria-hidden="true"
              className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-caption ${
                done ? "border-ink bg-ink text-paper" : "border-ink bg-card text-ink"
              }`}
            >
              {i + 1}
            </span>
            <div>
              <p className="m-0 font-semibold">{step.title}</p>
              {step.body && <div className="mt-1 text-ink-muted">{step.body}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
