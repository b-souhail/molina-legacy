"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { AdminProductForm } from "@/app/components/inner/AdminProductForm";
import {
  fetchAdminCategories,
  fetchAdminProductById,
  updateAdminProduct,
  type AdminCategory,
  type AdminProduct,
  type ProductPayload,
} from "@/lib/admin-catalog-api";

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId || Number.isNaN(productId)) {
      setError("Produit invalide");
      setLoading(false);
      return;
    }

    Promise.all([
      fetchAdminProductById(productId),
      fetchAdminCategories(),
    ])
      .then(([productData, categoriesData]) => {
        if (!productData) {
          setError("Produit introuvable");
          return;
        }
        setProduct(productData);
        setCategories(categoriesData);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur de chargement")
      )
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (payload: ProductPayload) => {
    if (!product) return;
    await updateAdminProduct(product.id, payload);
    router.push(`/admin/produits/${product.id}`);
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
        href={`/admin/produits/${product.id}`}
        className="inline-flex items-center gap-2 text-sm text-(--sage) hover:text-(--forest)"
      >
        <ArrowLeft size={16} />
        Retour au produit
      </Link>

      <div>
        <h1 className="font-heading text-3xl text-(--forest)">
          Modifier le produit
        </h1>
        <p className="mt-1 text-sm text-(--sage)">{product.name}</p>
      </div>

      <AdminProductForm
        categories={categories}
        initialValues={{
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          price: Number(product.price),
          images:
            product.images && product.images.length > 0
              ? product.images
              : product.imageUrl
                ? [{ url: product.imageUrl, principal: true, sortOrder: 0 }]
                : [],
          options: product.options ?? [],
          categoryId: product.categoryId ?? categories[0]?.id ?? 0,
        }}
        submitLabel="Enregistrer"
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/admin/produits/${product.id}`)}
      />
    </div>
  );
}
