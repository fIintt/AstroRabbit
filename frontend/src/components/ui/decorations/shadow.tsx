import { cn } from "@/lib/utils/cn";
import { cva, type VariantProps } from "@/lib/utils/cva";

const styles = cva(
  "absolute top-1/2 left-1/2 pointer-events-none select-none -translate-1/2 -z-10 size-full",
  {
    variants: {
      color: {
        black: "bg-ink",
        white: "bg-white-ink",
        accent: "bg-accent-ink",
        info: "bg-info-ink",
        success: "bg-success-ink",
        destructive: "bg-destructive-ink",
        warning: "bg-warning-ink",
      },
    },

    defaultVariants: {
      color: "black",
    },
  },
);

type Shadow = Omit<React.ComponentPropsWithoutRef<"span">, "children"> &
  VariantProps<typeof styles> & {
    spread?: number;
    opacity?: number;
  };

export function Shadow({ color, spread = 16, opacity = 10, style, className, ...props }: Shadow) {
  return (
    <div
      style={
        {
          width: `calc(100% + ${spread}px)`,
          height: `calc(100% + ${spread}px)`,
          opacity: opacity / 100,
        } as React.CSSProperties
      }
      className={cn(styles({ color, className }))}
      {...props}
    />
  );
}
