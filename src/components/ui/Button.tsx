import Link from "next/link";
import type { ComponentProps } from "react";

const base =
  "inline-flex items-center justify-center rounded-md px-4 py-3 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const variants = {
  primary: "bg-ink text-paper hover:bg-ink/90",
  secondary: "border border-ink bg-card text-ink hover:bg-paper",
} as const;

type Variant = keyof typeof variants;

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
