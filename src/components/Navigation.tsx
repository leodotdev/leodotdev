import { useState } from "react";
import { TbArrowUpRight, TbCopy, TbChevronDown } from "react-icons/tb";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
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

  const copyEmail = (e: React.MouseEvent<HTMLElement>) => {
    void navigator.clipboard.writeText("leo@leo.dev");
    void waveThenClose(e).then(() => {
      alert("My email address—leo@leo.dev—has been copied to your clipboard.");
    });
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
    <DropdownMenu open={open} onOpenChange={setOpen}>
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
          Copy my email
          <TbCopy className="ml-1 h-4 w-4 text-muted-foreground" />
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
