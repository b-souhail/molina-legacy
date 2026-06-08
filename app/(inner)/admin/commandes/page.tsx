"use client";

import { useEffect, useState } from "react";

import { fetchOrders, type OrderResponse } from "@/lib/orders-api";

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

export default function Commandes() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Erreur de chargement"
        )
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Chargement…</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Commandes</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-gray-500">Aucune commande pour le moment.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  #
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Client
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Statut
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Articles
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-medium">{order.id}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {order.customerEmail ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {order.lines
                      .map(
                        (line) =>
                          `${line.productName} × ${line.quantity}`
                      )
                      .join(", ")}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
