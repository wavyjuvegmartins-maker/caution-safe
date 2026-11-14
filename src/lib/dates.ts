// All dates are shown in Africa/Lagos regardless of the viewer's device.

const captureFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Africa/Lagos",
});

const dayFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Africa/Lagos",
});

/** "14 Nov 2026, 10:42" */
export function formatCaptureTime(d: Date): string {
  return captureFmt.format(d);
}

/** "14 Nov 2026" */
export function formatDay(d: Date): string {
  return dayFmt.format(d);
}
