"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import {
  ProductCard,
  ProductSkeleton,
} from "@/app/components/main/ProductCard";
import { searchProducts, type Product } from "@/lib/products-api";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const [input, setInput] = useState(query);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInput(query);
  }, [query]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    searchProducts(query)
      .then(setResults)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur de recherche")
      )
      .finally(() => setLoading(false));
  }, [query]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = input.trim();
    if (!next) {
      router.push("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(next)}`);
  };

  return (
    <div className="min-h-screen bg-(--cream) px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.35em] text-(--sage)">
            Catalogue
          </p>
          <h1 className="mt-2 font-heading text-3xl text-(--forest) md:text-4xl">
            Recherche
          </h1>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex items-center gap-3 border border-(--gold) bg-white px-4 py-3">
              <Search size={16} strokeWidth={1.7} className="text-(--gold)" />
              <input
                type="search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Rechercher une pièce..."
                className="flex-1 bg-transparent text-sm tracking-[0.05em] text-(--forest) outline-none placeholder:text-(--sage)"
              />
              {input && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="text-(--sage) hover:text-(--forest)"
                  aria-label="Effacer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </form>
        </div>

        {!query && (
          <p className="text-sm text-(--sage)">
            Saisissez un nom ou une description pour trouver un produit.
          </p>
        )}

        {query && !loading && !error && (
          <p className="mb-8 text-sm text-(--sage)">
            {results.length === 0
              ? `Aucun résultat pour « ${query} ».`
              : `${results.length} résultat${results.length > 1 ? "s" : ""} pour « ${query} »`}
          </p>
        )}

        {error && <p className="mb-8 text-sm text-red-600">{error}</p>}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            : results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {query && !loading && results.length === 0 && !error && (
          <Link
            href="/"
            className="mt-10 inline-block text-sm text-(--sage) hover:text-(--forest)"
          >
            Retour à l&apos;accueil
          </Link>
        )}
      </div>
    </div>
  );
}
