"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp, ArrowRight, Search } from "lucide-react";

import {
  fetchOrders,
  formatOrderDate,
  formatOrderPrice,
  ORDER_STATUSES,
  orderStatusBadgeClass,
  orderStatusLabel,
  paymentTypeLabel,
  type OrderResponse,
  type OrderSortKey,
  type OrderStatus,
} from "@/lib/orders-api";

function matchesSearch(order: OrderResponse, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return true;
  }

  const haystack = [
    String(order.id),
    order.customerName,
    order.customerEmail,
    order.customerTel,
    order.shippingAddress,
    order.shippingCity,
    order.shippingPostalCode,
    order.status,
    orderStatusLabel(order.status),
    paymentTypeLabel(order.paymentType),
    ...order.lines.map(
      (line) => `${line.productName} ${line.productSlug} ${line.quantity}`
    ),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

function sortOrders(orders: OrderResponse[], sortKey: OrderSortKey) {
  const sorted = [...orders];

  sorted.sort((a, b) => {
    switch (sortKey) {
      case "date-asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "date-desc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "total-asc":
        return Number(a.total) - Number(b.total);
      case "total-desc":
        return Number(b.total) - Number(a.total);
      case "id-asc":
        return a.id - b.id;
      case "id-desc":
        return b.id - a.id;
      case "customer-asc":
        return (a.customerName ?? a.customerEmail ?? "").localeCompare(
          b.customerName ?? b.customerEmail ?? "",
          "fr"
        );
      case "customer-desc":
        return (b.customerName ?? b.customerEmail ?? "").localeCompare(
          a.customerName ?? a.customerEmail ?? "",
          "fr"
        );
      case "status-asc":
        return a.status.localeCompare(b.status, "fr");
      default:
        return 0;
    }
  });

  return sorted;
}

export default function Commandes() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [sortKey, setSortKey] = useState<OrderSortKey>("date-desc");

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch((err) => {
        if (err instanceof Error && err.message === "CONNECT_REQUIRED") {
          router.replace("/auth/login?redirect=/admin/commandes");
          return;
        }
        setError(
          err instanceof Error ? err.message : "Erreur de chargement"
        );
      })
      .finally(() => setLoading(false));
  }, [router]);

  const filteredOrders = useMemo(() => {
    const filtered = orders.filter((order) => {
      const statusOk = statusFilter === "ALL" || order.status === statusFilter;
      return statusOk && matchesSearch(order, search);
    });
    return sortOrders(filtered, sortKey);
  }, [orders, search, statusFilter, sortKey]);

  if (loading) {
    return <div className="text-sm text-(--sage)">Chargement…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.35em] text-(--sage)">
          Gestion
        </p>
        <h1 className="mt-2 font-heading text-3xl text-(--forest)">Commandes</h1>
      </div>

      <div className="grid gap-4 rounded-lg border border-(--gold)/20 bg-white p-4 md:grid-cols-[1fr_auto_auto]">
        <label className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--sage)"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par n°, client, email, ville, produit…"
            className="h-11 w-full border border-(--gold)/20 bg-(--cream)/40 pl-10 pr-4 text-sm text-(--forest) outline-none focus:border-(--gold)"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-[0.18em] text-(--sage)">
            Statut
          </span>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "ALL" | OrderStatus)
            }
            className="h-11 border border-(--gold)/20 bg-white px-3 text-sm text-(--forest) outline-none focus:border-(--gold)"
          >
            <option value="ALL">Tous</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {orderStatusLabel(status)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-[0.18em] text-(--sage)">
            Trier par
          </span>
          <div className="relative">
            <ArrowDownUp
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--sage)"
            />
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as OrderSortKey)}
              className="h-11 w-full min-w-48 border border-(--gold)/20 bg-white pl-9 pr-3 text-sm text-(--forest) outline-none focus:border-(--gold)"
            >
              <option value="date-desc">Date (récent)</option>
              <option value="date-asc">Date (ancien)</option>
              <option value="total-desc">Total (élevé)</option>
              <option value="total-asc">Total (faible)</option>
              <option value="id-desc">N° commande (élevé)</option>
              <option value="id-asc">N° commande (faible)</option>
              <option value="customer-asc">Client (A-Z)</option>
              <option value="customer-desc">Client (Z-A)</option>
              <option value="status-asc">Statut (A-Z)</option>
            </select>
          </div>
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-sm text-(--sage)">
        {filteredOrders.length} commande{filteredOrders.length > 1 ? "s" : ""}
        {search || statusFilter !== "ALL" ? " trouvée(s)" : ""}
      </p>

      {filteredOrders.length === 0 ? (
        <p className="rounded-lg border border-(--gold)/20 bg-white p-8 text-center text-sm text-(--sage)">
          Aucune commande ne correspond à votre recherche.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-(--gold)/20 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-(--cream) text-left text-(--sage)">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Ville</th>
                <th className="px-4 py-3 font-medium">Paiement</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-(--gold)/10">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="align-top">
                  <td className="px-4 py-4 font-medium text-(--forest)">
                    {order.id}
                  </td>
                  <td className="px-4 py-4 text-(--sage)">
                    {formatOrderDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-4 text-(--sage)">
                    <p className="font-medium text-(--forest)">
                      {order.customerName ?? "—"}
                    </p>
                    <p>{order.customerEmail ?? "—"}</p>
                  </td>
                  <td className="px-4 py-4 text-(--sage)">
                    {order.shippingCity ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-(--sage)">
                    {paymentTypeLabel(order.paymentType)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${orderStatusBadgeClass(order.status)}`}
                    >
                      {orderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-(--forest)">
                    {formatOrderPrice(order.total)}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/commandes/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.16em] text-(--sage) transition-colors hover:text-(--forest)"
                    >
                      Détails
                      <ArrowRight size={12} />
                    </Link>
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
