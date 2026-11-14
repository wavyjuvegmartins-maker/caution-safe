import type { ReactNode } from "react";

/**
 * A flat rendering of one CautionSafe screen, built from the real components.
 * It is a picture of the app, so it is announced as one image with a description.
 */
export function AppScreen({
  description,
  eyebrow,
  title,
  action,
  children,
  className = "",
}: {
  description: string;
  eyebrow: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure role="img" aria-label={description} className={`m-0 overflow-hidden rounded-md border border-ink bg-card ${className}`}>
      <div aria-hidden="true">
        <div className="border-b border-rule px-4 pb-3 pt-4">
          <p className="label m-0">{eyebrow}</p>
          <p className="m-0 mt-1 text-md font-semibold">{title}</p>
        </div>
        <div className="px-4 py-3">{children}</div>
        {action && <div className="border-t border-rule bg-paper px-4 py-3">{action}</div>}
      </div>
    </figure>
  );
}

/** The ink primary button as it appears inside a screen picture. */
export function ScreenButton({ children, variant = "primary" }: { children: ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <span
      className={`block rounded-md px-4 py-3 text-center font-medium ${
        variant === "primary" ? "bg-ink text-paper" : "border border-ink bg-card text-ink"
      }`}
    >
      {children}
    </span>
  );
}
