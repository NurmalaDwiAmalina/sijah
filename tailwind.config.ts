import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F6FEE9",
          100: "#DEFFA7",
          200: "#0FD859",
          300: "#17D55C",
          500: "#17D55C",
          600: "#019537",
          700: "#019537",
        },
        ink: {
          900: "#000000",
          800: "#1a1a1a",
          700: "#504F4F",
          500: "#868686",
          400: "#868686",
          300: "#CECECE",
          200: "#DFDFDF",
          100: "#EEEEEE",
          50: "#F6F6F6",
        },
        accent: {
          red: "#FF4B4B",
          redSoft: "#FFD1C9",
          blue: "#008BFF",
          blueSoft: "#DAEEFF",
          orange: "#FFB62E",
          orangeSoft: "#FFEDB1",
        },
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #019537 0%, #17D55C 45%, #0FD859 75%, #DEFFA7 100%)",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(0,0,0,0.04), 0 1px 3px 0 rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
