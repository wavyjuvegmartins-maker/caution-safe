// Empty-state floor plan from docs/SPEC.md section 7.
export function FloorPlanEmpty() {
  return (
    <svg viewBox="0 0 200 140" width="200" height="140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g stroke="#6B6860" strokeWidth="1.5">
        <rect x="10" y="10" width="180" height="120" />
        <path d="M100 10v70M10 80h180M130 80v50M100 45h90" />
      </g>
      <g fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="#6B6860" textAnchor="middle">
        <text x="55" y="48">PARLOUR</text>
        <text x="145" y="30">KITCHEN</text>
        <text x="145" y="65">BATH</text>
        <text x="70" y="108">BEDROOM 1</text>
        <text x="160" y="108">BEDROOM 2</text>
      </g>
    </svg>
  );
}
