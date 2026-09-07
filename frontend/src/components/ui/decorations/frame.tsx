import React from "react";

import { Diamond } from "@/components/ui/decorations/diamond";
import { Bracket } from "@/components/ui/decorations/bracket";

import { cn } from "@/lib/utils/cn";
import { cva, type VariantProps } from "@/lib/utils/cva";

const styles = cva(
  "pointer-events-none absolute border-current z-50 border-2 select-none",

  {
    variants: {
      color: {
        black: "text-ink",
        white: "text-white-ink",
        accent: "text-accent-ink",
        info: "text-info-ink",
        success: "text-success-ink",
        destructive: "text-destructive-ink",
        warning: "text-warning-ink",
      },
    },

    defaultVariants: {
      color: "black",
    },
  },
);

const LABEL_POSITION = {
  TOP: {
    outer: "border-t-0",
    inner: "-top-0.5",
  },
  BOTTOM: {
    outer: "border-b-0",
    inner: "-bottom-0.5",
  },
} as const;

type Frame = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof styles> & {
    children: React.ReactNode;
    variant?: "brackets" | "no-brackets";
    label: React.ReactNode;
    labelPosition?: "TOP" | "BOTTOM";
    inset?: number;
  };

export function Frame({
  children,
  color,
  variant = "no-brackets",
  label,
  labelPosition = "BOTTOM",
  inset = 0,
  className,
}: Frame) {
  return (
    <>
      <div
        style={{
          inset: `${inset}px`,
        }}
        aria-hidden="true"
        className={cn(styles({ color, className }), LABEL_POSITION[labelPosition].outer)}
      >
        {variant === "brackets" && (
          <>
            <Bracket
              color="accent"
              className="pointer-events-none absolute top-1 left-1 z-50 size-15"
            />
            <Bracket
              color="accent"
              className="pointer-events-none absolute right-1 bottom-1 z-50 size-15"
              position="bottom-right"
            />
          </>
        )}

        <div
          className={cn(
            "absolute -left-0.5 z-60 flex h-0.5 w-[calc(100%+4px)] items-center justify-between",
            LABEL_POSITION[labelPosition].inner,
          )}
        >
          <span className="h-0.5 w-full bg-current" />
          <Diamond className="border-current" />

          {React.isValidElement(label) ? (
            label
          ) : (
            <span className="font-headline pointer-events-auto shrink-0 px-4 text-2xl tracking-[0.04em] uppercase">
              {label}
            </span>
          )}

          <Diamond className="border-current" />
          <span className="h-0.5 w-full bg-current" />
        </div>
      </div>

      {children}
    </>
  );
}
