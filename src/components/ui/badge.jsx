import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-reddit-blue focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-reddit-orange text-white hover:bg-reddit-orange/80",
        secondary:
          "border-transparent bg-reddit-card text-reddit-text hover:bg-reddit-cardHover",
        destructive:
          "border-transparent bg-red-500/20 text-red-400 hover:bg-red-500/30",
        outline: "text-reddit-text border-reddit-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
