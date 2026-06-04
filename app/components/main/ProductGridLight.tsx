// components/ProductGridLight.tsx
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

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col bg-(--cream) transition-all duration-500">
      {/* Top gold bar */}
      <div className="h-[2px] w-full bg-(--gold)/30 transition-all duration-500 group-hover:bg-(--gold)" />

      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-(--forest)/0 transition-all duration-500 group-hover:bg-(--forest)/10" />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-4 border border-t-0 border-(--gold)/20 p-4 transition-all duration-300 group-hover:border-(--gold)/40">
        <div>
          <p className="font-heading text-sm leading-snug text-(--forest) md:text-base">
            {product.name}
          </p>
          <p className="mt-1.5 text-[10px] tracking-[0.2em] text-(--sage)">
            {product.price.toFixed(2)} €
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => console.log("add to cart", product.id)}
            className="relative w-full overflow-hidden border border-(--forest)/30 py-2.5 text-[9px] uppercase tracking-[0.35em] text-(--forest) transition-all duration-300 hover:border-(--forest) hover:bg-(--forest) hover:text-(--cream)"
          >
            Ajouter au panier
          </button>
          <Link
            href={`/checkout?product=${product.slug}`}
            className="w-full bg-(--forest) py-2.5 text-center text-[9px] uppercase tracking-[0.35em] text-(--gold) transition-all duration-300 hover:bg-(--deep)"
          >
            Acheter maintenant
          </Link>
        </div>
      </div>

      {/* Bottom gold bar */}
      <div className="h-[2px] w-0 bg-(--gold) transition-all duration-500 group-hover:w-full" />
    </div>
  );
}

export default function ProductGridLight({ products }: { products: Product[] }) {
  return (
    <section className="relative bg-(--cream) py-20">
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[rgba(184,154,90,0.3)]" />

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-14 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[9px] uppercase tracking-[0.5em] text-(--sage)">
              Sélection
            </p>
            <h2 className="font-heading text-3xl text-(--forest) md:text-4xl">
              Nouveautés
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-(--gold)/40" />
            <p className="text-[9px] uppercase tracking-[0.3em] text-(--sage)">
              Heritage · Precision · Presence
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-[rgba(184,154,90,0.3)]" />
    </section>
  );
}