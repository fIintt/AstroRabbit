import { cn } from "@/lib/utils/cn";
import { cva, type VariantProps } from "@/lib/utils/cva";

const styles = cva(
  "font-medium uppercase select-none inline-flex tracking-wider text-nowrap shrink-0",
  {
    variants: {
      size: {
        sm: "px-1 py-0.75 text-[8px]/none",
        md: "px-1.5 py-0.75 text-[10px]/none",
        lg: "px-2 py-0.75 text-[12px]/none",
      },

      color: {
        black: "text-ink bg-ink/10",
        white: "text-white-ink bg-white-ink/10",
        accent: "text-accent-ink bg-accent-ink/10",
        info: "text-info-ink bg-info-ink/10",
        success: "text-success-ink bg-success-ink/10",
        destructive: "text-destructive-ink bg-destructive-ink/10",
        warning: "text-warning-ink bg-warning-ink/10",
      },
    },

    defaultVariants: {
      color: "black",
      size: "md",
    },
  },
);

type Badge = React.ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof styles> & {
    children: React.ReactNode;
  };

export function Badge({ children, color, size, style, className, ...props }: Badge) {
  return (
    <span
      className={cn(
        styles({
          color,
          size,
          className,
        }),
      )}
      {...props}
    >
      {children}
    </span>
  );
}
