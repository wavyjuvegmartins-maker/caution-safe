import type { Config } from "tailwindcss";

// Tokens from docs/SPEC.md section 6. Every colour carries meaning or is neutral.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      paper: "#F7F5F0",
      card: "#FFFFFF",
      ink: { DEFAULT: "#1C1B19", muted: "#6B6860" },
      rule: "#E2DED5",
      green: "#1F6B4A",
      amber: "#A86B12",
      red: "#B3261E",
      "stamp-bg": "#EAF2EC",
    },
    fontFamily: {
      sans: ["\"IBM Plex Sans\"", "system-ui", "sans-serif"],
      mono: ["\"IBM Plex Mono\"", "ui-monospace", "monospace"],
    },
    fontSize: {
      xs: ["13px", { lineHeight: "1.45" }],
      sm: ["15px", { lineHeight: "1.45" }],
      md: ["17px", { lineHeight: "1.45" }],
      lg: ["20px", { lineHeight: "1.35" }],
      xl: ["26px", { lineHeight: "1.25" }],
      label: ["12px", { lineHeight: "1.45", letterSpacing: "0.06em" }],
      // Photo captions: Plex Mono 12px, no tracking (SPEC section 6).
      caption: ["12px", { lineHeight: "1.45" }],
      // Wordmark only (SPEC section 7).
      brand: ["18px", { lineHeight: "1" }],
    },
    fontWeight: { normal: "400", medium: "500", semibold: "600" },
    spacing: {
      0: "0px",
      px: "1px",
      1: "4px",
      2: "8px",
      3: "12px",
      4: "16px",
      6: "24px",
      8: "32px",
    },
    // Max 6px. `full` is only for the Stepper's numbered dots.
    borderRadius: { none: "0px", sm: "2px", DEFAULT: "4px", md: "6px", full: "9999px" },
    borderWidth: { 0: "0px", DEFAULT: "1px" },
    boxShadow: {
      none: "none",
      // Only the bottom sheet may use this.
      sheet: "0 -2px 12px rgba(28, 27, 25, 0.12)",
    },
    extend: {
      maxWidth: { doc: "720px" },
      // 12% tint for selected condition states (SPEC section 6, ConditionPicker).
      opacity: { 12: "0.12" },
    },
  },
  plugins: [],
};

export default config;
