"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Package } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import {
  fetchMyOrders,
  formatOrderDate,
  formatOrderPrice,
  orderStatusBadgeClass,
  orderStatusLabel,
  paymentTypeLabel,
  type OrderResponse,
} from "@/lib/orders-api";

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.replace("/auth/login?redirect=/account/orders");
      return;
    }

    fetchMyOrders()
      .then(setOrders)
      .catch((err) => {
        if (err instanceof Error && err.message === "CONNECT_REQUIRED") {
          router.replace("/auth/login?redirect=/account/orders");
          return;
        }
        setError(
          err instanceof Error ? err.message : "Erreur de chargement"
        );
      })
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || (!user && !error)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-(--cream) text-sm text-(--sage)">
        Chargement…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--cream)">
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
        <div className="mb-10">
          <p className="mb-3 text-[9px] uppercase tracking-[0.55em] text-(--sage)">
            Mon compte
          </p>
          <h1 className="font-heading text-3xl text-(--forest) md:text-4xl">
            Mes commandes
          </h1>
          {user && (
            <p className="mt-3 text-sm text-(--sage)">{user.email}</p>
          )}
        </div>

        {loading ? (
          <p className="text-sm text-(--sage)">Chargement de vos commandes…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-(--gold)/20 bg-white/50 p-10 text-center">
            <Package
              size={40}
              className="mx-auto mb-4 text-(--gold)"
              strokeWidth={1.2}
            />
            <p className="text-sm text-(--sage)">
              Vous n&apos;avez pas encore passé de commande.
            </p>
            <Link
              href="/collections"
              className="mt-6 inline-block border border-(--forest)/25 px-8 py-3 text-[10px] uppercase tracking-[0.35em] text-(--forest) transition-colors hover:border-(--forest) hover:bg-(--forest) hover:text-(--gold)"
            >
              Voir les collections
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="border border-(--gold)/20 bg-white/50 p-5 transition-colors hover:border-(--gold)/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
                      Commande n°{order.id}
                    </p>
                    <p className="mt-1 text-sm text-(--sage)">
                      {formatOrderDate(order.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${orderStatusBadgeClass(order.status)}`}
                  >
                    {orderStatusLabel(order.status)}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-(--sage)">
                      Articles
                    </p>
                    <p className="mt-1 text-(--forest)">
                      {order.lines.reduce((sum, line) => sum + line.quantity, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-(--sage)">
                      Paiement
                    </p>
                    <p className="mt-1 text-(--forest)">
                      {paymentTypeLabel(order.paymentType)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-(--sage)">
                      Total
                    </p>
                    <p className="mt-1 font-heading text-lg text-(--gold)">
                      {formatOrderPrice(order.total)}
                    </p>
                  </div>
                </div>

                <p className="mt-4 line-clamp-2 text-sm text-(--sage)">
                  {order.lines
                    .map((line) => `${line.productName} × ${line.quantity}`)
                    .join(", ")}
                </p>

                <div className="mt-5">
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-(--forest) hover:text-(--gold)"
                  >
                    Voir le détail
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
