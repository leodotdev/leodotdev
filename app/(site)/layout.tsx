import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../theme-provider";
import { ThemeSwitcher } from "../theme-switcher";
import Link from "next/link";
import { TbArrowUpRight, TbFileText } from "react-icons/tb";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";

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
          <div className="container flex flex-col gap-8 p-6 md:p-12 lg:p-24">
            <div className="flex flex-wrap items-center justify-between gap-4 sm:w-full">
              <div className="flex flex-grow">
                <Link href="/" className="flex flex-col">
                  <h2 className="text-2xl font-semibold text-stone-950 dark:text-stone-50">
                    Leo
                  </h2>
                  <div className="text-md text-stone-500 dark:text-stone-500">
                    Designer
                  </div>
                </Link>
              </div>

              <div className="flex flex-wrap gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="rounded-full bg-stone-200/50 p-3 px-5 hover:bg-stone-200 dark:bg-stone-800/50 dark:hover:bg-stone-800">
                      <Link href="/Leo-SF-Resume-2023.pdf" target="_blank">
                        <TbFileText
                          title="Résumé"
                          className="h-5 w-5 stroke-stone-950 dark:stroke-stone-50"
                        />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Résumé</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Link
                  href="mailto:leo@leo.dev"
                  target="_blank"
                  className="cursor-pointer rounded-full bg-stone-200/50 p-3 px-5 text-stone-950 hover:bg-stone-200 dark:bg-stone-800/50 dark:text-stone-50 dark:hover:bg-stone-800"
                >
                  <span className="flex items-start gap-1">
                    Email <TbArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>

                <Link
                  href="https://www.linkedin.com/in/leosuccarferre/"
                  target="_blank"
                  className="cursor-pointer rounded-full bg-stone-200/50 p-3 px-5 text-stone-950 hover:bg-stone-200 dark:bg-stone-800/50 dark:text-stone-50 dark:hover:bg-stone-800"
                >
                  <span className="flex items-start gap-1">
                    LinkedIn <TbArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>

                {/* <Link
                  href="https://warpcast.com/leodotdev"
                  target="_blank"
                  className="cursor-pointer rounded-full bg-stone-200/50 p-3 px-5 text-stone-950 hover:bg-stone-200 dark:bg-stone-800/50 dark:text-stone-50 dark:hover:bg-stone-800"
                >
                  <span className="flex items-start gap-1">
                    Warpcast <TbArrowUpRight className="h-4 w-4" />
                  </span>
                </Link> */}

                <Link
                  href="https://twitter.com/leosuccarferre"
                  target="_blank"
                  className="cursor-pointer rounded-full bg-stone-200/50 p-3 px-5 text-stone-950 hover:bg-stone-200 dark:bg-stone-800/50 dark:text-stone-50 dark:hover:bg-stone-800"
                >
                  <span className="flex items-start gap-1">
                    Twitter <TbArrowUpRight className="h-4 w-4" />
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

            <main>{children}</main>
            <Card className="rounded-3xl shadow-none md:col-span-3">
              <CardContent className="p-6 text-center text-sm text-stone-500">
                Built using{" "}
                <a
                  className="text-stone-950 underline hover:text-blue-500"
                  target="_blank"
                  href="https://nextjs.org/"
                >
                  NextJS
                </a>
                ,{" "}
                <a
                  className="text-stone-950 underline hover:text-blue-500"
                  target="_blank"
                  href="https://nextjs.org/"
                >
                  TailwindCSS
                </a>
                ,{" "}
                <a
                  className="text-stone-950 underline hover:text-blue-500"
                  target="_blank"
                  href="https://nextjs.org/"
                >
                  ShadcnUI
                </a>{" "}
                +{" "}
                <a
                  className="text-stone-950 underline hover:text-blue-500"
                  target="_blank"
                  href="https://nextjs.org/"
                >
                  RadixUI
                </a>
                , and{" "}
                <a
                  className="text-stone-950 underline hover:text-blue-500"
                  target="_blank"
                  href="https://nextjs.org/"
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
