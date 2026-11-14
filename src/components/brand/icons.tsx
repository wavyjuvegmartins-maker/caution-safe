// Icons from docs/SPEC.md section 7. 24x24, stroke = currentColor.
import type { ReactNode, SVGProps } from "react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number };

function Shell({ size = 24, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const CameraIcon = (p: IconProps) => (
  <Shell {...p}>
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </Shell>
);

export const RoomIcon = (p: IconProps) => (
  <Shell {...p}>
    <path d="M6 21V3h12v18" />
    <path d="M3 21h18" />
    <circle cx="15" cy="12" r="0.9" fill="currentColor" />
  </Shell>
);

export const MeterIcon = (p: IconProps) => (
  <Shell {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <rect x="7" y="6" width="10" height="5" rx="1" />
    <path d="M8 15h2M14 15h2M8 18h2M14 18h2" />
  </Shell>
);

export const SignIcon = (p: IconProps) => (
  <Shell {...p}>
    <path d="M4 20h16" />
    <path d="M14.5 4.5l3 3L9 16H6v-3z" />
  </Shell>
);

export const LockedIcon = (p: IconProps) => (
  <Shell {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Shell>
);

export const DamagedIcon = (p: IconProps) => (
  <Shell {...p}>
    <path d="M12 3 2 20h20z" />
    <path d="M12 10v4" />
    <circle cx="12" cy="17" r="0.9" fill="currentColor" />
  </Shell>
);

export const CompareIcon = (p: IconProps) => (
  <Shell {...p}>
    <rect x="3" y="5" width="8" height="14" rx="1" />
    <rect x="13" y="5" width="8" height="14" rx="1" />
  </Shell>
);
