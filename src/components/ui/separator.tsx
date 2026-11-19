import * as React from "react";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive> & {
    /**
     * A line between a page's sections: as wide as the window, not the
     * page's column (the column is centered, so half the difference goes
     * each side).
     */
    bleed?: boolean;
  }
>(({ className, orientation = "horizontal", bleed, ...props }, ref) => (
  <SeparatorPrimitive
    ref={ref}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      bleed && "mx-[calc(50%-50vw)] w-screen max-w-none",
      className,
    )}
    {...props}
  />
));
Separator.displayName = "Separator";

export { Separator };
