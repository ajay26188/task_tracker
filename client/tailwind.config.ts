import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- very important
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
