"use client";

import React from "react";

import Link from "next/link";

import { BracketGroup } from "@/components/ui/decorations/bracket";

import { cn } from "@/lib/utils/cn";
import { cva, type VariantProps } from "@/lib/utils/cva";

const isExternalLink = (href: string) => /^(https?:\/\/|\/\/|mailto:|tel:|ftp:|sms:)/.test(href);

const hoverInsetStyles = {
  sm: "group-hover/btn:inset-px group-active/btn:inset-0.5",
  md: "group-hover/btn:inset-0.5 group-active/btn:inset-1",
  lg: "group-hover/btn:inset-0.75 group-active/btn:inset-1.25",
} as const;

const styles = cva(
  [
    "relative inline-flex cursor-pointer select-none items-center justify-center",
    "hover:text-ink active:scale-[0.98]",
    "disabled:text-ink disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none",
  ],

  {
    variants: {
      variant: {
        normal: "",
        destructive: "hover:text-destructive-ink active:text-destructive-ink",
        border: "border-2 border-ink/20 hover:border-ink active:border-ink border-dashed",
      },

      size: {
        sm: "px-1.5 py-1 text-xxs",
        md: "px-2 py-1.5 text-xs",
        lg: "px-2.5 py-2 text-sm",
        icon: "p-1.5 text-ink/40",
      },

      flush: {
        true: "p-0 m-0",
        false: "",
      },

      brackets: {
        true: "group/btn",
        false: "",
      },

      animated: {
        true: "transition-[color,background-color,border-color,opacity,scale] duration-200",
        false: "",
      },
    },

    defaultVariants: {
      variant: "normal",
      size: "md",
      flush: false,
      brackets: false,
      animated: false
    },
  },
);

type Base = VariantProps<typeof styles> & {
  children?: React.ReactNode;
  className?: string;
  hoverInset?: keyof typeof hoverInsetStyles;
};

type NativeButton = Base &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
    ref?: React.Ref<HTMLButtonElement>;
  };

type InternalLink = Base &
  Omit<React.ComponentProps<typeof Link>, "children" | "className" | "ref"> & {
    href: string;
    ref?: React.Ref<HTMLAnchorElement>;
  };

type ExternalLink = Base &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    ref?: React.Ref<HTMLAnchorElement>;
  };

type ButtonProps = NativeButton | InternalLink | ExternalLink;

function extract<T extends ButtonProps>({
  children,
  variant,
  size,
  hoverInset,
  flush,
  brackets,
  animated,
  className,
  ...props
}: T) {
  const safeSize = !size || size === "icon" ? "sm" : size;

  const classes = cn(styles({ size, variant, flush, brackets, className }));

  const content = (
    <>
      {children}
      {brackets && (
        <div
          className={cn(
            "absolute inset-0",
            animated && "transition-[inset] duration-200",
            hoverInsetStyles[hoverInset ?? safeSize],
          )}
        >
          <BracketGroup size={safeSize} />
        </div>
      )}
    </>
  );

  return { classes, content, props };
}

function validate({ children, size, ...props }: ButtonProps) {
  if (process.env.NODE_ENV === "production") return;

  if (size === "icon" && React.Children.count(children) !== 1) {
    console.warn('Button with size="icon" should contain a single icon.');
  }

  if (
    size === "icon" &&
    !("aria-label" in props && props["aria-label"]) &&
    !("aria-labelledby" in props && props["aria-labelledby"])
  ) {
    console.warn(
      'Button with size="icon" should have an aria-label (or aria-labelledby) for accessibility.',
    );
  }
}

function renderButton(btn: NativeButton) {
  const { classes, content, props } = extract(btn);
  const { ref, type, ...buttonProps } = props;

  return (
    <button {...buttonProps} ref={ref} type={type ?? "button"} className={classes}>
      {content}
    </button>
  );
}

function renderInternalLink(btn: InternalLink) {
  const { classes, content, props } = extract(btn);
  const { ref, href, ...linkProps } = props;

  return (
    <Link {...linkProps} ref={ref} href={href} className={classes}>
      {content}
    </Link>
  );
}

function renderExternalLink(btn: ExternalLink) {
  const { classes, content, props } = extract(btn);
  const { ref, href, target, rel, ...linkProps } = props;

  return (
    <a
      {...linkProps}
      ref={ref}
      href={href}
      target={target}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      className={classes}
    >
      {content}
    </a>
  );
}

export function Button(props: ButtonProps) {
  validate(props);

  if (props.href === undefined) return renderButton(props);

  if (isExternalLink(props.href)) return renderExternalLink(props);

  return renderInternalLink(props);
}
