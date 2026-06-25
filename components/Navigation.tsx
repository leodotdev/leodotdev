"use client";

import Link from "next/link";
import { TbArrowUpRight, TbCopy, TbChevronDown, TbDownload } from "react-icons/tb";
import { ThemeSwitcher } from "@/app/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
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
    <div className="border-x border-b bg-background">
      <div className="mx-auto flex max-w-[960px] justify-between px-6 py-4 md:px-12">
        <div className="-mx-2 flex w-full flex-1 flex-wrap content-stretch items-stretch justify-stretch gap-2 [&:has([data-popup-open])>*]:opacity-50 [&:hover>*]:opacity-50">
          {children}

          <Link
            href="/resume"
            target="_blank"
            className="text-md group flex items-center px-2 transition-opacity hover:!opacity-100 hover:text-blue-500 hover:underline"
          >
            View resume
            <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground transition-colors group-hover:text-blue-500" />
          </Link>
          <a
            href="/Leo-SF-Resume-May-2025.pdf"
            download="Leo-Succar-Resume.pdf"
            className="text-md group flex items-center px-2 transition-opacity hover:!opacity-100 hover:text-blue-500 hover:underline"
          >
            Download PDF
            <TbDownload className="ml-0.5 h-4 w-4 self-center text-muted-foreground transition-colors group-hover:text-blue-500" />
          </a>
          {/* Services link hidden for now
          <Link
            href="/soon"
            className="text-md flex items-center px-2 transition-opacity hover:!opacity-100 hover:text-blue-500 hover:underline"
          >
            Services
          </Link>
          */}
          <a
            href="https://www.sanity.io/manage/project/jyqe7nab"
            target="_blank"
            rel="noopener noreferrer"
            className="text-md group flex items-center px-2 transition-opacity hover:!opacity-100 hover:text-blue-500 hover:underline"
          >
            Sanity
            <TbArrowUpRight className="ml-0.5 h-4 w-4 self-start text-muted-foreground transition-colors group-hover:text-blue-500" />
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-md flex items-center px-2 transition-opacity hover:!opacity-100 hover:underline data-[popup-open]:!opacity-100">
              Contact
              <TbChevronDown className="ml-0.5 h-4 w-4 self-center text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLinkItem
                render={<Link href="https://twitter.com/leosuccarferre" target="_blank" />}
                className="flex cursor-pointer items-center"
              >
                Twitter
                <TbArrowUpRight className="ml-1 h-4 w-4 text-muted-foreground" />
              </DropdownMenuLinkItem>
              <DropdownMenuItem
                onClick={copyEmail}
                className="flex cursor-pointer items-center"
              >
                Copy my email
                <TbCopy className="ml-1 h-4 w-4 text-muted-foreground" />
              </DropdownMenuItem>
              <DropdownMenuLinkItem
                render={<Link href="https://cal.com/leo.dev/20min" target="_blank" />}
                className="flex cursor-pointer items-center"
              >
                Schedule a call
                <TbArrowUpRight className="ml-1 h-4 w-4 text-muted-foreground" />
              </DropdownMenuLinkItem>
              <DropdownMenuLinkItem
                render={
                  <Link
                    href="https://www.linkedin.com/in/leosuccarferre/"
                    target="_blank"
                  />
                }
                className="flex cursor-pointer items-center"
              >
                LinkedIn
                <TbArrowUpRight className="ml-1 h-4 w-4 text-muted-foreground" />
              </DropdownMenuLinkItem>
              <DropdownMenuLinkItem
                render={
                  <Link href="https://github.com/leodotdev" target="_blank" />
                }
                className="flex cursor-pointer items-center"
              >
                GitHub
                <TbArrowUpRight className="ml-1 h-4 w-4 text-muted-foreground" />
              </DropdownMenuLinkItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  );
}
