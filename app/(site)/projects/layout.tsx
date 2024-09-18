import "../../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import { Space_Mono } from "next/font/google";
import { ThemeProvider } from "../../theme-provider";
import Link from "next/link";
import { TbArrowUpRight, TbCopy, TbChevronDown } from "react-icons/tb";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

// const spaceMono = Space_Mono({
//   subsets: ["latin"],
//   weight: "400",
// });

export const metadata: Metadata = {
  title: "leo.dev",
  description: "Web, Software, Product Designer",
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const textToCopy = "Text you want to copy to clipboard";
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <body className={spaceMono.className}> */}
        {/* <body className="font-mono"> */}
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="mx-auto flex max-w-screen-md flex-col gap-12 md:border-l md:border-r">
            {" "}
            <main>
              {children}
              <Analytics />
            </main>
          </div>
        </ThemeProvider>
        <svg id="texture">
          <filter id="noise">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.5"
              numOctaves="1"
              stitchTiles="stitch"
            ></feTurbulence>
            <feColorMatrix type="saturate" values="0"></feColorMatrix>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)"></rect>
        </svg>
      </body>
    </html>
  );
}
