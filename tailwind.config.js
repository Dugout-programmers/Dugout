/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white01: "#FAFAFA",
        white02: "#EEEEEE",
        black01: "#0A0A0A",
        balck02: "#1E1E1E",
        gray01: "#B1B1B1",
        gray03: "#515151",
        gray02: "#919191",
        Landers: "#E61E2A",
        Twins: "#C30452",
        Heros: "#6F263D",
        Dinos: "#315288",
        Tigers: "#C30452",
        Bears: "#0D2340",
        Giants: "#002955",
        Lions: "#007AC1",
        Eagles: "#FF6600",
        Wiz: "#C30452",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
