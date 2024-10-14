import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'app-gradient': 'linear-gradient(180deg, #0081A7 0%, #1FE2F9 53%, #FFFFFF 99%)',
        'app-gradient-x': 'linear-gradient(90deg, #00CCC0 0%,  #004FC0 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
