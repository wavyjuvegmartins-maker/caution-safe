// Sample data for the landing page. Realistic, but not a real tenancy.
import type { Condition } from "@/components/ui/ConditionBadge";
import type { DeductionStatus } from "@/lib/settlement";

export const sampleTenancy = {
  reportId: "CS-0142",
  property: "Flat 3, 12 Okigwe Rd",
  area: "Aba, Abia State",
  landlord: "Chinedu Okafor",
  tenant: "Ngozi Eze",
  cautionFeeKobo: 15_000_000,
  moveInAt: new Date("2026-11-14T09:42:00Z"),
  lockedAt: new Date("2026-11-14T10:31:00Z"),
  moveOutAt: new Date("2027-11-13T10:05:00Z"),
  meterNumber: "0412 3378 901",
  meterUnits: "86.4",
};

export type SampleRoom = { name: string; condition: Condition; photos: number; note: string };

export const sampleRooms: SampleRoom[] = [
  { name: "Parlour", condition: "good", photos: 4, note: "Fresh paint. All 4 sockets work." },
  { name: "Bedroom 1", condition: "good", photos: 3, note: "Wardrobe doors close well." },
  { name: "Kitchen", condition: "fair", photos: 3, note: "Sink tap drips. Cabinet hinge stiff." },
  { name: "Toilet/Bath", condition: "good", photos: 2, note: "Cistern and shower head fine." },
  { name: "Exterior", condition: "fair", photos: 2, note: "Gate paint peeling at the bottom." },
];

export type SampleDeduction = {
  room: string;
  item: string;
  amountKobo: number;
  status: DeductionStatus;
  tenantComment?: string;
};

export const sampleDeductions: SampleDeduction[] = [
  { room: "Toilet/Bath", item: "Replace cracked cistern lid", amountKobo: 1_800_000, status: "accepted" },
  { room: "Parlour", item: "Repaint wall behind TV stand", amountKobo: 1_200_000, status: "accepted" },
  {
    room: "Kitchen",
    item: "Replace dripping sink tap",
    amountKobo: 750_000,
    status: "disputed",
    tenantComment: "Tap was already dripping at move-in. See kitchen note, 14 Nov 2026.",
  },
];
