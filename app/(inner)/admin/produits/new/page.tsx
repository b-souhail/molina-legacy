"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { AdminProductForm } from "@/app/components/inner/AdminProductForm";
import {
  createAdminProduct,
  fetchAdminCategories,
  type AdminCategory,
  type ProductPayload,
} from "@/lib/admin-catalog-api";

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminCategories()
      .then(setCategories)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur de chargement")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (payload: ProductPayload) => {
    const product = await createAdminProduct(payload);
    router.push(`/admin/produits/${product.id}`);
  };

  if (loading) {
    return <p className="text-sm text-(--sage)">Chargement…</p>;
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

      <div>
        <h1 className="font-heading text-3xl text-(--forest)">Nouveau produit</h1>
        <p className="mt-1 text-sm text-(--sage)">
          Ajoutez une nouvelle pièce au catalogue.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <AdminProductForm
        categories={categories}
        initialValues={{
          name: "",
          slug: "",
          description: "",
          price: 0,
          imageUrl: "",
          categoryId: categories[0]?.id ?? 0,
        }}
        submitLabel="Créer le produit"
        onSubmit={handleSubmit}
        onCancel={() => router.push("/admin/produits")}
      />
    </div>
  );
}
