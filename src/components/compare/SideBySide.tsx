import type { ReactNode } from "react";

/**
 * Two columns labelled MOVE-IN / MOVE-OUT. On phones the columns sit in a
 * horizontal scroll-snap strip, so you swipe between them without JS.
 */
export function SideBySide({ moveIn, moveOut }: { moveIn: ReactNode; moveOut: ReactNode }) {
  return (
    <div>
      <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 sm:mx-0 sm:scroll-px-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
        <section aria-label="Move-in" className="w-[85%] shrink-0 snap-start sm:w-auto">
          <h4 className="label m-0 mb-2">Move-in</h4>
          {moveIn}
        </section>
        <section aria-label="Move-out" className="w-[85%] shrink-0 snap-start sm:w-auto">
          <h4 className="label m-0 mb-2">Move-out</h4>
          {moveOut}
        </section>
      </div>
      <p className="mt-2 text-xs text-ink-muted sm:hidden">Swipe to see move-out.</p>
    </div>
  );
}
