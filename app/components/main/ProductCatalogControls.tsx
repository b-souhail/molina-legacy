"use client";

import type { ProductSort } from "@/lib/products-api";

type ProductCatalogControlsProps = {
  sort: ProductSort;
  minPrice: string;
  maxPrice: string;
  page: number;
  totalPages: number;
  total: number;
  onSortChange: (sort: ProductSort) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onApplyFilters: () => void;
  onPageChange: (page: number) => void;
};

export function ProductCatalogControls({
  sort,
  minPrice,
  maxPrice,
  page,
  totalPages,
  total,
  onSortChange,
  onMinPriceChange,
  onMaxPriceChange,
  onApplyFilters,
  onPageChange,
}: ProductCatalogControlsProps) {
  return (
    <div className="mb-8 space-y-4 border border-(--gold)/20 bg-white/50 p-4 md:p-5">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-[10px] uppercase tracking-[0.18em] text-(--sage)">
          Trier
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ProductSort)}
            className="min-w-40 border border-(--forest)/15 bg-white px-3 py-2 text-sm text-(--forest)"
          >
            <option value="name-asc">Nom A → Z</option>
            <option value="name-desc">Nom Z → A</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="newest">Nouveautés</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-[10px] uppercase tracking-[0.18em] text-(--sage)">
          Prix min (MAD)
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="w-28 border border-(--forest)/15 bg-white px-3 py-2 text-sm text-(--forest)"
          />
        </label>

        <label className="flex flex-col gap-1 text-[10px] uppercase tracking-[0.18em] text-(--sage)">
          Prix max (MAD)
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="w-28 border border-(--forest)/15 bg-white px-3 py-2 text-sm text-(--forest)"
          />
        </label>

        <button
          type="button"
          onClick={onApplyFilters}
          className="border border-(--forest)/20 px-5 py-2 text-[10px] uppercase tracking-[0.22em] text-(--forest) hover:border-(--forest) hover:bg-(--forest) hover:text-(--gold)"
        >
          Appliquer
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-(--sage)">
        <span>{total} produit{total > 1 ? "s" : ""}</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 0}
              onClick={() => onPageChange(page - 1)}
              className="border border-(--forest)/15 px-3 py-1.5 text-xs disabled:opacity-40"
            >
              Précédent
            </button>
            <span className="text-xs">
              Page {page + 1} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => onPageChange(page + 1)}
              className="border border-(--forest)/15 px-3 py-1.5 text-xs disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
