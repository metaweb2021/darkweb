import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 font-mono text-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-black hover:box-glow hover:brightness-110 shadow-[0_0_0_1px_rgba(53,255,158,0.4)]",
  outline:
    "border border-border-bright bg-surface/60 text-foreground hover:border-primary hover:text-primary hover:box-glow",
  ghost: "text-muted hover:text-primary hover:bg-surface/60",
};

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type AsLink = CommonProps & { href: string } & Omit<
    ComponentProps<typeof Link>,
    "href" | "className"
  >;
type AsButton = CommonProps & { href?: undefined } & Omit<
    ComponentProps<"button">,
    "className"
  >;

export function GlowButton(props: AsLink | AsButton) {
  const { variant = "primary", className = "", children, ...rest } = props;
  const cn = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...linkRest } = rest as AsLink;
    return (
      <Link href={href} className={cn} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cn} {...(rest as AsButton)}>
      {children}
    </button>
  );
}
