"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Share2, ShoppingCart, Check } from "lucide-react";

import { useCart } from "@/lib/cart-context";
import { shareProduct } from "@/lib/share-product";
import { useWishlist } from "@/lib/wishlist-context";
import { resolveProductImageUrl } from "@/lib/image-url";
import {
  buildVariantLabel,
  computeAdjustedPrice,
  groupProductOptions,
} from "@/lib/product-options";
import { fetchProductBySlug, type Product, type ProductImage } from "@/lib/products-api";

export default function ProductPageContent({ slug }: { slug: string }) {
  const { addItem, openCart } = useCart();
  const { isWishlisted, toggleItem } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [selectedOptionIds, setSelectedOptionIds] = useState<number[]>([]);
  const [optionError, setOptionError] = useState<string | null>(null);

  const displayImages = useMemo<ProductImage[]>(() => {
    if (!product) {
      return [];
    }
    if (product.images && product.images.length > 0) {
      return [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return [
      {
        url: product.imageUrl,
        principal: true,
        sortOrder: 0,
      },
    ];
  }, [product]);

  const optionGroups = useMemo(
    () => groupProductOptions(product?.options ?? []),
    [product]
  );

  const displayPrice = useMemo(() => {
    if (!product) return 0;
    return computeAdjustedPrice(
      product.price,
      product.options ?? [],
      selectedOptionIds
    );
  }, [product, selectedOptionIds]);

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

  useEffect(() => {
    if (!product) {
      setActiveImageUrl(null);
      setSelectedOptionIds([]);
      return;
    }

    const principal =
      displayImages.find((image) => image.principal)?.url ??
      displayImages[0]?.url ??
      product.imageUrl;
    setActiveImageUrl(principal);

    const defaults = groupProductOptions(product.options ?? [])
      .map((group) => group.choices[0]?.id)
      .filter((id): id is number => id != null);
    setSelectedOptionIds(defaults);
    setOptionError(null);
  }, [product, displayImages]);

  const selectOption = (groupName: string, optionId: number) => {
    const group = optionGroups.find((entry) => entry.name === groupName);
    if (!group) return;

    const groupOptionIds = group.choices.map((choice) => choice.id);
    setSelectedOptionIds((current) => [
      ...current.filter((id) => !groupOptionIds.includes(id)),
      optionId,
    ]);
    setOptionError(null);
  };

  const validateOptions = () => {
    for (const group of optionGroups) {
      const hasSelection = group.choices.some((choice) =>
        selectedOptionIds.includes(choice.id)
      );
      if (!hasSelection) {
        setOptionError(`Choisissez une option : ${group.name}`);
        return false;
      }
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!product || !validateOptions()) return;

    const allOptions = product.options ?? [];
    const variant = buildVariantLabel(allOptions, selectedOptionIds);

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: displayPrice,
        imageUrl: activeImageUrl ?? product.imageUrl,
        variant: variant || undefined,
        selectedOptionIds:
          selectedOptionIds.length > 0 ? selectedOptionIds : undefined,
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

  const handleToggleFavorite = () => {
    if (!product) return;
    toggleItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: displayPrice,
      imageUrl: activeImageUrl ?? product.imageUrl,
    });
  };

  const handleShare = async () => {
    if (!product) return;
    try {
      const result = await shareProduct({
        title: product.name,
        slug: product.slug,
        text: product.description,
      });
      setShareMessage(
        result === "shared" ? "Produit partagé" : "Lien copié dans le presse-papiers"
      );
      setTimeout(() => setShareMessage(null), 2500);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setShareMessage("Partage impossible");
      setTimeout(() => setShareMessage(null), 2500);
    }
  };

  const isFavorited = product ? isWishlisted(product.id) : false;

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
          <div className="space-y-4">
            <div className="relative aspect-square rounded-[2px] overflow-hidden border border-(--gold)/30">
              <Image
                src={resolveProductImageUrl(activeImageUrl ?? product.imageUrl)}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
            </div>
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {displayImages.map((image, index) => (
                  <button
                    key={`${image.url}-${index}`}
                    type="button"
                    onClick={() => setActiveImageUrl(image.url)}
                    className={`relative aspect-square overflow-hidden border transition-colors ${
                      activeImageUrl === image.url
                        ? "border-(--gold)"
                        : "border-(--gold)/20 hover:border-(--gold)/50"
                    }`}
                  >
                    <Image
                      src={resolveProductImageUrl(image.url)}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-heading text-(--forest) mb-4 tracking-tight">
                {product.name}
              </h1>
              <span className="text-3xl md:text-4xl font-heading text-(--gold) tracking-tight">
                {displayPrice.toFixed(0)} MAD
              </span>
              {displayPrice !== Number(product.price) && (
                <p className="mt-2 text-sm text-(--sage)">
                  Prix de base : {Number(product.price).toFixed(0)} MAD
                </p>
              )}
              <div className="h-px bg-gradient-to-r from-[var(--gold)] to-transparent opacity-30 my-6" />
            </div>

            {product.description && (
              <p className="text-base leading-relaxed text-(--forest)/80">
                {product.description}
              </p>
            )}

            {optionGroups.length > 0 && (
              <div className="space-y-5">
                {optionGroups.map((group) => (
                  <div key={group.name}>
                    <label className="block text-xs uppercase tracking-[0.2em] text-(--forest) font-bold mb-3">
                      {group.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {group.choices.map((choice) => {
                        const selected = selectedOptionIds.includes(choice.id);
                        const adjustment = Number(choice.priceAdjustment ?? 0);
                        return (
                          <button
                            key={choice.id}
                            type="button"
                            onClick={() => selectOption(group.name, choice.id)}
                            className={`border px-4 py-2 text-sm transition-colors ${
                              selected
                                ? "border-(--gold) bg-(--gold)/10 text-(--forest)"
                                : "border-(--gold)/25 text-(--forest)/80 hover:border-(--gold)"
                            }`}
                          >
                            {choice.value}
                            {adjustment !== 0 && (
                              <span className="ml-2 text-xs text-(--sage)">
                                {adjustment > 0 ? "+" : ""}
                                {adjustment.toFixed(0)} MAD
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {optionError && (
                  <p className="text-sm text-red-600">{optionError}</p>
                )}
              </div>
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

            <div className="space-y-3">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleToggleFavorite}
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
                    {isFavorited ? "Dans les favoris" : "Favoris"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 h-12 border border-(--gold)/30 rounded-[2px] hover:border-(--gold) hover:bg-(--gold)/5 transition-all duration-300 group"
                >
                  <Share2
                    size={18}
                    className="text-(--forest) group-hover:text-(--gold) transition-colors"
                  />
                  <span className="text-xs uppercase tracking-[0.1em] text-(--forest) group-hover:text-(--gold) transition-colors">
                    Partager
                  </span>
                </button>
              </div>
              {shareMessage && (
                <p className="text-center text-xs text-(--sage)">{shareMessage}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
