"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import {
  deleteAdminProduct,
  fetchAdminProductById,
  type AdminProduct,
} from "@/lib/admin-catalog-api";
import { resolveProductImageUrl } from "@/lib/image-url";

export default function AdminProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId || Number.isNaN(productId)) {
      setError("Produit invalide");
      setLoading(false);
      return;
    }

    fetchAdminProductById(productId)
      .then((data) => {
        if (!data) {
          setError("Produit introuvable");
          return;
        }
        setProduct(data);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur de chargement")
      )
      .finally(() => setLoading(false));
  }, [productId]);

  const handleDelete = async () => {
    if (!product || !confirm("Supprimer ce produit ?")) return;
    try {
      await deleteAdminProduct(product.id);
      router.push("/admin/produits");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (loading) {
    return <p className="text-sm text-(--sage)">Chargement…</p>;
  }

  if (error || !product) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/produits"
          className="inline-flex items-center gap-2 text-sm text-(--sage) hover:text-(--forest)"
        >
          <ArrowLeft size={16} />
          Retour aux produits
        </Link>
        <p className="text-sm text-red-600">{error ?? "Produit introuvable"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/produits"
        className="inline-flex items-center gap-2 text-sm text-(--sage) hover:text-(--forest)"
      >
        <ArrowLeft size={16} />
        Retour aux produits
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-(--sage)">
            Produit #{product.id}
          </p>
          <h1 className="mt-2 font-heading text-3xl text-(--forest)">
            {product.name}
          </h1>
          <p className="mt-1 text-sm text-(--sage)">{product.slug}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/produits/${product.id}/edit`}
            className="inline-flex items-center gap-2 border border-(--forest)/20 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-(--forest) hover:border-(--forest)"
          >
            <Pencil size={14} />
            Modifier
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 border border-red-200 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-red-600 hover:bg-red-50"
          >
            <Trash2 size={14} />
            Supprimer
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden border border-(--gold)/20 bg-white">
            {product.imageUrl ? (
              <Image
                src={resolveProductImageUrl(product.imageUrl)}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-(--sage)">
                Aucune image
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={`${image.url}-${index}`}
                  className="relative aspect-square overflow-hidden border border-(--gold)/15"
                >
                  <Image
                    src={resolveProductImageUrl(image.url)}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 rounded-lg border border-(--gold)/20 bg-white p-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
              Prix
            </p>
            <p className="mt-1 font-heading text-3xl text-(--gold)">
              {Number(product.price).toFixed(0)} MAD
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
              Catégorie
            </p>
            <p className="mt-1 text-sm text-(--forest)">
              {product.categoryName ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
              Description
            </p>
            <p className="mt-1 text-sm leading-relaxed text-(--forest)/80">
              {product.description || "Aucune description"}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
              Options
            </p>
            {product.options && product.options.length > 0 ? (
              <ul className="mt-2 space-y-2 text-sm text-(--forest)">
                {product.options.map((option) => (
                  <li
                    key={option.id ?? `${option.name}-${option.value}`}
                    className="flex items-center justify-between gap-3 border border-(--forest)/10 px-3 py-2"
                  >
                    <span>
                      {option.name}: {option.value}
                    </span>
                    <span className="text-(--sage)">
                      {Number(option.priceAdjustment ?? 0) >= 0 ? "+" : ""}
                      {Number(option.priceAdjustment ?? 0).toFixed(0)} MAD
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-(--sage)">Aucune option</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 border-t border-(--gold)/15 pt-4">
            <Link
              href={`/product/${product.slug}`}
              className="text-xs uppercase tracking-[0.18em] text-(--forest) hover:text-(--gold)"
            >
              Voir sur le site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
