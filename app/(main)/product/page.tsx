"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Share2, ShoppingCart, Check } from "lucide-react";

interface ProductDetails {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  details: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  colors?: string[];
  sizes?: string[];
}
const PRODUCT: ProductDetails = {
  id: 1,
  name: "Pièce Exclusive Molina",
  price: 249.99,
  originalPrice: 349.99,
  image: "/image.png",
  description:
    "Une pièce d'exception qui incarne l'essence de Molina Legacy. Conçue avec précision et passion, cette création unique allie tradition et modernité pour une élégance intemporelle.",
  details: [
    "Matière premium de haute qualité",
    "Finitions minutieuses et détaillées",
    "Certification d'authenticité incluse",
    "Emballage luxe personnalisé",
    "Garantie 2 ans",
  ],
  inStock: true,
  rating: 4.8,
  reviews: 127,
  colors: ["Noir", "Blanc", "Or"],
  sizes: ["S", "M", "L", "XL"],
};

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(PRODUCT.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(PRODUCT.sizes?.[0] || "");
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleAddToCart = () => {
    // TODO: Connecter au backend pour ajouter au panier
    console.log({
      productId: PRODUCT.id,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    // TODO: Connecter au backend pour le paiement
    console.log({
      productId: PRODUCT.id,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
  };

  const discount = PRODUCT.originalPrice
    ? Math.round(
        ((PRODUCT.originalPrice - PRODUCT.price) / PRODUCT.originalPrice) * 100
      )
    : 0;

  return (
    <main className="min-h-screen bg-(--cream)">
      {/* Breadcrumb */}
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
          <span className="text-(--forest) font-medium">{PRODUCT.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <div className="flex flex-col gap-6">
            {/* Main Image */}
            <div className="relative aspect-square rounded-[2px] overflow-hidden border border-(--gold)/30 group">
              <Image
                src={PRODUCT.image}
                alt={PRODUCT.name}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-6 right-6 z-10">
                  <div className="relative border border-(--gold) bg-(--cream) px-4 py-2 rounded-[2px]">
                    <span className="text-sm font-bold text-(--gold) tracking-wide">
                      -{discount}%
                    </span>
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="absolute bottom-6 left-6 z-10">
                <div className="flex items-center gap-2 bg-(--cream) px-4 py-2 rounded-[2px] border border-(--gold)/50">
                  <div className="w-2 h-2 rounded-full bg-(--gold)" />
                  <span className="text-xs uppercase tracking-[0.1em] text-(--forest) font-medium">
                    {PRODUCT.inStock ? "En stock" : "Rupture"}
                  </span>
                </div>
              </div>
            </div>

            {/* Image Gallery Placeholder */}
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-[2px] border border-(--gold)/20 overflow-hidden cursor-pointer hover:border-(--gold)/50 transition-colors"
                >
                  <Image
                    src={PRODUCT.image}
                    alt={`View ${i}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div>
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(PRODUCT.rating)
                          ? "text-(--gold)"
                          : "text-(--gold)/30"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs uppercase tracking-[0.1em] text-(--sage)">
                  {PRODUCT.rating} ({PRODUCT.reviews} avis)
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-heading text-(--forest) mb-4 tracking-tight">
                {PRODUCT.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl md:text-4xl font-heading text-(--gold) tracking-tight">
                  {PRODUCT.price.toFixed(2)} MAD
                </span>
                {PRODUCT.originalPrice && (
                  <span className="text-lg text-(--sage) line-through">
                    {PRODUCT.originalPrice.toFixed(2)} MAD
                  </span>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-[var(--gold)] to-transparent opacity-30 my-6" />
            </div>

            {/* Description */}
            <div>
              <p className="text-base leading-relaxed text-(--forest)/80 mb-6">
                {PRODUCT.description}
              </p>

              {/* Details List */}
              <ul className="space-y-3">
                {PRODUCT.details.map((detail, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-(--forest)/70"
                  >
                    <span className="text-(--gold) mt-1">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-[var(--gold)] to-transparent opacity-30" />

            {/* Options */}
            <div className="space-y-6">
              {/* Color Selection */}
              {PRODUCT.colors && PRODUCT.colors.length > 0 && (
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-(--forest) font-bold mb-4">
                    Couleur : {selectedColor}
                  </label>
                  <div className="flex gap-3">
                    {PRODUCT.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-[2px] text-xs uppercase tracking-[0.1em] font-medium transition-all duration-300 ${
                          selectedColor === color
                            ? "border-2 border-(--gold) bg-(--gold)/10 text-(--forest)"
                            : "border border-(--gold)/30 text-(--forest) hover:border-(--gold)/60"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {PRODUCT.sizes && PRODUCT.sizes.length > 0 && (
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-(--forest) font-bold mb-4">
                    Taille : {selectedSize}
                  </label>
                  <div className="flex gap-3">
                    {PRODUCT.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-[2px] text-sm font-bold transition-all duration-300 flex items-center justify-center ${
                          selectedSize === size
                            ? "border-2 border-(--gold) bg-(--gold)/10 text-(--forest)"
                            : "border border-(--gold)/30 text-(--forest) hover:border-(--gold)/60"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
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
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
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
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-[var(--gold)] to-transparent opacity-30" />

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={!PRODUCT.inStock}
                className="group relative w-full h-14 overflow-hidden rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Border */}
                <div className="absolute inset-0 border-2 border-(--gold)" />

                {/* Background */}
                <div className="absolute inset-0 bg-(--gold) transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                {/* Text */}
                <span className="relative flex items-center justify-center h-full text-sm uppercase tracking-[0.2em] text-(--gold) group-hover:text-(--forest) transition-colors duration-500 font-bold">
                  Acheter Maintenant
                </span>
              </button>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!PRODUCT.inStock}
                className="group relative w-full h-14 overflow-hidden rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Border */}
                <div className="absolute inset-0 border border-(--gold)/50 group-hover:border-(--gold) transition-colors" />

                {/* Background */}
                <div className="absolute inset-0 bg-(--gold)/5 group-hover:bg-(--gold)/10 transition-colors" />

                {/* Text */}
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

            {/* Secondary Actions */}
            <div className="flex gap-4">
              {/* Wishlist */}
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

              {/* Share */}
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

            {/* Info Box */}
            <div className="border border-(--gold)/20 rounded-[2px] p-6 bg-(--gold)/5">
              <div className="space-y-3 text-sm text-(--forest)/70">
                <p>
                  <span className="font-bold text-(--forest)">Livraison :</span> Gratuite
                  à partir de 500 MAD
                </p>
                <p>
                  <span className="font-bold text-(--forest)">Retour :</span> 30 jours
                  pour changer davis
                </p>
                <p>
                  <span className="font-bold text-(--forest)">Paiement :</span> Sécurisé
                  et crypté
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 border-t border-(--gold)/20">
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--gold)]" />
            <h2 className="text-xs uppercase tracking-[0.3em] text-(--gold) font-bold">
              Découvrez aussi
            </h2>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--gold)]" />
          </div>
          <h3 className="text-3xl md:text-4xl font-heading text-(--forest) text-center tracking-tight">
            Pièces Similaires
          </h3>
        </div>

        {/* Related Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Link key={i} href="/product">
              <div className="group cursor-pointer">
                <div className="relative aspect-square rounded-[2px] overflow-hidden border border-(--gold)/20 group-hover:border-(--gold)/50 transition-colors mb-4">
                  <Image
                    src="/molina-logo.png"
                    alt={`Produit ${i}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-sm font-heading text-(--forest) mb-2 group-hover:text-(--gold) transition-colors">
                  Pièce N°{i}
                </h4>
                <p className="text-sm text-(--gold) font-medium">
                  {(249.99 + i * 50).toFixed(2)} MAD
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
