"use client";
import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/lib/site";

type Theme = "auto" | "light" | "dark";
const order: Theme[] = ["auto", "light", "dark"];
const labels: Record<Theme, string> = { auto: "Auto", light: "Light", dark: "Dark" };

const listeners = new Set<() => void>();

function read(): Theme {
  const t = document.documentElement.dataset.theme;
  return t === "light" || t === "dark" ? t : "auto";
}

function write(next: Theme) {
  const root = document.documentElement;
  if (next === "auto") delete root.dataset.theme;
  else root.dataset.theme = next;
  try {
    if (next === "auto") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Storage blocked (private mode): the choice still applies for this page view.
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Cycles Auto (follow the phone) -> Light -> Dark. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, read, () => "auto" as Theme);
  const next = order[(order.indexOf(theme) + 1) % order.length] ?? "auto";
  return (
    <button
      type="button"
      onClick={() => write(next)}
      aria-label={`Colour theme: ${labels[theme]}. Switch to ${labels[next]}.`}
      className={`whitespace-nowrap rounded-md border border-rule px-3 py-2 text-xs font-medium text-ink-muted hover:border-ink hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${className}`}
    >
      <span className="hidden sm:inline">Theme: </span>
      <span className="text-ink">{labels[theme]}</span>
    </button>
  );
}
