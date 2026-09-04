import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        kiosk: {
          blue: "#0284c7",
          darkblue: "#0369a1",
          teal: "#0d9488",
          ayush: "#059669",
          ayushLight: "#ecfdf5",
          redAlert: "#dc2626",
          orangeAlert: "#ea580c",
          surface: "#f8fafc",
          card: "#ffffff",
        }
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
