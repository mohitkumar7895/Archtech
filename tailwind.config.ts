import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#071A35",
          deep: "#071A35",
          royal: "#10284A",
          light: "#1A3B6B",
          muted: "#264B82",
        },
        gold: {
          DEFAULT: "#D6B36A",
          light: "#F2D99B",
          dark: "#B89246",
          subtle: "#FBF6EA",
        },
        surface: {
          DEFAULT: "#F6F7FA",
          white: "#FFFFFF",
          text: "#172033",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 20px 50px -12px rgba(7, 26, 53, 0.14)",
        gold: "0 10px 30px -5px rgba(214, 179, 106, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
