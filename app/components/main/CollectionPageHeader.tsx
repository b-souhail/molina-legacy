import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type CollectionBreadcrumb = {
  label: string;
  href?: string;
};

type CollectionPageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: CollectionBreadcrumb[];
};

export function CollectionPageHeader({
  eyebrow = "Collection",
  title,
  subtitle,
  breadcrumbs = [],
}: CollectionPageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-(--gold)/20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,154,90,0.10),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        {breadcrumbs.length > 0 && (
          <nav className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-(--sage)">
            {breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight size={10} className="text-(--gold)/60" />
                )}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-(--gold)">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-(--forest)">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className={breadcrumbs.length > 0 ? "mt-8" : ""}>
          <p className="mb-3 text-[9px] uppercase tracking-[0.55em] text-(--sage)">
            {eyebrow}
          </p>
          <h1 className="font-heading text-4xl text-(--forest) md:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-(--sage)">
              {subtitle}
            </p>
          )}
          <div className="mt-5 flex items-center gap-3">
            <div className="h-px w-10 bg-(--gold)/50" />
            <div className="h-1.5 w-1.5 rotate-45 border border-(--gold)" />
            <div className="h-px w-10 bg-(--gold)/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
