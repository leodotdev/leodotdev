import "../../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../../theme-provider";
import { ThemeSwitcher } from "../../theme-switcher";
import Link from "next/link";
import { TbArrowUpRight, TbCopy } from "react-icons/tb";
import { Analytics } from "@vercel/analytics/react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "leo.dev",
  description: "Software Designer",
  icons: {
    icon: { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <body className="font-mono"> */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="container flex flex-col gap-12 p-0 md:p-12 lg:p-24">
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:w-full md:p-0">
              <div className="flex flex-grow">
                <Link href="/" className="flex flex-col">
                  <h2 className="text-2xl font-semibold text-stone-950 dark:text-stone-50">
                    leo<span className="text-orange-500">.</span>dev
                  </h2>
                  {/* <span className="text-stone-500">Product Designer</span> */}
                </Link>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="https://cal.com/leo.dev/30min"
                  target="_blank"
                  className="cursor-pointer rounded-full bg-stone-200/50 p-3 px-5 text-stone-950 hover:bg-stone-200 hover:underline dark:bg-stone-800/50 dark:text-stone-50 dark:hover:bg-stone-800"
                >
                  Book a Call
                </Link>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <ThemeSwitcher />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Theme</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <main>
              {children}
              <Analytics />
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
