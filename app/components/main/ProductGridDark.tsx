// components/ProductGridDark.tsx
"use client";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  slug: string;
};

function GoldDivider() {
  return (
    <div className="my-1 flex items-center gap-3">
      <div className="h-px flex-1 bg-[rgba(184,154,90,0.25)]" />
      <div className="h-[5px] w-[5px] rotate-45 border border-[rgba(184,154,90,0.5)]" />
      <div className="h-px flex-1 bg-[rgba(184,154,90,0.25)]" />
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col border border-(--gold)/20 bg-(--deep) transition-all duration-500 hover:border-(--gold)/50">
      {/* Corners */}
      <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-(--gold) transition-all duration-300 group-hover:h-6 group-hover:w-6" />
      <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-(--gold) transition-all duration-300 group-hover:h-6 group-hover:w-6" />
      <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-(--gold) transition-all duration-300 group-hover:h-6 group-hover:w-6" />
      <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-(--gold) transition-all duration-300 group-hover:h-6 group-hover:w-6" />

      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-(--forest)">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-(--deep)/20" />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 p-4">
        <div>
          <p className="font-heading text-base text-(--cream) leading-snug">
            {product.name}
          </p>
          <GoldDivider />
          <p className="text-xs tracking-[0.25em] text-(--gold)">
            {product.price.toFixed(2)} €
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => console.log("add to cart", product.id)}
            className="w-full border border-(--gold)/40 py-2.5 text-[9px] uppercase tracking-[0.35em] text-(--gold) transition-all duration-300 hover:border-(--gold) hover:bg-(--gold)/10 hover:text-(--cream)"
          >
            Ajouter au panier
          </button>
          <Link
            href={`/checkout?product=${product.slug}`}
            className="w-full bg-(--gold) py-2.5 text-center text-[9px] uppercase tracking-[0.35em] text-(--deep) font-medium transition-all duration-300 hover:bg-(--cream)"
          >
            Acheter maintenant
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProductGridDark({ products }: { products: Product[] }) {
  return (
    <section className="relative overflow-hidden bg-(--deep) py-20">
      {/* Diamond pattern */}
      <svg className="pointer-events-none absolute inset-0 opacity-[0.04]" width="100%" height="100%">
        <defs>
          <pattern id="diamonds-dark" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 4 L36 20 L20 36 L4 20 Z" stroke="#B89A5A" strokeWidth="0.8" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diamonds-dark)" />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-[9px] uppercase tracking-[0.5em] text-(--gold)/60">
            Collection
          </p>
          <h2 className="font-heading text-3xl text-(--cream) md:text-4xl">
            Nos Pièces
          </h2>
          <div className="mx-auto mt-5 flex max-w-xs items-center gap-3">
            <div className="h-px flex-1 bg-(--gold)/25" />
            <div className="h-[6px] w-[6px] rotate-45 border border-(--gold)/50" />
            <div className="h-px flex-1 bg-(--gold)/25" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}