"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Package } from "lucide-react";

import { resolveProductImageUrl } from "@/lib/image-url";
import {
  fetchOrderById,
  fetchPaymentByOrderId,
  formatOrderDate,
  formatOrderPrice,
  ORDER_STATUSES,
  orderStatusBadgeClass,
  orderStatusLabel,
  PAYMENT_ORDER_STATUSES,
  paymentOrderStatusLabel,
  paymentTypeLabel,
  updateOrderStatus,
  updatePaymentStatus,
  type OrderResponse,
  type OrderStatus,
  type PaymentOrderResponse,
  type PaymentOrderStatus,
} from "@/lib/orders-api";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [payment, setPayment] = useState<PaymentOrderResponse | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("PENDING");
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<PaymentOrderStatus>("PENDING");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || Number.isNaN(orderId)) {
      setError("Commande invalide");
      setLoading(false);
      return;
    }

    Promise.all([fetchOrderById(orderId), fetchPaymentByOrderId(orderId)])
      .then(([orderData, paymentData]) => {
        setOrder(orderData);
        setSelectedStatus(orderData.status);
        setPayment(paymentData);
        setSelectedPaymentStatus(paymentData.status);
      })
      .catch((err) => {
        if (err instanceof Error && err.message === "CONNECT_REQUIRED") {
          router.replace(`/auth/login?redirect=/admin/commandes/${orderId}`);
          return;
        }
        setError(
          err instanceof Error ? err.message : "Erreur de chargement"
        );
      })
      .finally(() => setLoading(false));
  }, [orderId, router]);

  const handlePaymentUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payment || selectedPaymentStatus === payment.status) {
      return;
    }

    setSavingPayment(true);
    setError(null);
    setPaymentSuccess(null);

    try {
      const updated = await updatePaymentStatus(orderId, selectedPaymentStatus);
      setPayment(updated);
      setSelectedPaymentStatus(updated.status);
      setPaymentSuccess("Paiement mis à jour avec succès.");
    } catch (err) {
      if (err instanceof Error && err.message === "CONNECT_REQUIRED") {
        router.replace(`/auth/login?redirect=/admin/commandes/${orderId}`);
        return;
      }
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de mettre à jour le paiement"
      );
    } finally {
      setSavingPayment(false);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || selectedStatus === order.status) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await updateOrderStatus(order.id, selectedStatus);
      setOrder(updated);
      setSelectedStatus(updated.status);
      setSuccess("Statut mis à jour avec succès.");
    } catch (err) {
      if (err instanceof Error && err.message === "CONNECT_REQUIRED") {
        router.replace(`/auth/login?redirect=/admin/commandes/${orderId}`);
        return;
      }
      setError(
        err instanceof Error ? err.message : "Impossible de mettre à jour le statut"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-(--sage)">Chargement…</div>;
  }

  if (error && !order) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/commandes"
          className="inline-flex items-center gap-2 text-sm text-(--sage) hover:text-(--forest)"
        >
          <ArrowLeft size={16} />
          Retour aux commandes
        </Link>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const statusChanged = selectedStatus !== order.status;
  const paymentStatusChanged =
    payment != null && selectedPaymentStatus !== payment.status;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/commandes"
          className="inline-flex items-center gap-2 text-sm text-(--sage) transition-colors hover:text-(--forest)"
        >
          <ArrowLeft size={16} />
          Retour aux commandes
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
              Passée le {formatOrderDate(order.createdAt)}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${orderStatusBadgeClass(order.status)}`}
          >
            {orderStatusLabel(order.status)}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-lg border border-(--gold)/20 bg-white p-6">
            <h2 className="font-heading text-xl text-(--forest)">Client</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-(--sage)">
                  Nom
                </dt>
                <dd className="mt-1 text-(--forest)">
                  {order.customerName ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-(--sage)">
                  Email
                </dt>
                <dd className="mt-1 text-(--forest)">
                  {order.customerEmail ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-(--sage)">
                  Téléphone
                </dt>
                <dd className="mt-1 text-(--forest)">
                  {order.customerTel ?? "—"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-(--gold)/20 bg-white p-6">
            <h2 className="font-heading text-xl text-(--forest)">Livraison</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-(--sage)">
                  Adresse
                </dt>
                <dd className="mt-1 text-(--forest)">
                  {order.shippingAddress ?? "—"}
                </dd>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-(--sage)">
                    Ville
                  </dt>
                  <dd className="mt-1 text-(--forest)">
                    {order.shippingCity ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-(--sage)">
                    Code postal
                  </dt>
                  <dd className="mt-1 text-(--forest)">
                    {order.shippingPostalCode ?? "—"}
                  </dd>
                </div>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-(--gold)/20 bg-white p-6">
            <h2 className="font-heading text-xl text-(--forest)">Articles</h2>
            <ul className="mt-4 space-y-3">
              {order.lines.map((line) => (
                <li
                  key={line.id}
                  className="flex gap-4 border border-(--gold)/15 bg-(--cream)/30 p-3"
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
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-(--gold)/20 bg-white p-6">
            <h2 className="font-heading text-xl text-(--forest)">Récapitulatif</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-(--sage)">Paiement</dt>
                <dd className="text-(--forest)">
                  {paymentTypeLabel(order.paymentType)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-(--sage)">Articles</dt>
                <dd className="text-(--forest)">
                  {order.lines.reduce((sum, line) => sum + line.quantity, 0)}
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
          </section>

          {payment && (
            <section className="rounded-lg border border-(--gold)/20 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-heading text-xl text-(--forest)">Paiement</h2>
                <Link
                  href={`/admin/commandes/${order.id}/facture`}
                  className="text-[10px] uppercase tracking-[0.18em] text-(--sage) hover:text-(--forest)"
                >
                  Voir la facture
                </Link>
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-(--sage)">Référence</dt>
                  <dd className="font-medium text-(--forest)">
                    {payment.reference}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-(--sage)">Montant</dt>
                  <dd className="text-(--forest)">
                    {formatOrderPrice(payment.amount)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-(--sage)">Mode</dt>
                  <dd className="text-(--forest)">
                    {paymentTypeLabel(payment.method)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-(--sage)">Statut</dt>
                  <dd className="text-(--forest)">
                    {paymentOrderStatusLabel(payment.status)}
                  </dd>
                </div>
                {payment.paidAt && (
                  <div className="flex justify-between">
                    <dt className="text-(--sage)">Payé le</dt>
                    <dd className="text-(--forest)">
                      {formatOrderDate(payment.paidAt)}
                    </dd>
                  </div>
                )}
              </dl>

              <form onSubmit={handlePaymentUpdate} className="mt-6 space-y-4">
                <label className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-(--sage)">
                    Statut du paiement
                  </span>
                  <select
                    value={selectedPaymentStatus}
                    onChange={(e) =>
                      setSelectedPaymentStatus(
                        e.target.value as PaymentOrderStatus
                      )
                    }
                    className="h-11 border border-(--gold)/20 bg-white px-3 text-sm text-(--forest) outline-none focus:border-(--gold)"
                  >
                    {PAYMENT_ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {paymentOrderStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </label>

                {paymentSuccess && (
                  <p className="text-sm text-emerald-700">{paymentSuccess}</p>
                )}

                <button
                  type="submit"
                  disabled={savingPayment || !paymentStatusChanged}
                  className="h-11 w-full border border-(--forest)/20 text-[11px] font-semibold uppercase tracking-[0.28em] text-(--forest) transition-colors hover:border-(--forest) hover:bg-(--forest) hover:text-(--gold) disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {savingPayment
                    ? "Enregistrement…"
                    : "Mettre à jour le paiement"}
                </button>
              </form>
            </section>
          )}

          <section className="rounded-lg border border-(--gold)/20 bg-white p-6">
            <h2 className="font-heading text-xl text-(--forest)">
              Gérer le statut
            </h2>
            <form onSubmit={handleStatusUpdate} className="mt-4 space-y-4">
              <label className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.18em] text-(--sage)">
                  Statut de la commande
                </span>
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as OrderStatus)
                  }
                  className="h-11 border border-(--gold)/20 bg-white px-3 text-sm text-(--forest) outline-none focus:border-(--gold)"
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {orderStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-emerald-700">{success}</p>}

              <button
                type="submit"
                disabled={saving || !statusChanged}
                className="h-11 w-full border border-(--gold) bg-(--gold) text-[11px] font-semibold uppercase tracking-[0.28em] text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? "Enregistrement…" : "Mettre à jour le statut"}
              </button>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}
