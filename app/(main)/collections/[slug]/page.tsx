"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CatalogSectionHeading } from "@/app/components/main/CatalogSectionHeading";
import { CollectionPageHeader } from "@/app/components/main/CollectionPageHeader";
import { ProductCatalogControls } from "@/app/components/main/ProductCatalogControls";
import {
  ProductCard,
  ProductSkeleton,
} from "@/app/components/main/ProductCard";
import { SubcategoryCard } from "@/app/components/main/SubcategoryCard";
import { fetchCategoryPage, type CategoryPage } from "@/lib/categories-api";
import type { ProductSort } from "@/lib/products-api";

export default function CollectionPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const sort = (searchParams.get("sort") as ProductSort) || "name-asc";
  const productPage = Number(searchParams.get("page") ?? "0");
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  const [page, setPage] = useState<CategoryPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftMin, setDraftMin] = useState(minPrice);
  const [draftMax, setDraftMax] = useState(maxPrice);

  useEffect(() => {
    setDraftMin(minPrice);
    setDraftMax(maxPrice);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    if (!slug) {
      setMissing(true);
      setLoading(false);
      return;
    }

    fetchCategoryPage(slug, {
      page: Number.isNaN(productPage) ? 0 : productPage,
      size: 12,
      sort,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    })
      .then((data) => {
        if (!data) {
          setMissing(true);
          return;
        }
        setPage(data);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug, sort, productPage, minPrice, maxPrice]);

  const pushParams = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    router.push(`/collections/${slug}?${params.toString()}`);
  };

  const breadcrumbs = useMemo(() => {
    if (!page) {
      return [
        { label: "Accueil", href: "/" },
        { label: "Collections", href: "/collections" },
      ];
    }

    return [
      { label: "Accueil", href: "/" },
      { label: "Collections", href: "/collections" },
      ...page.breadcrumbs.map((crumb, index) => ({
        label: crumb.name,
        href:
          index < page.breadcrumbs.length - 1
            ? `/collections/${crumb.slug}`
            : undefined,
      })),
    ];
  }, [page]);

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
          href="/collections"
          className="mt-6 text-[10px] uppercase tracking-[0.22em] text-(--sage) hover:text-(--gold)"
        >
          Retour aux collections
        </Link>
      </div>
    );
  }

  const hasChildren = page.children.length > 0;
  const hasProducts = page.products.length > 0;

  return (
    <div className="min-h-screen bg-(--cream)">
      <CollectionPageHeader
        eyebrow="Collection"
        title={page.name}
        breadcrumbs={breadcrumbs}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        {error && (
          <p className="mb-8 text-center text-[11px] uppercase tracking-[0.18em] text-(--sage)">
            {error}
          </p>
        )}

        {hasChildren && (
          <section className="mb-16 md:mb-20">
            <CatalogSectionHeading
              title="Sous-catégories"
              countLabel={`${page.children.length} catégorie${page.children.length > 1 ? "s" : ""}`}
            />
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
            <CatalogSectionHeading
              title="Produits"
              subtitle={hasChildren ? "Incluant les sous-catégories" : undefined}
              countLabel={`${page.productTotal ?? page.products.length} pièce${(page.productTotal ?? page.products.length) > 1 ? "s" : ""}`}
            />

            <ProductCatalogControls
              sort={sort}
              minPrice={draftMin}
              maxPrice={draftMax}
              page={page.productPage ?? 0}
              totalPages={page.productTotalPages ?? 1}
              total={page.productTotal ?? page.products.length}
              onSortChange={(value) => pushParams({ sort: value, page: "0" })}
              onMinPriceChange={setDraftMin}
              onMaxPriceChange={setDraftMax}
              onApplyFilters={() =>
                pushParams({
                  minPrice: draftMin || null,
                  maxPrice: draftMax || null,
                  page: "0",
                })
              }
              onPageChange={(nextPage) =>
                pushParams({ page: String(nextPage) })
              }
            />

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
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
