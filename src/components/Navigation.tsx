import { useState } from "react"
import { flushSync } from "react-dom"
import { TbArrowUpRight, TbCheck, TbCopy, TbChevronDown } from "react-icons/tb"
import { BackButtonExit } from "@/components/BackButton"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { wave } from "@/lib/wave"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavigationProps {
  /** What goes before the name: the Back button, on a page under the home page. */
  children?: React.ReactNode
  className?: string
}

/** The Contact dropdown: Twitter, copy email, LinkedIn and GitHub. */
export function ContactMenu() {
  const [open, setOpen] = useState(false)

  // Items wave on click only. The menu stays open while the wave plays on
  // the chosen item, then closes; closing at once would take the item away.
  const waveThenClose = (e: React.MouseEvent<HTMLElement>) =>
    wave(e.currentTarget, undefined, { focus: e.nativeEvent, speed: 2 }).then(
      () => setOpen(false)
    )

  // Copying says so in place: the wave carries the item's label to
  // "Copied!", then the menu closes. The label resets when it next opens.
  const [copied, setCopied] = useState(false)
  const copyEmail = (e: React.MouseEvent<HTMLElement>) => {
    void navigator.clipboard.writeText("leo@leo.dev")
    void wave(e.currentTarget, () => flushSync(() => setCopied(true)), {
      focus: e.nativeEvent,
      speed: 2,
    }).then(() => setOpen(false))
  }

  const links = [
    { label: "Twitter", href: "https://twitter.com/leosuccarferre" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/leosuccarferre/" },
    { label: "GitHub", href: "https://github.com/leodotdev" },
  ]
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
  )

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next) => {
        if (next) setCopied(false)
        setOpen(next)
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
            <span
              className={cn("col-start-1 row-start-1", copied && "invisible")}
            >
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
  )
}

/**
 * The top of every page: the name and title, then Contact and the theme and
 * grid switchers. The home page shows it as is; a page under it passes the
 * Back button, which sits to the left of the name. The button slides in,
 * moving the name over, and slides out again on the page that follows.
 */
export function Navigation({ children, className }: NavigationProps) {
  // With the Back button a phone is short of room: the row's gaps tighten
  // from 16px to 8px there, and the title wraps onto two lines as it does on
  // the home page.
  const back = Boolean(children)
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-6 pt-12 md:px-12",
        back && "max-md:gap-2",
        className
      )}
    >
      <div
        className={cn(
          "flex min-w-0 items-center gap-4",
          back && "max-md:gap-2"
        )}
      >
        {/* Without a Back button of its own, a page shows the last page's
            one leaving, if it had one. */}
        {children ?? <BackButtonExit />}
        <div className="min-w-0">
          <div className="font-semibold">Leo Succar</div>
          <div className="text-muted-foreground">Designer &amp; Developer</div>
        </div>
      </div>
      <div
        className={cn(
          "flex shrink-0 items-center gap-4",
          back && "max-md:gap-2"
        )}
      >
        {/* Services link hidden for now
        <Button variant="pill" render={<a href="/soon" />}>Services</Button>
        */}
        <ContactMenu />
        <ThemeSwitcher />
        {/* The grid and columns switch is hidden for now. To show it again,
            put this back and import GridSwitcher from
            "@/components/GridSwitcher":
        <GridSwitcher />
        */}
      </div>
    </div>
  )
}
