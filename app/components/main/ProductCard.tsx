"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Heart, ShoppingCart } from "lucide-react";

import { ProductQuickAddModal } from "@/app/components/main/ProductQuickAddModal";
import { useCart } from "@/lib/cart-context";
import { resolveProductImageUrl } from "@/lib/image-url";
import { productPath } from "@/lib/product-path";
import { groupProductOptions } from "@/lib/product-options";
import { fetchProductBySlug, type Product } from "@/lib/products-api";
import { useWishlist } from "@/lib/wishlist-context";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isWishlisted, toggleItem } = useWishlist();
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const favorited = isWishlisted(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (adding) return;

    setAdding(true);
    try {
      const details = await fetchProductBySlug(product.slug);
      if (!details) {
        return;
      }

      const optionGroups = groupProductOptions(details.options ?? []);
      if (optionGroups.length > 0) {
        setQuickAddProduct(details);
        return;
      }

      addItem({
        productId: details.id,
        slug: details.slug,
        name: details.name,
        price: Number(details.price),
        imageUrl: details.imageUrl,
      });
    } finally {
      setAdding(false);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
    });
  };

  const href = productPath(product.slug);

  return (
    <>
      <article className="group relative flex flex-col bg-(--cream) transition-all duration-500">
        <span className="absolute left-0 top-0 z-10 h-3 w-3 border-l border-t border-(--gold)/40 transition-all duration-300 group-hover:h-5 group-hover:w-5 group-hover:border-(--gold)" />
        <span className="absolute right-0 top-0 z-10 h-3 w-3 border-r border-t border-(--gold)/40 transition-all duration-300 group-hover:h-5 group-hover:w-5 group-hover:border-(--gold)" />
        <span className="absolute bottom-0 left-0 z-10 h-3 w-3 border-b border-l border-(--gold)/40 transition-all duration-300 group-hover:h-5 group-hover:w-5 group-hover:border-(--gold)" />
        <span className="absolute bottom-0 right-0 z-10 h-3 w-3 border-b border-r border-(--gold)/40 transition-all duration-300 group-hover:h-5 group-hover:w-5 group-hover:border-(--gold)" />

        <Link href={href} className="relative block aspect-[3/4] overflow-hidden">
          <Image
            src={resolveProductImageUrl(product.imageUrl)}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-(--forest)/35 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

          <button
            type="button"
            onClick={handleToggleFavorite}
            className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center border border-(--cream)/30 bg-(--cream)/10 text-(--cream) backdrop-blur-sm transition-colors hover:border-(--gold) hover:text-(--gold)"
            aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart
              size={14}
              className={favorited ? "fill-(--gold) text-(--gold)" : undefined}
            />
          </button>

          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-end p-4">
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
            <div className="mt-2 flex items-start justify-between gap-3">
              {product.description ? (
                <p className="line-clamp-2 flex-1 text-[10px] leading-relaxed tracking-[0.04em] text-(--sage)">
                  {product.description}
                </p>
              ) : (
                <span className="flex-1" />
              )}
              <p className="shrink-0 font-heading text-lg leading-none text-(--gold) md:text-xl">
                {Number(product.price).toFixed(0)} MAD
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-linear-to-r from-transparent via-(--gold)/30 to-transparent" />

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={href}
              className="text-center py-2.5 text-[9px] uppercase tracking-[0.32em] text-(--forest) border border-(--forest)/20 transition-all duration-300 hover:border-(--forest) hover:bg-(--forest) hover:text-(--gold)"
            >
              Découvrir
            </Link>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding}
              className="flex items-center justify-center gap-1.5 py-2.5 text-[9px] uppercase tracking-[0.22em] text-(--forest) border border-(--gold)/40 transition-all duration-300 hover:border-(--gold) hover:bg-(--gold)/10 disabled:opacity-60"
            >
              <ShoppingCart size={12} />
              {adding ? "…" : "Panier"}
            </button>
          </div>
        </div>
      </article>

      {quickAddProduct && (
        <ProductQuickAddModal
          product={quickAddProduct}
          onClose={() => setQuickAddProduct(null)}
        />
      )}
    </>
  );
}

export function ProductSkeleton() {
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
