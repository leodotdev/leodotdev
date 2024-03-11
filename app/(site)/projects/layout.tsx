import "../../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "../../theme-provider";
import { ThemeSwitcher } from "../../theme-switcher";
import Link from "next/link";
import { TbArrowUpRight, TbCopy } from "react-icons/tb";
import { Analytics } from "@vercel/analytics/react";

import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";

import CopyToClipboard from "@/components/CopyToClipboard";

const inter = Inter({ subsets: ["latin"] });

const ReallySansLargeUltra = localFont({
  src: "../../../public/fonts/ReallySansLarge-Ultra.woff",
});

const ReallySansSmallRegular = localFont({
  src: "../../../public/fonts/ReallySansSmall-Regular.woff",
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
        <div className="flex items-center justify-center">
          {/* <body className="font-mono"> */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex max-w-screen-md flex-col border-l border-r">
              <div className="flex flex-col items-center pt-12">
                <Link href="/" className="">
                  {/* <div className="h-32 w-32 rounded-full bg-white" /> */}
                  <div className={ReallySansLargeUltra.className}>
                    <h2 className="-mb-8 flex flex-col text-center text-[128px] font-black leading-none text-stone-950 dark:text-stone-50">
                      Leo
                    </h2>
                    <h2 className="-gap-3 flex flex-col text-center text-[128px] font-black leading-none text-stone-950 dark:text-stone-50">
                      Succar
                    </h2>
                  </div>
                  {/* <span className="text-stone-500">Product Designer</span> */}
                </Link>

                <div className="flex flex-wrap justify-center gap-2">
                  {/* <Link
                  href="https://warpcast.com/leodotdev"
                  target="_blank"
                  
                  >
                  <span className="flex h-auto items-start text-xl leading-6">
                  Warpcast <TbArrowUpRight className="h-4 w-4 text-stone-500" />
                  </span>
                </Link> */}

                  <CopyToClipboard
                    textToCopy="leo@leo.dev"
                    className={ReallySansSmallRegular.className}
                  >
                    <Button
                      variant="link"
                      className="flex h-auto items-start text-xl leading-6"
                    >
                      Copy my Email{" "}
                      <TbCopy className="h-4 w-4 text-stone-500" />
                    </Button>
                  </CopyToClipboard>

                  <Link
                    href="https://twitter.com/leosuccarferre"
                    target="_blank"
                    className={ReallySansSmallRegular.className}
                  >
                    <Button
                      variant="link"
                      className="flex h-auto items-start text-xl leading-6"
                    >
                      Twitter
                      <TbArrowUpRight className="h-4 w-4 text-stone-500" />
                    </Button>
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/leosuccarferre/"
                    target="_blank"
                    className={ReallySansSmallRegular.className}
                  >
                    <Button
                      variant="link"
                      className="flex h-auto items-start text-xl leading-6"
                    >
                      LinkedIn
                      <TbArrowUpRight className="h-4 w-4 text-stone-500" />
                    </Button>
                  </Link>
                  <Link
                    href="https://cal.com/leo.dev/20min"
                    target="_blank"
                    className={ReallySansSmallRegular.className}
                  >
                    <Button
                      variant="link"
                      className="flex h-auto items-start text-xl leading-6"
                    >
                      Book a Call
                      <TbArrowUpRight className="h-4 w-4 text-stone-500" />
                    </Button>
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
              <Card className="my-6 rounded-none border-none shadow-none md:col-span-3">
                <CardContent className="flex flex-col items-center gap-6 p-6 text-sm text-stone-500">
                  <div className="flex">
                    <Link
                      href="/Leo-SF-Resume-2024_compressed.pdf"
                      target="_blank"
                    >
                      <Button
                        variant="link"
                        className="flex items-start rounded-r-none"
                      >
                        resume.PDF
                        <TbArrowUpRight className="h-4 w-4 text-stone-500" />
                      </Button>
                    </Link>
                    <Link
                      href="https://docs.google.com/document/d/17uK2emyv7p8VYtYV5M36g3mxQ0CvbhDanzWVnVvtIiE/edit?usp=sharing"
                      target="_blank"
                    >
                      <Button
                        variant="link"
                        className="flex items-start rounded-none rounded-none"
                      >
                        .GDOC
                        <TbArrowUpRight className="h-4 w-4 text-stone-500" />
                      </Button>
                    </Link>
                    <Link href="/Leo-SF-Resume-2024.docx" target="_blank">
                      <Button
                        variant="link"
                        className="flex items-start rounded-l-none"
                      >
                        .DOCX
                        <TbArrowUpRight className="h-4 w-4 text-stone-500" />
                      </Button>
                    </Link>
                  </div>
                  <div className="flex flex-wrap">
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
                  </div>
                </CardContent>
              </Card>
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
        </div>
      </body>
    </html>
  );
}
