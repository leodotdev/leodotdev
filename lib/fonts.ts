import { Playfair_Display } from "next/font/google";

export const playfairDisplay = Playfair_Display({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["serif"],
  preload: true,
  variable: "--font-playfair",
});