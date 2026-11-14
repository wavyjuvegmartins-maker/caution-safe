// Locked stamp from docs/SPEC.md section 7, with date and hash as props.

const stampDate = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Africa/Lagos",
});

export function LockedStamp({ lockedAt, contentHash }: { lockedAt: Date; contentHash: string }) {
  const date = stampDate.format(lockedAt).toUpperCase();
  const shortHash = contentHash.slice(0, 8);
  return (
    <svg viewBox="0 0 240 84" width="240" height="84" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Signed by both parties">
      <g transform="rotate(-4 120 42)">
        <rect x="6" y="10" width="228" height="64" rx="4" className="fill-stamp-bg stroke-green" strokeWidth="1.5" />
        <rect x="11" y="15" width="218" height="54" rx="2" className="stroke-green" strokeWidth="0.75" />
        <text x="120" y="38" textAnchor="middle" fontFamily="IBM Plex Sans, sans-serif" fontWeight="600" fontSize="13" letterSpacing="1.2" className="fill-green">
          SIGNED BY BOTH PARTIES
        </text>
        <text x="120" y="58" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" className="fill-green">
          {`${date} · #${shortHash}`}
        </text>
      </g>
    </svg>
  );
}
