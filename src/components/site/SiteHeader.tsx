import Link from "next/link";
import { Wordmark } from "@/components/brand/Logo";
import { SIGN_IN_HREF } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-3 py-3">
      <Link href="/" className={`shrink-0 rounded-md py-2 ${focusRing}`}>
        <Wordmark />
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href={SIGN_IN_HREF}
          className={`whitespace-nowrap rounded-md px-3 py-3 font-medium underline decoration-rule underline-offset-4 hover:decoration-ink ${focusRing}`}
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}
