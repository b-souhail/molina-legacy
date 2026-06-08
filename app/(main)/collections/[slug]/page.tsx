"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

import {
  ProductCard,
  ProductSkeleton,
} from "@/app/components/main/ProductCard";
import {
  categoryAbbr,
  fetchCategoryPage,
  type CategoryPage,
} from "@/lib/categories-api";

function SubcategoryCard({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  return (
    <Link
      href={`/collections/${slug}`}
      className="
        group
        relative
        flex
        flex-col
        items-center
        gap-3
        border
        border-(--gold)/20
        bg-(--cream)
        px-6
        py-8
        transition-all
        duration-300
        hover:border-(--gold)/50
        hover:shadow-[0_8px_28px_rgba(17,22,19,0.08)]
      "
    >
      <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-(--gold)/40" />
      <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-(--gold)/40" />
      <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-(--gold)/40" />
      <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-(--gold)/40" />

      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          border
          border-(--forest)/15
          bg-(--cream)
          text-sm
          font-semibold
          tracking-[0.14em]
          text-(--forest)
          transition-transform
          duration-300
          group-hover:scale-105
        "
      >
        {categoryAbbr(name)}
      </div>

      <p
        className="
          text-center
          text-[10px]
          uppercase
          tracking-[0.18em]
          text-(--forest)/75
          transition-colors
          group-hover:text-(--forest)
        "
      >
        {name}
      </p>
    </Link>
  );
}

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [page, setPage] = useState<CategoryPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setMissing(true);
      setLoading(false);
      return;
    }

    fetchCategoryPage(slug)
      .then((data) => {
        if (!data) {
          setMissing(true);
          return;
        }
        setPage(data);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-(--cream) py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12 h-10 w-1/3 animate-pulse bg-(--forest)/5" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (missing || !page) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-(--cream) px-4">
        <p className="font-heading text-2xl text-(--forest)">
          Catégorie introuvable
        </p>
        <Link
          href="/"
          className="mt-6 text-[10px] uppercase tracking-[0.22em] text-(--sage) hover:text-(--gold)"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const hasChildren = page.children.length > 0;
  const hasProducts = page.products.length > 0;

  return (
    <div className="min-h-screen bg-(--cream)">
      <section className="relative overflow-hidden border-b border-(--gold)/20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,154,90,0.10),transparent_60%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
          <nav className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-(--sage)">
            <Link href="/" className="transition-colors hover:text-(--gold)">
              Accueil
            </Link>
            {page.breadcrumbs.map((crumb, index) => (
              <span key={crumb.id} className="flex items-center gap-2">
                <ChevronRight size={10} className="text-(--gold)/60" />
                {index === page.breadcrumbs.length - 1 ? (
                  <span className="text-(--forest)">{crumb.name}</span>
                ) : (
                  <Link
                    href={`/collections/${crumb.slug}`}
                    className="transition-colors hover:text-(--gold)"
                  >
                    {crumb.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <div className="mt-8">
            <p className="mb-3 text-[9px] uppercase tracking-[0.55em] text-(--sage)">
              Collection
            </p>
            <h1 className="font-heading text-4xl text-(--forest) md:text-5xl">
              {page.name}
            </h1>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-px w-10 bg-(--gold)/50" />
              <div className="h-1.5 w-1.5 rotate-45 border border-(--gold)" />
              <div className="h-px w-10 bg-(--gold)/50" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        {error && (
          <p className="mb-8 text-center text-[11px] uppercase tracking-[0.18em] text-(--sage)">
            {error}
          </p>
        )}

        {hasChildren && (
          <section className="mb-16 md:mb-20">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-heading text-2xl text-(--forest)">
                Sous-catégories
              </h2>
              <p className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
                {page.children.length} catégorie
                {page.children.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-5">
              {page.children.map((child) => (
                <SubcategoryCard
                  key={child.id}
                  name={child.name}
                  slug={child.slug}
                />
              ))}
            </div>
          </section>
        )}

        {hasProducts && (
          <section>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-heading text-2xl text-(--forest)">
                  Produits
                </h2>
                {hasChildren && (
                  <p className="mt-1 text-[10px] tracking-[0.06em] text-(--sage)">
                    Incluant les sous-catégories
                  </p>
                )}
              </div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
                {page.products.length} pièce
                {page.products.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
              {page.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {!hasChildren && !hasProducts && !error && (
          <p className="py-20 text-center text-[11px] uppercase tracking-[0.18em] text-(--sage)">
            Aucun contenu disponible dans cette catégorie pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
