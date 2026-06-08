"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { fetchProducts, type Product } from "@/lib/products-api";

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex flex-col bg-(--cream) transition-all duration-500">
      <span className="absolute left-0 top-0 z-10 h-3 w-3 border-l border-t border-(--gold)/40 transition-all duration-300 group-hover:h-5 group-hover:w-5 group-hover:border-(--gold)" />
      <span className="absolute right-0 top-0 z-10 h-3 w-3 border-r border-t border-(--gold)/40 transition-all duration-300 group-hover:h-5 group-hover:w-5 group-hover:border-(--gold)" />
      <span className="absolute bottom-0 left-0 z-10 h-3 w-3 border-b border-l border-(--gold)/40 transition-all duration-300 group-hover:h-5 group-hover:w-5 group-hover:border-(--gold)" />
      <span className="absolute bottom-0 right-0 z-10 h-3 w-3 border-b border-r border-(--gold)/40 transition-all duration-300 group-hover:h-5 group-hover:w-5 group-hover:border-(--gold)" />

      <Link href="/product" className="relative block aspect-[3/4] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-(--forest)/35 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
          <p className="text-[9px] uppercase tracking-[0.22em] text-(--cream)/90">
            {Number(product.price).toFixed(0)} €
          </p>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-(--cream)/30 bg-(--cream)/10 text-(--cream) opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight size={14} strokeWidth={1.5} />
          </span>
        </div>
      </Link>

      <div className="flex flex-col gap-3 border border-t-0 border-(--gold)/15 px-4 py-5 transition-colors duration-300 group-hover:border-(--gold)/35">
        <div>
          <p className="font-heading text-sm leading-snug text-(--forest) md:text-[15px]">
            {product.name}
          </p>
          {product.description && (
            <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed tracking-[0.04em] text-(--sage)">
              {product.description}
            </p>
          )}
        </div>

        <div className="h-px w-full bg-linear-to-r from-transparent via-(--gold)/30 to-transparent" />

        <Link
          href="/product"
          className="
            text-center
            py-2.5
            text-[9px]
            uppercase
            tracking-[0.32em]
            text-(--forest)
            border
            border-(--forest)/20
            transition-all
            duration-300
            hover:border-(--forest)
            hover:bg-(--forest)
            hover:text-(--gold)
          "
        >
          Découvrir
        </Link>
      </div>
    </article>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse bg-(--cream)">
      <div className="aspect-[3/4] bg-(--forest)/5" />
      <div className="space-y-3 border border-t-0 border-(--gold)/10 p-4">
        <div className="h-4 w-3/4 bg-(--forest)/5" />
        <div className="h-3 w-full bg-(--forest)/5" />
        <div className="h-9 w-full bg-(--forest)/5" />
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative overflow-hidden bg-(--cream) py-24 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,154,90,0.08),transparent_55%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--gold)/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-16 flex flex-col items-center text-center">
          <p className="mb-3 text-[9px] uppercase tracking-[0.55em] text-(--sage)">
            Collection
          </p>
          <h2 className="font-heading text-3xl text-(--forest) md:text-[2.75rem] md:leading-tight">
            Pièces d&apos;Exception
          </h2>
          <div className="mt-5 flex items-center gap-3">
            <div className="h-px w-10 bg-(--gold)/50" />
            <div className="h-1.5 w-1.5 rotate-45 border border-(--gold)" />
            <div className="h-px w-10 bg-(--gold)/50" />
          </div>
          <p className="mt-5 max-w-xl text-[11px] leading-relaxed tracking-[0.08em] text-(--sage)">
            Une sélection de créations raffinées, pensées pour honorer chaque
            profession avec élégance et distinction.
          </p>
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
              href="/product"
              className="
                inline-flex
                items-center
                gap-2
                border
                border-(--forest)/25
                px-8
                py-3.5
                text-[10px]
                uppercase
                tracking-[0.35em]
                text-(--forest)
                transition-all
                duration-300
                hover:border-(--forest)
                hover:bg-(--forest)
                hover:text-(--gold)
              "
            >
              Voir toute la collection
              <ArrowUpRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--gold)/40 to-transparent" />
    </section>
  );
}
