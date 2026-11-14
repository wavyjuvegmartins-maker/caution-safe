// SVGs copied from docs/SPEC.md section 7. Do not edit the paths.

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CautionSafe">
      <rect x="1" y="1" width="30" height="30" rx="6" fill="#1C1B19" />
      <path d="M8 15.5 16 9l8 6.5V24H8z" stroke="#F7F5F0" strokeWidth="2" strokeLinejoin="round" />
      <path d="m12.5 18.5 2.5 2.5 4.5-5" stroke="#F7F5F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Mark + "CautionSafe" in Plex Sans 600, 18px, ink, 8px gap. No tagline. */
export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2 text-ink">
      <LogoMark />
      <span className="font-semibold text-brand">CautionSafe</span>
    </span>
  );
}
