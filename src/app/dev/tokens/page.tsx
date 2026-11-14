import { notFound } from "next/navigation";
import { FloorPlanEmpty } from "@/components/brand/FloorPlanEmpty";
import { LockedStamp } from "@/components/brand/LockedStamp";
import { Wordmark } from "@/components/brand/Logo";
import {
  CameraIcon,
  CompareIcon,
  DamagedIcon,
  LockedIcon,
  MeterIcon,
  RoomIcon,
  SignIcon,
} from "@/components/brand/icons";
import { formatKobo } from "@/lib/money";

// Milestone 1 check: every palette token and type size. Dev only.
export const dynamic = "force-static";

const palette = [
  { token: "paper", hex: "#F7F5F0", use: "App background", swatch: "bg-paper" },
  { token: "card", hex: "#FFFFFF", use: "Cards, sheets", swatch: "bg-card" },
  { token: "ink", hex: "#1C1B19", use: "Main text, primary buttons", swatch: "bg-ink" },
  { token: "ink-muted", hex: "#6B6860", use: "Secondary text, labels", swatch: "bg-ink-muted" },
  { token: "rule", hex: "#E2DED5", use: "Borders, dividers, table lines", swatch: "bg-rule" },
  { token: "green", hex: "#1F6B4A", use: "Good, signed, refund due", swatch: "bg-green" },
  { token: "amber", hex: "#A86B12", use: "Fair, awaiting signature", swatch: "bg-amber" },
  { token: "red", hex: "#B3261E", use: "Damaged / missing, disputed", swatch: "bg-red" },
  { token: "stamp-bg", hex: "#EAF2EC", use: "Locked-report stamp", swatch: "bg-stamp-bg" },
] as const;

const sizes = [
  { cls: "text-xs", px: 13, sample: "Waiting for Chidi to sign." },
  { cls: "text-sm", px: 15, sample: "Take 2 photos of this room." },
  { cls: "text-md", px: 17, sample: "Flat 3, 12 Okigwe Rd, Aba" },
  { cls: "text-lg", px: 20, sample: "Move-in inspection" },
  { cls: "text-xl", px: 26, sample: "Refund due" },
] as const;

const icons = [
  { name: "camera", Icon: CameraIcon },
  { name: "room", Icon: RoomIcon },
  { name: "meter", Icon: MeterIcon },
  { name: "sign", Icon: SignIcon },
  { name: "locked", Icon: LockedIcon },
  { name: "damaged", Icon: DamagedIcon },
  { name: "compare", Icon: CompareIcon },
] as const;

export default function TokensPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-doc px-4 py-6">
      <Wordmark />
      <h1 className="mt-6 text-xl">Design tokens</h1>
      <p className="mt-1 text-ink-muted">SPEC section 6. Dev only.</p>

      <section className="mt-8">
        <h2 className="label">Palette</h2>
        <table className="mt-2 w-full border-collapse bg-card text-left">
          <tbody>
            {palette.map((c) => (
              <tr key={c.token} className="border-b border-rule">
                <td className="py-2 pl-3 pr-3">
                  <span className={`block h-8 w-8 rounded-md border border-rule ${c.swatch}`} />
                </td>
                <td className="py-2 pr-3 font-medium">{c.token}</td>
                <td className="py-2 pr-3 font-mono text-xs">{c.hex}</td>
                <td className="py-2 pr-3 text-xs text-ink-muted">{c.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-8">
        <h2 className="label">Type scale, IBM Plex Sans</h2>
        <ul className="mt-2 border-t border-rule">
          {sizes.map((s) => (
            <li key={s.cls} className="flex items-baseline gap-4 border-b border-rule py-2">
              <span className="w-8 shrink-0 font-mono text-xs text-ink-muted">{s.px}px</span>
              <span className={s.cls}>{s.sample}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-6">
          <span className="font-normal">Regular 400</span>
          <span className="font-medium">Medium 500</span>
          <span className="font-semibold">Semibold 600</span>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="label">IBM Plex Mono</h2>
        <div className="mt-2 border-t border-rule">
          <div className="flex justify-between border-b border-rule py-2">
            <span>Caution fee</span>
            <span className="font-mono">{formatKobo(15_000_000)}</span>
          </div>
          <div className="flex justify-between border-b border-rule py-2">
            <span>Meter number</span>
            <span className="font-mono font-medium">0412 3378 901</span>
          </div>
          <div className="flex justify-between border-b border-rule py-2">
            <span>Captured</span>
            <span className="font-mono text-label">14 Nov 2026, 10:42</span>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="label">Label style</h2>
        <p className="label mt-2">Move-in · Parlour · Walls</p>
      </section>

      <section className="mt-8">
        <h2 className="label">Condition colours</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-md border border-green px-3 py-1 text-green">Good</span>
          <span className="rounded-md border border-amber px-3 py-1 text-amber">Fair</span>
          <span className="rounded-md border border-red px-3 py-1 text-red">Damaged</span>
          <span className="rounded-md border border-red px-3 py-1 text-red">Missing</span>
        </div>
        <button type="button" className="mt-4 rounded-md bg-ink px-4 py-3 font-medium text-paper">
          Submit for signing
        </button>
      </section>

      <section className="mt-8">
        <h2 className="label">Icons</h2>
        <ul className="mt-2 flex flex-wrap gap-6">
          {icons.map(({ name, Icon }) => (
            <li key={name} className="flex flex-col items-center gap-1">
              <Icon />
              <span className="font-mono text-label text-ink-muted">{name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="label">Locked stamp and empty state</h2>
        <div className="mt-4 flex flex-wrap items-center gap-8">
          <LockedStamp lockedAt={new Date("2026-11-14T09:42:00Z")} contentHash="a3f9c21e5b7d" />
          <FloorPlanEmpty />
        </div>
      </section>
    </main>
  );
}
