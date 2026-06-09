"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CatalogSectionHeading } from "@/app/components/main/CatalogSectionHeading";
import { CollectionPageHeader } from "@/app/components/main/CollectionPageHeader";
import { ProductCatalogControls } from "@/app/components/main/ProductCatalogControls";
import {
  ProductCard,
  ProductSkeleton,
} from "@/app/components/main/ProductCard";
import { SubcategoryCard } from "@/app/components/main/SubcategoryCard";
import { fetchProfessionCategories, type Category } from "@/lib/categories-api";
import {
  fetchProductsPaged,
  type PagedProducts,
  type ProductSort,
} from "@/lib/products-api";

export default function CollectionsIndexPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sort = (searchParams.get("sort") as ProductSort) || "name-asc";
  const page = Number(searchParams.get("page") ?? "0");
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  const [professions, setProfessions] = useState<Category[]>([]);
  const [catalog, setCatalog] = useState<PagedProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draftMin, setDraftMin] = useState(minPrice);
  const [draftMax, setDraftMax] = useState(maxPrice);

  useEffect(() => {
    setDraftMin(minPrice);
    setDraftMax(maxPrice);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchProfessionCategories(),
      fetchProductsPaged({
        page: Number.isNaN(page) ? 0 : page,
        size: 12,
        sort,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      }),
    ])
      .then(([cats, products]) => {
        setProfessions(cats);
        setCatalog(products);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur de chargement")
      )
      .finally(() => setLoading(false));
  }, [page, sort, minPrice, maxPrice]);

  const pushParams = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    router.push(`/collections?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-(--cream)">
      <CollectionPageHeader
        eyebrow="Catalogue"
        title="Collections"
        subtitle="Parcourez nos pièces par profession ou explorez l'ensemble du catalogue."
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Collections" },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <section className="mb-16 md:mb-20">
          <CatalogSectionHeading
            eyebrow="Professions"
            title="Par métier"
            countLabel={
              professions.length > 0
                ? `${professions.length} profession${professions.length > 1 ? "s" : ""}`
                : undefined
            }
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-5">
            {professions.map((profession) => (
              <SubcategoryCard
                key={profession.id}
                name={profession.name}
                slug={profession.slug}
              />
            ))}
          </div>
        </section>

        <section>
          <CatalogSectionHeading
            eyebrow="Catalogue"
            title="Tous les produits"
            countLabel={
              catalog
                ? `${catalog.total} pièce${catalog.total > 1 ? "s" : ""}`
                : undefined
            }
          />

          {catalog && (
            <ProductCatalogControls
              sort={sort}
              minPrice={draftMin}
              maxPrice={draftMax}
              page={catalog.page}
              totalPages={catalog.totalPages}
              total={catalog.total}
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
          )}

          {error && (
            <p className="mb-8 text-center text-[11px] uppercase tracking-[0.18em] text-(--sage)">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))
              : catalog?.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </section>
      </div>
    </div>
  );
}
