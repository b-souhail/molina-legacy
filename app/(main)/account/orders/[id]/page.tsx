"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Package } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { resolveProductImageUrl } from "@/lib/image-url";
import {
  fetchMyOrderById,
  formatOrderDate,
  formatOrderPrice,
  orderStatusBadgeClass,
  orderStatusLabel,
  paymentTypeLabel,
  type OrderResponse,
} from "@/lib/orders-api";

export default function MyOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = Number(params.id);
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.replace(`/auth/login?redirect=/account/orders/${orderId}`);
      return;
    }

    if (!orderId || Number.isNaN(orderId)) {
      setError("Commande invalide");
      setLoading(false);
      return;
    }

    fetchMyOrderById(orderId)
      .then(setOrder)
      .catch((err) => {
        if (err instanceof Error && err.message === "CONNECT_REQUIRED") {
          router.replace(`/auth/login?redirect=/account/orders/${orderId}`);
          return;
        }
        setError(
          err instanceof Error ? err.message : "Erreur de chargement"
        );
      })
      .finally(() => setLoading(false));
  }, [user, authLoading, orderId, router]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-(--cream) text-sm text-(--sage)">
        Chargement…
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-(--cream) px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-sm text-(--sage) hover:text-(--forest)"
          >
            <ArrowLeft size={16} />
            Retour à mes commandes
          </Link>
          <p className="mt-6 text-sm text-red-600">
            {error ?? "Commande introuvable"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--cream)">
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm text-(--sage) hover:text-(--forest)"
        >
          <ArrowLeft size={16} />
          Retour à mes commandes
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-(--sage)">
              Commande
            </p>
            <h1 className="mt-2 font-heading text-3xl text-(--forest)">
              #{order.id}
            </h1>
            <p className="mt-2 text-sm text-(--sage)">
              {formatOrderDate(order.createdAt)}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${orderStatusBadgeClass(order.status)}`}
          >
            {orderStatusLabel(order.status)}
          </span>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="space-y-4">
            <div className="border border-(--gold)/20 bg-white/50 p-5">
              <h2 className="font-heading text-xl text-(--forest)">Livraison</h2>
              <p className="mt-3 text-sm text-(--forest)">
                {order.shippingAddress ?? "—"}
              </p>
              <p className="mt-1 text-sm text-(--sage)">
                {[order.shippingCity, order.shippingPostalCode]
                  .filter(Boolean)
                  .join(" ")}
              </p>
            </div>

            <div className="space-y-3">
              {order.lines.map((line) => (
                <article
                  key={line.id}
                  className="flex gap-4 border border-(--gold)/20 bg-white/50 p-4"
                >
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden border border-(--gold)/15 bg-white">
                    {line.imageUrl ? (
                      <Image
                        src={resolveProductImageUrl(line.imageUrl)}
                        alt={line.productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-(--sage)">
                        <Package size={18} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-(--forest)">
                        {line.productName}
                      </p>
                      <p className="mt-1 text-xs text-(--sage)">
                        {formatOrderPrice(line.unitPrice)} × {line.quantity}
                      </p>
                    </div>
                    <p className="font-heading text-lg text-(--gold)">
                      {formatOrderPrice(line.unitPrice * line.quantity)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="h-fit space-y-4">
            <div className="border border-(--gold)/20 bg-white/50 p-6">
              <h2 className="font-heading text-xl text-(--forest)">Récapitulatif</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-(--sage)">Paiement</dt>
                  <dd className="text-(--forest)">
                    {paymentTypeLabel(order.paymentType)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-(--gold)/15 pt-4">
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
                    Total TTC
                  </dt>
                  <dd className="font-heading text-2xl text-(--gold)">
                    {formatOrderPrice(order.total)}
                  </dd>
                </div>
              </dl>
            </div>

            <Link
              href={`/account/orders/${order.id}/facture`}
              className="flex h-12 w-full items-center justify-center border border-(--gold) bg-(--gold) text-[10px] uppercase tracking-[0.28em] text-black transition-opacity hover:opacity-90"
            >
              Voir la facture
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
