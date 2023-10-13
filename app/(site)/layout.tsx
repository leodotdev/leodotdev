import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../theme-provider";
import { ThemeSwitcher } from "../theme-switcher";
import Link from "next/link";
import { TbFileText } from "react-icons/tb";

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
      {/* <body className={inter.className}> */}
      <body className="font-mono">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="container p-12 lg:p-24">
            <div className="mb-24 flex w-full flex-row items-center justify-between gap-4">
              <div className="flex flex-row items-center gap-4">
                <Link href="/" className="flex flex-col">
                  <h2 className="text-2xl font-semibold text-stone-950 dark:text-stone-50">
                    Leo
                  </h2>
                  <div className="text-md text-stone-500 dark:text-stone-500">
                    Designer
                  </div>
                </Link>
              </div>

              <div className="flex flex-row gap-4">
                <Link
                  href="/Leo-SF-Resume-2023.pdf"
                  target="_blank"
                  className="cursor-pointer self-center rounded-full bg-stone-200/50 p-3 px-5 hover:bg-stone-200 dark:bg-stone-800/50 dark:hover:bg-stone-800"
                >
                  <TbFileText
                    title="Resume"
                    className="h-5 w-5 stroke-stone-950 dark:stroke-stone-50"
                  />
                </Link>

                <Link
                  href="https://twitter.com/leosuccarferre"
                  target="_blank"
                  className="cursor-pointer rounded-full bg-stone-200/50 p-3 px-5 text-stone-950 hover:bg-stone-200 dark:bg-stone-800/50 dark:text-stone-50 dark:hover:bg-stone-800"
                >
                  Twitter
                </Link>

                <Link
                  href="https://www.linkedin.com/in/leosuccarferre/"
                  target="_blank"
                  className="cursor-pointer rounded-full bg-stone-200/50 p-3 px-5 text-stone-950 hover:bg-stone-200 dark:bg-stone-800/50 dark:text-stone-50 dark:hover:bg-stone-800"
                >
                  LinkedIn
                </Link>

                <ThemeSwitcher />
              </div>
            </div>

            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}