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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavigationProps {
  children?: React.ReactNode; // For custom first item like BackButton
}

export function Navigation({ children }: NavigationProps) {
  return (
    <div className="sticky left-4 right-4 top-4 z-50 px-6 md:px-12">
      <div className="flex w-full justify-between rounded-3xl border bg-secondary/20 p-1 backdrop-blur-md">
        <div className="flex w-full flex-1 flex-wrap content-stretch items-stretch justify-stretch gap-1">
          {children}
          <Link
            href="https://twitter.com/leosuccarferre"
            target="_blank"
            className="text-md flex items-center rounded-full bg-transparent px-4 py-2 pr-3 hover:bg-secondary"
          >
            My Twitter
            <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/leosuccarferre/"
            target="_blank"
            className="text-md flex items-center rounded-full bg-transparent px-4 py-2 pr-3 hover:bg-secondary"
          >
            My LinkedIn
            <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
          </Link>
          <Link
            href="https://cal.com/leo.dev/20min"
            target="_blank"
            className="text-md flex items-center rounded-full bg-transparent px-4 py-2 pr-3 hover:bg-secondary"
          >
            Let&apos;s Chat
            <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
          </Link>
          <Link
            href=""
            className="text-md flex cursor-pointer items-center rounded-full bg-transparent px-4 py-2 pr-3 hover:bg-secondary"
          >
            <CopyToClipboard className="flex" textToCopy="leo@leo.dev">
              Copy my email
              <TbCopy className="h-4 w-4 self-start text-muted-foreground" />
            </CopyToClipboard>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-md flex items-center rounded-full bg-transparent px-4 py-2 pr-3 hover:bg-secondary hover:no-underline">
              My résumés
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
                  href="https://docs.google.com/document/d/17uK2emyv7p8VYtYV5M36g3mxQ0CvbhDanzWVnVvtIiE/edit?usp=sharing"
                  target="_blank"
                  className="flex pr-0"
                >
                  Google DOC
                  <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="https://read.cv/leo.dev"
                  target="_blank"
                  className="flex pr-0"
                >
                  Read.cv
                  <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
  );
}