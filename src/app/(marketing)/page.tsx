import { createHash } from "node:crypto";
import Link from "next/link";
import type { Metadata } from "next";
import { SideBySide } from "@/components/compare/SideBySide";
import { LockedStamp } from "@/components/brand/LockedStamp";
import { Wordmark } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { ConditionBadge } from "@/components/ui/ConditionBadge";
import { MoneyRow } from "@/components/ui/MoneyRow";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { Stepper } from "@/components/ui/Stepper";
import { sampleDeductions, sampleRooms, sampleTenancy as t } from "@/content/sample-report";
import { formatDay } from "@/lib/dates";
import { formatKobo } from "@/lib/money";
import { summariseSettlement } from "@/lib/settlement";
import { localPhoto } from "./local-photo";

export const metadata: Metadata = {
  title: "CautionSafe: record the flat, sign together, settle the caution fee",
  description:
    "Landlord and tenant photograph every room at move-in, both sign by phone, and compare the same rooms at move-out before the caution fee is refunded.",
};

// The stamp shows a real SHA-256 of the sample report, the same way locked reports are hashed.
const sampleHash = createHash("sha256")
  .update(JSON.stringify({ tenancy: t, rooms: sampleRooms }))
  .digest("hex");

const settlement = summariseSettlement(
  t.cautionFeeKobo,
  sampleDeductions.map((d) => ({ amountKobo: d.amountKobo, status: d.status })),
);

const statusText = { accepted: "Accepted", disputed: "Disputed", proposed: "Waiting for tenant" } as const;
const statusClass = { accepted: "text-ink-muted", disputed: "text-red", proposed: "text-amber" } as const;

export default function HomePage() {
  const kitchen = localPhoto("kitchen.jpg");
  const moveIn = localPhoto("room-move-in.jpg");
  const moveOut = localPhoto("room-move-out.jpg");

  return (
    <div className="px-4 sm:px-8 lg:pl-16">
      <header className="flex max-w-doc items-center justify-between py-4">
        <Link href="/" className="rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
          <Wordmark />
        </Link>
        <Link href="/login" className="font-medium underline underline-offset-4 decoration-rule hover:decoration-ink">
          Sign in
        </Link>
      </header>

      <main className="max-w-doc pb-8">
        {/* Opening: one plain sentence, then the report itself. */}
        <section className="pt-6">
          <h1 className="m-0 text-xl">Photograph the flat with your landlord on day one.</h1>
          <p className="mt-3 text-md text-ink-muted">
            Go through every room together, take time-stamped photos and both sign by phone. When you move out, the same
            photos decide what comes off the caution fee.
          </p>
        </section>

        {/* Sample report */}
        <article aria-labelledby="sample-title" className="mt-6 rounded-md border border-rule bg-card">
          <div className="flex items-start justify-between gap-4 border-b border-rule px-4 py-3">
            <div>
              <p className="label m-0">Sample report</p>
              <h2 id="sample-title" className="m-0 mt-1 text-lg">
                Move-in report
              </h2>
            </div>
            <span className="font-mono text-xs text-ink-muted">{t.reportId}</span>
          </div>

          <div className="grid gap-4 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              <dt className="label self-center">Property</dt>
              <dd className="m-0">
                {t.property}, {t.area}
              </dd>
              <dt className="label self-center">Landlord</dt>
              <dd className="m-0">{t.landlord}</dd>
              <dt className="label self-center">Tenant</dt>
              <dd className="m-0">{t.tenant}</dd>
              <dt className="label self-center">Inspected</dt>
              <dd className="m-0 font-mono">{formatDay(t.moveInAt)}</dd>
              <dt className="label self-center">Caution fee</dt>
              <dd className="m-0 font-mono">{formatKobo(t.cautionFeeKobo)}</dd>
              <dt className="label self-center">Meter</dt>
              <dd className="m-0 font-mono">
                {t.meterNumber}, {t.meterUnits} units
              </dd>
            </dl>
            <div className="-ml-2 max-w-full overflow-hidden sm:ml-0">
              <LockedStamp lockedAt={t.lockedAt} contentHash={sampleHash} />
            </div>
          </div>

          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Condition of each room at move-in</caption>
            <thead>
              <tr className="border-y border-rule">
                <th scope="col" className="label px-4 py-2 font-medium">
                  Room
                </th>
                <th scope="col" className="label py-2 pr-4 font-medium">
                  Condition
                </th>
                <th scope="col" className="label hidden py-2 pr-4 font-medium sm:table-cell">
                  Note
                </th>
                <th scope="col" className="label py-2 pr-4 text-right font-medium">
                  Photos
                </th>
              </tr>
            </thead>
            <tbody>
              {sampleRooms.map((r) => (
                <tr key={r.name} className="border-b border-rule align-top">
                  <th scope="row" className="px-4 py-2 font-medium">
                    {r.name}
                    <span className="block text-xs font-normal text-ink-muted sm:hidden">{r.note}</span>
                  </th>
                  <td className="py-2 pr-4">
                    <ConditionBadge condition={r.condition} />
                  </td>
                  <td className="hidden py-2 pr-4 text-ink-muted sm:table-cell">{r.note}</td>
                  <td className="py-2 pr-4 text-right font-mono">{r.photos}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-4 py-4">
            <h3 className="m-0 text-sm font-semibold">Kitchen</h3>
            <p className="mt-1 text-ink-muted">Sink tap drips. Cabinet hinge stiff.</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <PhotoTile src={kitchen} alt="Kitchen at move-in" capturedAt={t.moveInAt} priority />
              <PhotoTile
                src={null}
                alt="Kitchen sink tap at move-in"
                capturedAt={new Date(t.moveInAt.getTime() + 60_000)}
              />
            </div>
          </div>

          <div className="border-t border-rule px-4 py-3">
            <p className="label m-0">Content hash (SHA-256)</p>
            <p className="m-0 mt-1 break-all font-mono text-caption text-ink-muted">{sampleHash}</p>
          </div>
        </article>

        <div className="mt-6">
          <ButtonLink href="/login" className="w-full sm:w-auto">
            Start a move-in report
          </ButtonLink>
        </div>

        {/* How it works: a real sequence, so numbered steps are honest here. */}
        <section aria-labelledby="how" className="mt-8 border-t border-rule pt-8">
          <h2 id="how" className="m-0 text-lg">
            How it works
          </h2>
          <div className="mt-4">
            <Stepper
              steps={[
                {
                  title: "Move-in",
                  body: "The landlord adds the flat and sends the tenant an SMS invite. You walk through each room together, take at least 2 photos per room and record the meter. Both of you sign with a code sent to your phone, and the report locks.",
                },
                {
                  title: "Move-out",
                  body: "Each room opens with the move-in photos beside an empty slot for the move-out photo. Same checklist, same rooms. Both sign again.",
                },
                {
                  title: "Settlement",
                  body: "The landlord lists any deductions with a reason and a photo. The tenant accepts or disputes each one. The app works out the refund, and either of you can download the PDF.",
                },
              ]}
            />
          </div>
        </section>

        {/* Compare */}
        <section aria-labelledby="compare" className="mt-8 border-t border-rule pt-8">
          <h2 id="compare" className="m-0 text-lg">
            Same room, one year apart
          </h2>
          <p className="mt-2 text-ink-muted">
            The photos carry the time they reached the server, not the time on someone&apos;s phone. Nobody can backdate
            them.
          </p>
          <div className="mt-4">
            <SideBySide
              moveIn={<PhotoTile src={moveIn} alt="Parlour at move-in" capturedAt={t.moveInAt} />}
              moveOut={<PhotoTile src={moveOut} alt="Parlour at move-out" capturedAt={t.moveOutAt} />}
            />
          </div>
        </section>

        {/* Settlement */}
        <section aria-labelledby="settle" className="mt-8 border-t border-rule pt-8">
          <h2 id="settle" className="m-0 text-lg">
            What comes off the caution fee
          </h2>
          <p className="mt-2 text-ink-muted">
            Only deductions the tenant accepts come off. Disputed items stay listed until you sort them out.
          </p>

          <div className="mt-4 rounded-md border border-rule bg-card px-4 py-2">
            <MoneyRow label="Caution fee" kobo={settlement.cautionFeeKobo} />
            {sampleDeductions
              .filter((d) => d.status === "accepted")
              .map((d) => (
                <MoneyRow
                  key={d.item}
                  sign="minus"
                  kobo={d.amountKobo}
                  label={
                    <>
                      {d.item}
                      <span className="block text-xs text-ink-muted">
                        {d.room}, {statusText[d.status].toLowerCase()} by tenant
                      </span>
                    </>
                  }
                />
              ))}
            <div className="flex items-baseline justify-between gap-4 py-3 text-green">
              <span className="font-semibold">Refund due</span>
              <span className="font-mono text-md font-medium">{formatKobo(settlement.refundDueKobo)}</span>
            </div>
          </div>

          <h3 className="mt-6 text-sm font-semibold">Disputed</h3>
          <ul className="m-0 mt-2 list-none border-t border-rule p-0">
            {sampleDeductions
              .filter((d) => d.status === "disputed")
              .map((d) => (
                <li key={d.item} className="border-b border-rule py-2">
                  <div className="flex items-baseline justify-between gap-4">
                    <span>
                      {d.item}
                      <span className="block text-xs text-ink-muted">{d.room}</span>
                    </span>
                    <span className="shrink-0 font-mono">{formatKobo(d.amountKobo)}</span>
                  </div>
                  <p className={`mt-1 text-xs ${statusClass[d.status]}`}>
                    {statusText[d.status]}: &ldquo;{d.tenantComment}&rdquo;
                  </p>
                </li>
              ))}
          </ul>
        </section>

        {/* Plain facts */}
        <section aria-labelledby="facts" className="mt-8 border-t border-rule pt-8">
          <h2 id="facts" className="m-0 text-lg">
            Good to know
          </h2>
          <dl className="m-0 mt-4 border-t border-rule">
            {[
              [
                "No money passes through CautionSafe",
                "You pay and refund the caution fee the way you do now. CautionSafe keeps the record.",
              ],
              [
                "Photos stay private",
                "Only the landlord, agent and tenant on that flat can see them. A share link shows a signed report and nothing else.",
              ],
              [
                "Signed means signed",
                "Once both of you sign, the report locks. Nobody can change it after that.",
              ],
              [
                "Works on a basic Android phone",
                "Open it in your browser. Photos are shrunk before upload, so it works on slow data.",
              ],
            ].map(([term, desc]) => (
              <div key={term} className="border-b border-rule py-3">
                <dt className="font-semibold">{term}</dt>
                <dd className="m-0 mt-1 text-ink-muted">{desc}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="start" className="mt-8 border-t border-rule pt-8">
          <h2 id="start" className="m-0 text-lg">
            Moving in soon?
          </h2>
          <p className="mt-2 text-ink-muted">
            Landlords and agents start the report. Tenants join from the SMS link.
          </p>
          <div className="mt-4">
            <ButtonLink href="/login" className="w-full sm:w-auto">
              Start a move-in report
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer className="max-w-doc border-t border-rule py-6 text-xs text-ink-muted">
        <p className="m-0">CautionSafe keeps a signed record of a flat&apos;s condition. It does not hold or move money.</p>
        <p className="m-0 mt-1">&copy; 2026 CautionSafe</p>
      </footer>
    </div>
  );
}
