import { useState } from "react";
import { flushSync } from "react-dom";
import { TbArrowUpRight, TbCheck, TbCopy, TbChevronDown } from "react-icons/tb";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { wave } from "@/lib/wave";
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

/** The Contact dropdown: Twitter, copy email, LinkedIn and GitHub. */
export function ContactMenu() {
  const [open, setOpen] = useState(false);

  // Items wave on click only. The menu stays open while the wave plays on
  // the chosen item, then closes; closing at once would take the item away.
  const waveThenClose = (e: React.MouseEvent<HTMLElement>) =>
    wave(e.currentTarget, undefined, { focus: e.nativeEvent, speed: 2 }).then(
      () => setOpen(false),
    );

  // Copying says so in place: the wave carries the item's label to
  // "Copied!", then the menu closes. The label resets when it next opens.
  const [copied, setCopied] = useState(false);
  const copyEmail = (e: React.MouseEvent<HTMLElement>) => {
    void navigator.clipboard.writeText("leo@leo.dev");
    void wave(e.currentTarget, () => flushSync(() => setCopied(true)), {
      focus: e.nativeEvent,
      speed: 2,
    }).then(() => setOpen(false));
  };

  const links = [
    { label: "Twitter", href: "https://twitter.com/leosuccarferre" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/leosuccarferre/" },
    { label: "GitHub", href: "https://github.com/leodotdev" },
  ];
  const link = ({ label, href }: (typeof links)[number]) => (
    <DropdownMenuLinkItem
      key={label}
      render={<a href={href} target="_blank" />}
      closeOnClick={false}
      onClick={(e) => void waveThenClose(e)}
      className="flex cursor-pointer items-center"
    >
      {label}
      <TbArrowUpRight className="ml-1 h-4 w-4 text-muted-foreground" />
    </DropdownMenuLinkItem>
  );

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next) => {
        if (next) setCopied(false);
        setOpen(next);
      }}
    >
      <DropdownMenuTrigger render={<Button variant="pill" data-wave-click />}>
        Contact
        <TbChevronDown className="-mr-1 ml-1 h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {link(links[0])}
        <DropdownMenuItem
          closeOnClick={false}
          onClick={copyEmail}
          className="flex cursor-pointer items-center"
        >
          {/* both labels share one cell, so the menu keeps its width */}
          <span className="grid">
            <span className={cn("col-start-1 row-start-1", copied && "invisible")}>
              Copy my email
            </span>
            <span
              aria-hidden={!copied}
              className={cn("col-start-1 row-start-1", !copied && "invisible")}
            >
              Copied!
            </span>
          </span>
          {copied ? (
            <TbCheck className="ml-1 h-4 w-4 text-muted-foreground" />
          ) : (
            <TbCopy className="ml-1 h-4 w-4 text-muted-foreground" />
          )}
        </DropdownMenuItem>
        {links.slice(1).map(link)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navigation({ children }: NavigationProps) {
  return (
    <div className="border-x border-b bg-background">
      <div className="mx-auto flex max-w-[960px] items-center justify-between px-6 py-4 md:px-12">
        <div className="-mx-2 flex flex-1 flex-wrap items-center gap-2">
          {children}
          <div className="flex h-10 items-center px-2">
            <ThemeSwitcher />
          </div>
        </div>
        <div className="flex">
          {/* Services link hidden for now
          <Button variant="pill" render={<a href="/soon" />}>Services</Button>
          */}
          <ContactMenu />
        </div>
      </div>
    </div>
  );
}
