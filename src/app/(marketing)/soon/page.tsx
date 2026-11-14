import type { Metadata } from "next";
import { FloorPlanEmpty } from "@/components/brand/FloorPlanEmpty";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ButtonLink } from "@/components/ui/Button";

// Temporary destination for the sign-up and sign-in buttons until /login ships
// (milestone 2). Remove this page and change src/lib/site.ts then.
export const metadata: Metadata = {
  title: "Launching soon | CautionSafe",
  robots: { index: false },
};

export default function SoonPage() {
  return (
    <div className="mx-auto max-w-wide px-4 sm:px-8">
      <SiteHeader />
      <main className="max-w-doc pb-8 pt-8">
        <FloorPlanEmpty />
        <h1 className="m-0 mt-6 text-xl">Launching soon</h1>
        <p className="mt-3 text-md text-ink-muted">
          CautionSafe is not open for sign-up yet. We are finishing the app: phone login, room-by-room inspections and
          signing.
        </p>
        <p className="mt-3 text-ink-muted">
          Landlords, agents and tenants will be able to start a move-in report here when it opens.
        </p>
        <div className="mt-6">
          <ButtonLink href="/" variant="secondary" className="w-full sm:w-auto">
            Back to home
          </ButtonLink>
        </div>
      </main>
    </div>
  );
}
