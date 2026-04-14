"use client";

import Link from "next/link";
import { TbArrowUpRight, TbCopy, TbChevronDown } from "react-icons/tb";
import { ThemeSwitcher } from "@/app/theme-switcher";
import CopyToClipboard from "@/components/CopyToClipboard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationProps {
  children?: React.ReactNode; // For custom first item like BackButton
}

export function Navigation({ children }: NavigationProps) {
  const copyEmail = () => {
    navigator.clipboard.writeText("leo@leo.dev").then(() => {
      alert("My email address—leo@leo.dev—has been copied to your clipboard.");
    });
  };

  return (
    <div className="border-b bg-background">
      <div className="mx-auto flex max-w-[960px] justify-between px-6 py-4 md:px-12">
        <div className="flex w-full flex-1 flex-wrap content-stretch items-stretch justify-stretch gap-6 [&:hover>*]:opacity-50">
          {children}

          <Link
            href="/resume"
            target="_blank"
            className="text-md flex items-center transition-opacity hover:!opacity-100 hover:underline"
          >
            Resume
            <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
          </Link>
          <Link
            href="https://twitter.com/leosuccarferre"
            target="_blank"
            className="text-md flex items-center transition-opacity hover:!opacity-100 hover:underline"
          >
            Twitter
            <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="text-md flex items-center outline-none transition-opacity hover:!opacity-100 hover:underline">
              More
              <TbChevronDown className="h-4 w-4 self-center text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link
                  href="https://cal.com/leo.dev/20min"
                  target="_blank"
                  className="flex cursor-pointer items-center"
                >
                  Let&apos;s chat
                  <TbArrowUpRight className="ml-1 h-4 w-4 text-muted-foreground" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={copyEmail}
                className="flex cursor-pointer items-center"
              >
                Copy my email
                <TbCopy className="ml-1 h-4 w-4 text-muted-foreground" />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="https://www.linkedin.com/in/leosuccarferre/"
                  target="_blank"
                  className="flex cursor-pointer items-center"
                >
                  LinkedIn
                  <TbArrowUpRight className="ml-1 h-4 w-4 text-muted-foreground" />
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  );
}
