"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Plus, Trash2 } from "lucide-react";

import {
  deleteAdminProduct,
  fetchAdminProducts,
  type AdminProduct,
} from "@/lib/admin-catalog-api";

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchAdminProducts()
      .then(setProducts)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur de chargement")
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      await deleteAdminProduct(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-(--forest)">Produits</h1>
          <p className="mt-1 text-sm text-(--sage)">
            Gérez le catalogue produits.
          </p>
        </div>
        <Link
          href="/admin/produits/new"
          className="inline-flex items-center gap-2 border border-(--gold) bg-(--gold) px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-black"
        >
          <Plus size={14} />
          Nouveau produit
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-(--gold)/20 bg-white">
        <table className="min-w-full text-sm">
          <thead className="border-b border-(--gold)/15 text-left text-(--sage)">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-(--sage)">
                  Chargement…
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-(--sage)">
                  Aucun produit
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-(--gold)/10">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/produits/${product.id}`}
                      className="font-medium text-(--forest) hover:text-(--gold)"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-(--sage)">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-(--sage)">
                    {product.categoryName ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {Number(product.price).toFixed(0)} MAD
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/produits/${product.id}`}
                        className="text-(--sage) hover:text-(--forest)"
                        aria-label="Voir le produit"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="text-(--sage) hover:text-red-600"
                        aria-label="Supprimer le produit"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
