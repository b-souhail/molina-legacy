"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Heart, Share2, ShoppingCart, Check } from "lucide-react";

import { useCart } from "@/lib/cart-context";
import { resolveProductImageUrl } from "@/lib/image-url";
import { fetchProductBySlug, type Product } from "@/lib/products-api";

export default function ProductPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Produit introuvable");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProductBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setError("Produit introuvable");
          setProduct(null);
        } else {
          setProduct(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Impossible de charger le produit");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
      },
      quantity
    );
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    openCart();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-(--cream) flex items-center justify-center">
        <p className="text-sm uppercase tracking-[0.2em] text-(--sage)">
          Chargement…
        </p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-(--cream) flex flex-col items-center justify-center gap-4">
        <p className="text-(--forest)">{error ?? "Produit introuvable"}</p>
        <Link
          href="/collections"
          className="text-xs uppercase tracking-[0.2em] text-(--gold) hover:underline"
        >
          Retour aux collections
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-(--cream)">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-(--sage)">
          <Link href="/" className="hover:text-(--gold) transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-(--gold) transition-colors">
            Collections
          </Link>
          <span>/</span>
          <span className="text-(--forest) font-medium">{product.name}</span>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="relative aspect-square rounded-[2px] overflow-hidden border border-(--gold)/30">
            <Image
              src={resolveProductImageUrl(product.imageUrl)}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-heading text-(--forest) mb-4 tracking-tight">
                {product.name}
              </h1>
              <span className="text-3xl md:text-4xl font-heading text-(--gold) tracking-tight">
                {Number(product.price).toFixed(0)} MAD
              </span>
              <div className="h-px bg-gradient-to-r from-[var(--gold)] to-transparent opacity-30 my-6" />
            </div>

            {product.description && (
              <p className="text-base leading-relaxed text-(--forest)/80">
                {product.description}
              </p>
            )}

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-(--forest) font-bold mb-4">
                Quantité
              </label>
              <div className="flex items-center border border-(--gold)/30 rounded-[2px] w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-(--forest) hover:bg-(--gold)/10 transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  className="w-16 text-center bg-transparent outline-none text-(--forest) font-medium border-l border-r border-(--gold)/30"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-(--forest) hover:bg-(--gold)/10 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleBuyNow}
                className="group relative w-full h-14 overflow-hidden rounded-[2px]"
              >
                <div className="absolute inset-0 border-2 border-(--gold)" />
                <div className="absolute inset-0 bg-(--gold) transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <span className="relative flex items-center justify-center h-full text-sm uppercase tracking-[0.2em] text-(--gold) group-hover:text-(--forest) transition-colors duration-500 font-bold">
                  Acheter Maintenant
                </span>
              </button>

              <button
                onClick={handleAddToCart}
                className="group relative w-full h-14 overflow-hidden rounded-[2px]"
              >
                <div className="absolute inset-0 border border-(--gold)/50 group-hover:border-(--gold) transition-colors" />
                <div className="absolute inset-0 bg-(--gold)/5 group-hover:bg-(--gold)/10 transition-colors" />
                <span className="relative flex items-center justify-center gap-2 h-full text-sm uppercase tracking-[0.2em] text-(--forest) font-bold">
                  {isAddedToCart ? (
                    <>
                      <Check size={18} className="text-(--gold)" />
                      Ajouté au panier
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Ajouter au panier
                    </>
                  )}
                </span>
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className="flex-1 flex items-center justify-center gap-2 h-12 border border-(--gold)/30 rounded-[2px] hover:border-(--gold) hover:bg-(--gold)/5 transition-all duration-300 group"
              >
                <Heart
                  size={18}
                  className={`transition-colors ${
                    isFavorited
                      ? "fill-(--gold) text-(--gold)"
                      : "text-(--forest) group-hover:text-(--gold)"
                  }`}
                />
                <span className="text-xs uppercase tracking-[0.1em] text-(--forest) group-hover:text-(--gold) transition-colors">
                  Favoris
                </span>
              </button>

              <button className="flex-1 flex items-center justify-center gap-2 h-12 border border-(--gold)/30 rounded-[2px] hover:border-(--gold) hover:bg-(--gold)/5 transition-all duration-300 group">
                <Share2
                  size={18}
                  className="text-(--forest) group-hover:text-(--gold) transition-colors"
                />
                <span className="text-xs uppercase tracking-[0.1em] text-(--forest) group-hover:text-(--gold) transition-colors">
                  Partager
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
