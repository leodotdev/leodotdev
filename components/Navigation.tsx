import Link from "next/link";
import { TbArrowUpRight, TbChevronDown, TbCopy } from "react-icons/tb";
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
  return (
    <div className="sticky left-0 right-0 top-0 z-50 border-b border-black/10 bg-secondary/20 backdrop-blur-md dark:border-white/10">
      <div className="mx-auto flex max-w-[960px] justify-between px-6 py-4 md:px-12">
        <div className="flex w-full flex-1 flex-wrap content-stretch items-stretch justify-stretch gap-6">
          {children}

          <Link
            href="https://cal.com/leo.dev/20min"
            target="_blank"
            className="text-md flex items-center hover:underline"
          >
            Let&apos;s chat
            <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
          </Link>

          <Link
            href=""
            className="text-md flex cursor-pointer items-center bg-transparent hover:underline "
          >
            <CopyToClipboard className="flex" textToCopy="leo@leo.dev">
              Copy my email
              <TbCopy className="h-4 w-4 self-start text-muted-foreground" />
            </CopyToClipboard>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-md flex items-center hover:underline">
              Resumés
              <TbChevronDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link
                  href="/Leo-SF-Resume-May-2025.pdf"
                  target="_blank"
                  className="flex pr-0"
                >
                  Adobe PDF
                  <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/Leo-SF-Resume-May-2025.docx"
                  target="_blank"
                  className="flex pr-0"
                >
                  Word DOCX
                  <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="https://docs.google.com/document/d/1H6ypwEoEqV9trkDmvr7iopD4s4UeYAAMFbj8JtnuGJQ/edit?tab=t.0"
                  target="_blank"
                  className="flex pr-0"
                >
                  Google DOC
                  <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="https://twitter.com/leosuccarferre"
            target="_blank"
            className="text-md flex items-center hover:underline"
          >
            Twitter
            <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/leosuccarferre/"
            target="_blank"
            className="text-md flex items-center hover:underline"
          >
            LinkedIn
            <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
          </Link>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  );
}
