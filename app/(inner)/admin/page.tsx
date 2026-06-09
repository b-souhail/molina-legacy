"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Package, ShoppingBag, TrendingUp } from "lucide-react";

import { fetchOrders, type OrderResponse } from "@/lib/orders-api";
import { fetchProducts } from "@/lib/products-api";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
  }).format(n);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchOrders(), fetchProducts()])
      .then(([ordersData, products]) => {
        setOrders(ordersData);
        setProductCount(products.length);
      })
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Erreur de chargement"
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const pending = orders.filter((order) => order.status === "PENDING").length;
    const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    return {
      totalOrders: orders.length,
      pending,
      revenue,
      recentOrders: orders.slice(0, 5),
    };
  }, [orders]);

  if (loading) {
    return <div className="text-sm text-(--sage)">Chargement du tableau de bord…</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.35em] text-(--sage)">
          Administration
        </p>
        <h1 className="mt-2 font-heading text-3xl text-(--forest)">
          Tableau de bord
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-(--gold)/20 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
              Commandes
            </p>
            <ShoppingBag size={18} className="text-(--gold)" />
          </div>
          <p className="mt-4 font-heading text-4xl text-(--forest)">
            {stats.totalOrders}
          </p>
          <p className="mt-2 text-sm text-(--sage)">
            {stats.pending} en attente
          </p>
        </div>

        <div className="rounded-lg border border-(--gold)/20 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
              Chiffre d&apos;affaires
            </p>
            <TrendingUp size={18} className="text-(--gold)" />
          </div>
          <p className="mt-4 font-heading text-3xl text-(--forest)">
            {formatPrice(stats.revenue)}
          </p>
          <p className="mt-2 text-sm text-(--sage)">Toutes commandes</p>
        </div>

        <div className="rounded-lg border border-(--gold)/20 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
              Produits
            </p>
            <Package size={18} className="text-(--gold)" />
          </div>
          <p className="mt-4 font-heading text-4xl text-(--forest)">
            {productCount}
          </p>
          <p className="mt-2 text-sm text-(--sage)">Catalogue actif</p>
        </div>
      </div>

      <section className="rounded-lg border border-(--gold)/20 bg-white">
        <div className="flex items-center justify-between border-b border-(--gold)/15 px-6 py-4">
          <h2 className="font-heading text-xl text-(--forest)">
            Commandes récentes
          </h2>
          <Link
            href="/admin/commandes"
            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.22em] text-(--sage) hover:text-(--forest)"
          >
            Voir tout
            <ArrowRight size={12} />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="px-6 py-10 text-sm text-(--sage)">
            Aucune commande pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-(--cream) text-left text-(--sage)">
                <tr>
                  <th className="px-6 py-3 font-medium">#</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Statut</th>
                  <th className="px-6 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--gold)/10">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 font-medium text-(--forest)">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-(--sage)">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-(--sage)">
                      {order.customerEmail ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-(--forest)">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
