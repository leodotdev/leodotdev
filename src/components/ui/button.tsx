import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // The site's one button and link style: a pill on the raised surface.
        // Pass `render` to draw it as a link. The border is kept but
        // invisible, so the box (and the wave drawn on it) is unchanged.
        pill: "rounded-full border border-transparent bg-secondary font-semibold text-secondary-foreground [corner-shape:round] hover:bg-secondary/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        pill: "h-[38px] px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends useRender.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, render, ...props }, forwardedRef) => {
    return useRender({
      ref: forwardedRef,
      defaultTagName: "button",
      render,
      props: mergeProps<"button">(
        {
          className: cn(
            buttonVariants({
              variant,
              // a pill has one size unless told otherwise
              size: size ?? (variant === "pill" ? "pill" : undefined),
              className,
            }),
          ),
        },
        props,
      ),
    });
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
