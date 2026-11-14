import { createHash } from "node:crypto";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { LockedStamp } from "@/components/brand/LockedStamp";
import { Wordmark } from "@/components/brand/Logo";
import { CameraIcon } from "@/components/brand/icons";
import { ConditionPicker } from "@/components/inspection/ConditionPicker";
import { AppScreen, ScreenButton } from "@/components/marketing/AppScreen";
import { ButtonLink } from "@/components/ui/Button";
import { ConditionBadge } from "@/components/ui/ConditionBadge";
import { MoneyRow } from "@/components/ui/MoneyRow";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { sampleDeductions, sampleRooms, sampleTenancy as t } from "@/content/sample-report";
import { formatCaptureTime, formatDay } from "@/lib/dates";
import { formatKobo } from "@/lib/money";
import { summariseSettlement } from "@/lib/settlement";
import { localPhoto } from "./local-photo";

export const metadata: Metadata = {
  title: "CautionSafe: get your caution fee back, with proof",
  description:
    "Landlord and tenant photograph every room at move-in, both sign by phone, and use the same photos at move-out to settle the caution fee.",
};

// The stamp shows a real SHA-256 of the sample report, the same way locked reports are hashed.
const sampleHash = createHash("sha256")
  .update(JSON.stringify({ tenancy: t, rooms: sampleRooms }))
  .digest("hex");

const settlement = summariseSettlement(
  t.cautionFeeKobo,
  sampleDeductions.map((d) => ({ amountKobo: d.amountKobo, status: d.status })),
);

const tapPhotoAt = new Date(t.moveInAt.getTime() + 60_000);
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export default function HomePage() {
  const kitchen = localPhoto("kitchen.jpg");

  return (
    <div className="mx-auto max-w-wide px-4 sm:px-8">
      <header className="flex items-center justify-between py-4">
        <Link href="/" className={`rounded-md ${focusRing}`}>
          <Wordmark />
        </Link>
        <Link href="/login" className={`font-medium underline decoration-rule underline-offset-4 hover:decoration-ink ${focusRing}`}>
          Sign in
        </Link>
      </header>

      <main>
        {/* ---------------------------------------------------------------- */}
        {/* Opening: the pitch beside the thing itself, a signed report.      */}
        {/* ---------------------------------------------------------------- */}
        <section className="grid gap-8 pb-8 pt-6 lg:grid-cols-12 lg:items-center lg:pt-8">
          <div className="lg:col-span-5">
            <h1 className="m-0 text-xl">Get your caution fee back, with proof.</h1>
            <p className="mt-4 text-md text-ink-muted">
              CautionSafe is a move-in report for rented flats in Nigeria. Landlord and tenant photograph every room
              together and both sign by phone. At move-out, the same photos settle what comes off the caution fee.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/login">Start a move-in report</ButtonLink>
              <a href="#how" className={`rounded-md px-1 py-2 font-medium underline decoration-rule underline-offset-4 hover:decoration-ink ${focusRing}`}>
                See how it works
              </a>
            </div>
            <p className="mt-4 text-xs text-ink-muted">Works in your phone&apos;s browser. Nothing to install.</p>
          </div>

          <div className="relative lg:col-span-7 lg:pb-8">
            {/* The report sheet */}
            <article aria-label="Sample move-in report" className="rounded-md border border-rule bg-card lg:w-[80%]">
              <div className="flex items-start justify-between gap-4 px-4 pb-3 pt-4">
                <div>
                  <p className="label m-0">Move-in report</p>
                  <p className="m-0 mt-1 font-semibold">
                    {t.property}, {t.area}
                  </p>
                </div>
                <span className="whitespace-nowrap font-mono text-xs text-ink-muted">{t.reportId}</span>
              </div>

              <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-2 px-4 pb-3">
                {[
                  ["Landlord", t.landlord, false],
                  ["Tenant", t.tenant, false],
                  ["Caution fee", formatKobo(t.cautionFeeKobo), true],
                  ["Inspected", formatDay(t.moveInAt), true],
                ].map(([term, value, mono]) => (
                  <div key={String(term)}>
                    <dt className="label">{term}</dt>
                    <dd className={`m-0 ${mono ? "font-mono" : ""}`}>{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="relative mx-4 aspect-video overflow-hidden rounded-md bg-rule">
                {kitchen ? (
                  <Image
                    src={kitchen}
                    alt="Kitchen photographed at move-in"
                    fill
                    priority
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="object-cover"
                  />
                ) : (
                  // TODO: real photo
                  <div className="flex h-full items-center justify-center text-ink-muted">
                    <CameraIcon />
                  </div>
                )}
              </div>
              <p className="mx-4 mt-1 font-mono text-caption text-ink-muted">
                Kitchen, {formatCaptureTime(t.moveInAt)}
              </p>

              <table className="mt-3 w-full border-collapse text-left">
                <caption className="sr-only">Condition of each room at move-in</caption>
                <tbody>
                  {sampleRooms.map((r) => (
                    <tr key={r.name} className="border-t border-rule">
                      <th scope="row" className="px-4 py-2 font-medium">
                        {r.name}
                      </th>
                      <td className="py-2 pr-4">
                        <ConditionBadge condition={r.condition} />
                      </td>
                      <td className="py-2 pr-4 text-right font-mono text-xs text-ink-muted">
                        {r.photos} photos
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-rule px-2 py-2">
                <div className="stamp-in max-w-full">
                  <LockedStamp lockedAt={t.lockedAt} contentHash={sampleHash} />
                </div>
              </div>
            </article>

            {/* The sign screen, laid over the sheet on wide screens */}
            <AppScreen
              description="Sign screen: Chinedu Okafor has signed. Ngozi Eze is entering the 6-digit code sent by SMS."
              eyebrow="Move-in report"
              title="Sign with your phone"
              className="ml-8 mt-4 sm:ml-auto sm:w-[300px] lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:w-[260px]"
              action={<ScreenButton>Sign report</ScreenButton>}
            >
              <ul className="m-0 list-none p-0 text-xs">
                <li className="flex justify-between border-b border-rule py-2">
                  <span>{t.landlord}</span>
                  <span className="font-medium text-green">Signed {formatCaptureTime(t.lockedAt).split(", ")[1]}</span>
                </li>
                <li className="flex justify-between py-2">
                  <span>{t.tenant}</span>
                  <span className="font-medium text-amber">Waiting to sign</span>
                </li>
              </ul>
              <p className="m-0 mt-2 text-xs text-ink-muted">Enter the code sent to 0803 *** 4521</p>
              <div className="mt-2 grid grid-cols-6 gap-1">
                {["4", "8", "2", "0", "", ""].map((d, i) => (
                  <span
                    key={i}
                    className={`flex h-8 items-center justify-center rounded-sm border font-mono text-md ${
                      i === 4 ? "border-ink" : "border-rule"
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </AppScreen>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* The problem                                                       */}
        {/* ---------------------------------------------------------------- */}
        <section aria-labelledby="problem" className="grid gap-6 border-t border-rule py-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="problem" className="m-0 text-lg">
              Why caution fees end in quarrels
            </h2>
            <p className="mt-2 text-ink-muted">
              The fight at move-out is almost never about money. It is about what the flat looked like a year ago.
            </p>
          </div>
          <dl className="m-0 border-t border-rule lg:col-span-8 lg:border-t-0">
            {[
              [
                "Nobody wrote it down",
                "Move-in day is a quick walk through the flat and a handshake. A year later, a cracked tile is one person's word against another's.",
              ],
              [
                "Phone photos don't settle it",
                "Pictures sit in one person's gallery. The other side never agreed to them and can say they were taken later.",
              ],
              [
                "The landlord already holds the money",
                "Without a record both sides signed, the tenant has nothing to argue a deduction with. Good landlords get treated with the same suspicion as bad ones.",
              ],
            ].map(([term, desc]) => (
              <div key={term} className="border-b border-rule py-4 lg:first:pt-0">
                <dt className="text-md font-semibold">{term}</dt>
                <dd className="m-0 mt-1 text-ink-muted">{desc}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* How it works: a real sequence, each step with its real screen     */}
        {/* ---------------------------------------------------------------- */}
        <section id="how" aria-labelledby="how-title" className="scroll-mt-4 border-t border-rule py-8">
          <h2 id="how-title" className="m-0 text-lg">
            How it works
          </h2>
          <p className="mt-2 max-w-doc text-ink-muted">
            One record per tenancy, in three steps. The server enforces each one, so nobody can skip ahead or edit after
            signing.
          </p>

          <ol className="relative m-0 mt-6 grid list-none gap-8 p-0 lg:grid-cols-3 lg:gap-6">
            <span aria-hidden="true" className="absolute left-0 right-0 top-3 hidden h-px bg-rule lg:block" />

            <li className="relative">
              <StepHead n={1} title="Move-in" />
              <p className="mt-2 text-ink-muted">
                Walk through each room together. Mark walls, floor, doors, windows, sockets and fittings, and take at least
                2 photos. Both sign by phone and the report locks.
              </p>
              <AppScreen
                className="mt-4"
                description="Move-in room screen for the kitchen: two time-stamped photos, checklist items marked Good, and fittings marked Fair."
                eyebrow="Move-in, room 3 of 5"
                title="Kitchen"
                action={<ScreenButton>Next room</ScreenButton>}
              >
                <div className="grid grid-cols-2 gap-2">
                  <PhotoTile src={kitchen} alt="" capturedAt={t.moveInAt} sizes="160px" imgClassName="object-left" />
                  <PhotoTile src={kitchen} alt="" capturedAt={tapPhotoAt} sizes="160px" imgClassName="object-right" />
                </div>
                <ul className="m-0 mt-3 list-none p-0">
                  {["Walls", "Floor", "Sockets"].map((item) => (
                    <li key={item} className="flex items-center justify-between border-b border-rule py-2">
                      <span>{item}</span>
                      <ConditionBadge condition="good" />
                    </li>
                  ))}
                </ul>
                <p className="label m-0 mt-3">Fittings</p>
                <div className="mt-2">
                  <ConditionPicker label="Fittings" value="fair" />
                </div>
                <p className="m-0 mt-3 rounded-sm border border-rule px-3 py-2 text-xs">Sink tap drips.</p>
              </AppScreen>
            </li>

            <li className="relative">
              <StepHead n={2} title="Move-out" />
              <p className="mt-2 text-ink-muted">
                Each room opens with its move-in photos beside an empty slot. Take the same shot again, mark the same
                checklist, and sign.
              </p>
              <AppScreen
                className="mt-4"
                description="Move-out room screen for the kitchen: the move-in photo of the sink on the left, an empty slot to take the move-out photo on the right."
                eyebrow="Move-out, room 3 of 5"
                title="Kitchen"
                action={<ScreenButton>Take move-out photo</ScreenButton>}
              >
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="label m-0 mb-1">Move-in</p>
                    <PhotoTile src={kitchen} alt="" capturedAt={tapPhotoAt} sizes="160px" imgClassName="object-right" />
                  </div>
                  <div>
                    <p className="label m-0 mb-1">Move-out</p>
                    <div className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-md border border-ink-muted text-ink-muted">
                      <CameraIcon />
                      <span className="text-caption">Take photo</span>
                    </div>
                  </div>
                </div>
                <p className="m-0 mt-3 text-xs text-ink-muted">At move-in: Sink tap drips.</p>
                <p className="label m-0 mt-3">Fittings now</p>
                <div className="mt-2">
                  <ConditionPicker label="Fittings now" value="fair" />
                </div>
                <p className="m-0 mt-2 text-xs text-ink-muted">Same as move-in.</p>
              </AppScreen>
            </li>

            <li className="relative">
              <StepHead n={3} title="Settlement" />
              <p className="mt-2 text-ink-muted">
                The landlord lists deductions with a reason and a photo. The tenant accepts or disputes each one. Only
                accepted items come off the refund.
              </p>
              <AppScreen
                className="mt-4"
                description={`Settlement screen: caution fee ${formatKobo(t.cautionFeeKobo)}, two accepted deductions, one disputed, refund due ${formatKobo(settlement.refundDueKobo)}.`}
                eyebrow={t.property}
                title="Settlement"
                action={<ScreenButton variant="secondary">Download PDF</ScreenButton>}
              >
                <MoneyRow label="Caution fee" kobo={settlement.cautionFeeKobo} />
                {sampleDeductions.map((d) => (
                  <MoneyRow
                    key={d.item}
                    sign={d.status === "accepted" ? "minus" : undefined}
                    tone={d.status === "disputed" ? "red" : "default"}
                    kobo={d.amountKobo}
                    label={
                      <span className="text-xs">
                        {d.item}
                        <span className={`block ${d.status === "disputed" ? "text-red" : "text-ink-muted"}`}>
                          {d.status === "disputed" ? "Disputed, not deducted" : "Accepted"}
                        </span>
                      </span>
                    }
                  />
                ))}
                <div className="flex items-baseline justify-between gap-4 pt-3 text-green">
                  <span className="font-semibold">Refund due</span>
                  <span className="font-mono text-md font-medium">{formatKobo(settlement.refundDueKobo)}</span>
                </div>
              </AppScreen>
            </li>
          </ol>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Both sides                                                        */}
        {/* ---------------------------------------------------------------- */}
        <section aria-labelledby="sides" className="border-t border-rule py-8">
          <h2 id="sides" className="m-0 text-lg">
            Fair to both sides
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:gap-8">
            <Side
              title="For tenants"
              points={[
                "Proof of the flat's condition on the day you moved in, signed by your landlord.",
                "No deduction without a reason and a photo.",
                "Dispute any item in writing, and it stays out of the refund until it is settled.",
              ]}
            />
            <Side
              title="For landlords and agents"
              points={[
                "A signed record the tenant cannot walk back at move-out.",
                "Charge for real damage, with move-in and move-out photos side by side.",
                "Run inspections for every flat you manage from one phone.",
              ]}
            />
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Plain facts                                                       */}
        {/* ---------------------------------------------------------------- */}
        <section aria-labelledby="facts" className="grid gap-6 border-t border-rule py-8 lg:grid-cols-12">
          <h2 id="facts" className="m-0 text-lg lg:col-span-4">
            Good to know
          </h2>
          <dl className="m-0 border-t border-rule lg:col-span-8 lg:border-t-0">
            {[
              [
                "No money passes through CautionSafe",
                "You pay and refund the caution fee the way you do now. CautionSafe keeps the record.",
              ],
              [
                "Photos stay private",
                "Only the landlord, agent and tenant on that flat can see them. A share link shows a signed report and nothing else.",
              ],
              ["Signed means signed", "Once both of you sign, the report locks. Nobody can change it after that."],
              [
                "Built for a basic Android phone",
                "Photos are shrunk on your phone before upload, so it works on slow data.",
              ],
            ].map(([term, desc]) => (
              <div key={term} className="border-b border-rule py-3 lg:first:pt-0">
                <dt className="font-semibold">{term}</dt>
                <dd className="m-0 mt-1 text-ink-muted">{desc}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="start" className="border-t border-rule py-8">
          <h2 id="start" className="m-0 text-lg">
            Moving in soon?
          </h2>
          <p className="mt-2 text-ink-muted">Landlords and agents start the report. Tenants join from the SMS link.</p>
          <div className="mt-4">
            <ButtonLink href="/login" className="w-full sm:w-auto">
              Start a move-in report
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-rule py-6 text-xs text-ink-muted">
        <p className="m-0">CautionSafe keeps a signed record of a flat&apos;s condition. It does not hold or move money.</p>
        <p className="m-0 mt-1">Sample data. Kitchen photo by Emmanuel Ikwuegbu on Unsplash.</p>
        <p className="m-0 mt-1">&copy; 2026 CautionSafe</p>
      </footer>
    </div>
  );
}

function StepHead({ n, title }: { n: number; title: string }) {
  return (
    <div className="relative flex items-center gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink bg-paper font-mono text-caption">
        {n}
      </span>
      <h3 className="m-0 bg-paper pr-3 text-md font-semibold">{title}</h3>
    </div>
  );
}

function Side({ title, points }: { title: string; points: string[] }) {
  return (
    <div>
      <h3 className="m-0 text-md font-semibold">{title}</h3>
      <ul className="m-0 mt-2 list-none border-t border-rule p-0">
        {points.map((p) => (
          <li key={p} className="border-b border-rule py-2">
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
