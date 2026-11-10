import { TbArrowUpRight, TbCopy, TbChevronDown, TbDownload } from "react-icons/tb";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItemProps = {
  icon?: IconType;
  children?: React.ReactNode;
} & (
  | ({ href: string } & React.ComponentProps<"a">)
  | ({ href?: undefined } & React.ComponentProps<"button">)
);

/**
 * One item in the top bar: a label with an optional trailing icon. Renders a
 * link when given `href`, otherwise a button (the Contact menu trigger), so
 * every item shares the same spacing, icon alignment and hover treatment.
 */
function NavItem({ icon: Icon, children, className, ...props }: NavItemProps) {
  const classes = cn(
    "group flex items-center px-2 transition-opacity hover:!opacity-100 hover:text-blue-500 hover:underline data-[popup-open]:!opacity-100",
    className,
  );
  const content = (
    <>
      {children}
      {Icon && (
        <Icon className="ml-1.5 h-4 w-4 text-muted-foreground transition-colors group-hover:text-blue-500" />
      )}
    </>
  );
  return props.href !== undefined ? (
    <a className={classes} {...props}>
      {content}
    </a>
  ) : (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}

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

          <NavItem href="/resume" target="_blank" icon={TbArrowUpRight}>
            View resume
          </NavItem>
          <NavItem
            href="/Leo-SF-Resume-May-2025.pdf"
            download="Leo-Succar-Resume.pdf"
            icon={TbDownload}
          >
            Download PDF
          </NavItem>
          {/* Services link hidden for now
          <NavItem href="/soon">Services</NavItem>
          */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<NavItem icon={TbChevronDown} />}>
              Contact
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLinkItem
                render={<a href="https://twitter.com/leosuccarferre" target="_blank" />}
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
                render={<a href="https://cal.com/leo.dev/20min" target="_blank" />}
                className="flex cursor-pointer items-center"
              >
                Schedule a call
                <TbArrowUpRight className="ml-1 h-4 w-4 text-muted-foreground" />
              </DropdownMenuLinkItem>
              <DropdownMenuLinkItem
                render={
                  <a
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
                  <a href="https://github.com/leodotdev" target="_blank" />
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
