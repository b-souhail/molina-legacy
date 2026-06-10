"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, X } from "lucide-react";

import { resolveProductImageUrl } from "@/lib/image-url";
import { productPath } from "@/lib/product-path";
import { useWishlist } from "@/lib/wishlist-context";

export default function FavoritesPage() {
  const { items, removeItem } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Heart size={32} className="text-(--gold)" strokeWidth={1.2} />
        <p className="font-heading text-xl text-(--forest)">Aucun favori</p>
        <p className="max-w-sm text-sm text-(--sage)">
          Enregistrez les pièces qui vous inspirent pour les retrouver ici.
        </p>
        <Link
          href="/collections"
          className="mt-2 border border-(--forest)/20 px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-(--forest) hover:border-(--forest)"
        >
          Explorer les collections
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl text-(--forest)">Mes favoris</h2>
        <p className="mt-2 text-sm text-(--sage)">
          {items.length} pièce{items.length > 1 ? "s" : ""} enregistrée
          {items.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.productId}
            className="flex gap-4 border border-(--gold)/20 bg-white p-4"
          >
            <Link
              href={productPath(item.slug)}
              className="relative h-28 w-24 shrink-0 overflow-hidden border border-(--gold)/15"
            >
              <Image
                src={resolveProductImageUrl(item.imageUrl)}
                alt={item.name}
                fill
                className="object-cover"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <Link
                  href={productPath(item.slug)}
                  className="font-heading text-base text-(--forest) hover:text-(--gold)"
                >
                  {item.name}
                </Link>
                <p className="mt-1 font-heading text-lg text-(--gold)">
                  {item.price.toFixed(0)} MAD
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={productPath(item.slug)}
                  className="text-[10px] uppercase tracking-[0.22em] text-(--forest) hover:text-(--gold)"
                >
                  Voir le produit
                </Link>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-(--sage) hover:text-red-600"
                >
                  <X size={12} />
                  Retirer
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
