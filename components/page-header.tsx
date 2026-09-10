import type { ReactNode } from "react";

type PageHeaderProps = {
  breadcrumb: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
};

export function PageHeader({
  breadcrumb,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-mono text-xs text-muted-2">{breadcrumb}</p>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-pretty text-muted">{description}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}
