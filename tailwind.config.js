import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        secondary: "var(--color-secondary)",
        muted: "var(--color-muted)",
        light: "var(--color-light)",
        hover: "var(--color-hover)",
        border: "var(--color-border)",
        divider: "var(--color-divider)",
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        card: {
          DEFAULT: "var(--color-card)",
          hover: "var(--color-card-hover)",
        },
      },
    },
  },
  plugins: [heroui()],
};
