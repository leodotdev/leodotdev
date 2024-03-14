import "../../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "../../theme-provider";
import { ThemeSwitcher } from "../../theme-switcher";
import Link from "next/link";
import { TbArrowUpRight, TbCopy, TbChevronDown } from "react-icons/tb";
import { Analytics } from "@vercel/analytics/react";

import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CopyToClipboard from "@/components/CopyToClipboard";

const inter = Inter({ subsets: ["latin"] });

const ReallySansLargeUltra = localFont({
  src: "../../../public/fonts/ReallySansLarge-Ultra.woff",
});

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
        {/* <body className={ReallySansLargeUltra.className}> */}
        {/* <body className="font-mono"> */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="mx-auto flex max-w-screen-md flex-col gap-12 md:border-l md:border-r">
            <div className="fixed left-4 right-4 top-4 z-50 mx-auto flex w-fit max-w-screen-md flex-wrap items-center justify-center justify-self-center rounded-full border  bg-white/50 px-3 align-middle backdrop-blur-lg dark:bg-black/50">
              {/* <Link
                  href="https://warpcast.com/leodotdev"
                  target="_blank"
                  
                  >
                  <span className="flex h-12 items-center rounded-none text-md ">
                  Warpcast <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
                  </span>
                </Link> */}

              <Link href="https://twitter.com/leosuccarferre" target="_blank">
                <Button
                  variant="link"
                  tabIndex={-1}
                  className="text-md flex h-12 items-center rounded-none pr-3 "
                >
                  Twitter
                  <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
                </Button>
              </Link>
              <Link
                href="https://www.linkedin.com/in/leosuccarferre/"
                target="_blank"
              >
                <Button
                  variant="link"
                  tabIndex={-1}
                  className="text-md flex h-12 items-center rounded-none pr-3 "
                >
                  LinkedIn
                  <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
                </Button>
              </Link>
              <Link href="https://cal.com/leo.dev/20min" target="_blank">
                <Button
                  variant="link"
                  tabIndex={-1}
                  className="text-md flex h-12 items-center rounded-none pr-3 "
                >
                  Book a Call
                  <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
                </Button>
              </Link>
              <Link href="">
                <CopyToClipboard textToCopy="leo@leo.dev">
                  <Button
                    variant="link"
                    tabIndex={-1}
                    className="text-md flex h-12 items-center rounded-none pr-3 hover:no-underline"
                  >
                    Copy my Email
                    <TbCopy className="h-4 w-4 self-start text-stone-500" />
                  </Button>
                </CopyToClipboard>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="text-md flex h-12 items-center px-4 pr-3 font-medium text-stone-900 dark:text-stone-50">
                  Résumé <TbChevronDown className="h-4 w-4 text-stone-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link
                      href="/Leo-SF-Resume-2024.pdf"
                      target="_blank"
                      className="flex pr-0"
                    >
                      Adobe PDF
                      <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="https://docs.google.com/document/d/17uK2emyv7p8VYtYV5M36g3mxQ0CvbhDanzWVnVvtIiE/edit?usp=sharing"
                      target="_blank"
                      className="flex pr-0"
                    >
                      Google DOC
                      <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/Leo-SF-Resume-2024.docx"
                      target="_blank"
                      className="flex pr-0"
                    >
                      Word DOCX
                      <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <ThemeSwitcher />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Theme</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <main>
              {children}
              <Analytics />
            </main>
            <div>
              <div className={ReallySansLargeUltra.className}>
                <div className="flex items-center justify-center text-[72px] leading-none md:text-[128px]">
                  Thanks!
                </div>
              </div>

              <div className="mx-auto p-6 text-center">
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
                </a>{" "}
                &{" "}
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
              </div>
            </div>
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
