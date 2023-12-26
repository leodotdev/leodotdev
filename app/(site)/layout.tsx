import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../theme-provider";
import { ThemeSwitcher } from "../theme-switcher";
import Link from "next/link";
import { TbArrowUpRight, TbCopy } from "react-icons/tb";
import { Analytics } from "@vercel/analytics/react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";

import CopyToClipboard from "@/components/CopyToClipboard";

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
  const textToCopy = "Text you want to copy to clipboard";
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <body className="font-mono"> */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="container flex flex-col gap-8 p-0 md:p-12 lg:p-24">
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:w-full md:p-0">
              <div className="flex flex-grow">
                <Link href="/" className="flex flex-col">
                  <h2 className="text-2xl font-semibold text-stone-950 dark:text-stone-50">
                    Leo
                  </h2>
                  <div className="text-md text-stone-500 dark:text-stone-500">
                    Product Designer
                  </div>
                </Link>
              </div>

              <div className="flex flex-wrap gap-4">
                <CopyToClipboard
                  textToCopy="leo@leo.dev"
                  className="cursor-pointer rounded-full bg-stone-200/50 p-3 px-5 text-stone-950 hover:bg-stone-200 hover:underline dark:bg-stone-800/50 dark:text-stone-50 dark:hover:bg-stone-800"
                >
                  <span className="flex items-start">
                    Email <TbCopy className="h-4 w-4 text-stone-500" />
                  </span>
                </CopyToClipboard>

                <Link
                  className="flex items-center gap-2 rounded-full bg-stone-200/50 px-5 hover:bg-stone-200 dark:bg-stone-800/50 dark:hover:bg-stone-800"
                  href="/Leo-SF-Resume-2023.pdf"
                  target="_blank"
                >
                  <span className="mr-1 flex items-start">Résumé:</span>
                  <Link href="/Leo-SF-Resume-2023.docx" target="_blank">
                    <span className="flex items-start hover:underline">
                      DOCX <TbArrowUpRight className="h-4 w-4 text-stone-500" />
                    </span>
                  </Link>
                  <Link href="/Leo-SF-Resume-2023.pdf" target="_blank">
                    <span className="flex items-start hover:underline">
                      PDF <TbArrowUpRight className="h-4 w-4 text-stone-500" />
                    </span>
                  </Link>
                </Link>

                <Link
                  href="https://www.linkedin.com/in/leosuccarferre/"
                  target="_blank"
                  className="cursor-pointer rounded-full bg-stone-200/50 p-3 px-5 text-stone-950 hover:bg-stone-200 hover:underline dark:bg-stone-800/50 dark:text-stone-50 dark:hover:bg-stone-800"
                >
                  <span className="flex items-start">
                    LinkedIn
                    <TbArrowUpRight className="h-4 w-4 text-stone-500" />
                  </span>
                </Link>

                {/* <Link
                  href="https://warpcast.com/leodotdev"
                  target="_blank"
                  className="cursor-pointer rounded-full hover:underline bg-stone-200/50 p-3 px-5 text-stone-950 hover:bg-stone-200 dark:bg-stone-800/50 dark:text-stone-50 dark:hover:bg-stone-800"
                  >
                  <span className="flex items-start">
                  Warpcast <TbArrowUpRight className="h-4 w-4 text-stone-500" />
                  </span>
                </Link> */}

                <Link
                  href="https://twitter.com/leosuccarferre"
                  target="_blank"
                  className="cursor-pointer rounded-full bg-stone-200/50 p-3 px-5 text-stone-950 hover:bg-stone-200 hover:underline dark:bg-stone-800/50 dark:text-stone-50 dark:hover:bg-stone-800"
                >
                  <span className="flex items-start">
                    Twitter
                    <TbArrowUpRight className="h-4 w-4 text-stone-500" />
                  </span>
                </Link>

                <Link
                  href="https://calendly.com/leodotdev"
                  target="_blank"
                  className="cursor-pointer rounded-full bg-stone-200/50 p-3 px-5 text-stone-950 hover:bg-stone-200 hover:underline dark:bg-stone-800/50 dark:text-stone-50 dark:hover:bg-stone-800"
                >
                  <span className="flex items-start">
                    Calendly
                    <TbArrowUpRight className="h-4 w-4 text-stone-500" />
                  </span>
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
            <Card className="rounded-3xl shadow-none md:col-span-3">
              <CardContent className="p-6 text-center text-sm text-stone-500">
                Built using{" "}
                <a
                  className="text-stone-950 underline hover:text-blue-500 dark:text-stone-50"
                  target="_blank"
                  href="https://nextjs.org/"
                >
                  NextJS
                </a>
                ,{" "}
                <a
                  className="text-stone-950 underline hover:text-blue-500 dark:text-stone-50"
                  target="_blank"
                  href="https://tailwindcss.com/"
                >
                  TailwindCSS
                </a>
                ,{" "}
                <a
                  className="text-stone-950 underline hover:text-blue-500 dark:text-stone-50"
                  target="_blank"
                  href="https://ui.shadcn.com/"
                >
                  ShadcnUI
                </a>
                +
                <a
                  className="text-stone-950 underline hover:text-blue-500 dark:text-stone-50"
                  target="_blank"
                  href="https://www.radix-ui.com/"
                >
                  RadixUI
                </a>
                , and{" "}
                <a
                  className="text-stone-950 underline hover:text-blue-500 dark:text-stone-50"
                  target="_blank"
                  href="https://www.sanity.io/"
                >
                  SanityCMS
                </a>
                .
              </CardContent>
            </Card>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
