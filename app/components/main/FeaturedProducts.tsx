"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import {
  ProductCard,
  ProductSkeleton,
} from "@/app/components/main/ProductCard";
import { fetchPopularProducts, type Product } from "@/lib/products-api";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPopularProducts()
      .then(setProducts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-(--cream)">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-3 text-[9px] uppercase tracking-[0.55em] text-(--sage)">
              Tendances
            </p>
            <h2 className="font-heading text-2xl text-(--forest)">
              Produits les Plus Populaires
            </h2>
          </div>
          {!loading && !error && products.length > 0 && (
            <p className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
              {products.length} pièce{products.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-[11px] uppercase tracking-[0.18em] text-(--sage)">
            {error}
          </p>
        ) : products.length === 0 ? (
          <p className="text-center text-[11px] uppercase tracking-[0.18em] text-(--sage)">
            Aucun produit disponible pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="mt-14 flex justify-center">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 border border-(--forest)/25 px-8 py-3.5 text-[10px] uppercase tracking-[0.35em] text-(--forest) transition-all duration-300 hover:border-(--forest) hover:bg-(--forest) hover:text-(--gold)"
            >
              Voir toute la collection
              <ArrowUpRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
