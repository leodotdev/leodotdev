import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "./theme-provider";
import { ThemeSwitcher } from "./theme-switcher";
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
              <div className="flex flex-row gap-4">
                <Link href="/" className="flex flex-col">
                  <h2
                    className={`text-2xl font-semibold text-stone-950 dark:text-stone-50`}
                  >
                    Leo
                  </h2>
                  <p className={`text-md text-stone-500 dark:text-stone-500`}>
                    Designer
                  </p>
                </Link>
                <ThemeSwitcher />
              </div>

              <div className="flex flex-row gap-4">
                <a
                  href="https://twitter.com/leosuccarferre"
                  target="_blank"
                  className="cursor-pointer rounded-full bg-stone-100 p-3 px-5 text-stone-950 dark:bg-stone-800/50 dark:text-stone-50"
                >
                  Twitter
                </a>

                <a
                  href="https://www.linkedin.com/in/leosuccarferre/"
                  target="_blank"
                  className="cursor-pointer rounded-full bg-stone-100 p-3 px-5 text-stone-950 dark:bg-stone-800/50 dark:text-stone-50"
                >
                  LinkedIn
                </a>

                <a
                  href="/Leo-SF-Resume-2023.pdf"
                  target="_blank"
                  className="cursor-pointer self-center rounded-full bg-stone-100 p-3 px-5 dark:bg-stone-800/50 dark:text-stone-50"
                >
                  <TbFileText
                    title="Resume"
                    className="h-5 w-5 stroke-stone-950 dark:stroke-stone-50"
                  />
                </a>
              </div>
            </div>

            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
