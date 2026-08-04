import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "white";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
} & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">)
  | ({ href?: undefined } & ComponentProps<"button">)
);

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "ripple inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink disabled:opacity-50";

  const variants = {
    primary: "bg-pink text-white hover:bg-pink-soft shadow-lg shadow-pink/15",
    secondary: "bg-ink text-white hover:bg-pink",
    ghost: "bg-transparent text-ink hover:text-pink",
    outline: "border border-ink/15 text-ink hover:border-pink hover:text-pink",
    white: "bg-white text-ink hover:bg-pink hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs uppercase",
    md: "px-6 py-3 text-xs uppercase tracking-wider",
    lg: "px-8 py-4 text-sm uppercase tracking-wider",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ComponentProps<"button">;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
