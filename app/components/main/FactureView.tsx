"use client";

import Image from "next/image";

import {
  formatOrderDate,
  formatOrderPrice,
  paymentOrderStatusLabel,
  paymentTypeLabel,
  type FactureResponse,
} from "@/lib/orders-api";

export function FactureView({ facture }: { facture: FactureResponse }) {
  const shippingLine = [facture.shippingCity, facture.shippingPostalCode]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="facture-document mx-auto w-full max-w-3xl bg-white px-6 py-10 text-(--forest) md:px-10 md:py-12 print:max-w-none print:bg-white print:px-0 print:py-0">
      <header className="flex flex-wrap items-start justify-between gap-6 border-b border-(--forest)/10 pb-8">
        <div>
          <Image
            src="/molina-logo.png"
            alt="Molina Legacy"
            width={160}
            height={48}
            className="h-10 w-auto object-contain md:h-12"
            priority
          />
        </div>
        <div className="text-right">
          <h1 className="font-heading text-2xl text-(--forest) md:text-3xl">
            Facture
          </h1>
          <p className="mt-1 text-sm font-medium">{facture.invoiceNumber}</p>
          <p className="mt-2 text-sm text-(--sage)">
            Émise le {formatOrderDate(facture.issuedAt)}
          </p>
          <p className="text-sm text-(--sage)">Commande n°{facture.orderId}</p>
        </div>
      </header>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-(--sage)">
            Client
          </h2>
          <p className="mt-2 font-medium">{facture.customerName ?? "—"}</p>
          <p className="text-sm text-(--sage)">{facture.customerEmail ?? "—"}</p>
          {facture.customerTel && (
            <p className="text-sm text-(--sage)">{facture.customerTel}</p>
          )}
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-(--sage)">
            Livraison
          </h2>
          <p className="mt-2 text-sm">{facture.shippingAddress ?? "—"}</p>
          {shippingLine && (
            <p className="text-sm text-(--sage)">{shippingLine}</p>
          )}
        </section>
      </div>

      <table className="mt-10 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-(--forest)/15 text-left text-(--sage)">
            <th className="pb-3 pr-4 font-medium">Article</th>
            <th className="pb-3 pr-4 text-center font-medium">Qté</th>
            <th className="pb-3 pr-4 text-right font-medium">Prix unit.</th>
            <th className="pb-3 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {facture.lines.map((line) => (
            <tr key={line.id} className="border-b border-(--forest)/8">
              <td className="py-4 pr-4">{line.productName}</td>
              <td className="py-4 pr-4 text-center">{line.quantity}</td>
              <td className="py-4 pr-4 text-right">
                {formatOrderPrice(line.unitPrice)}
              </td>
              <td className="py-4 text-right font-medium">
                {formatOrderPrice(line.unitPrice * line.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 flex flex-col items-end gap-6 border-t border-(--forest)/10 pt-6">
        <dl className="w-full max-w-sm space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-(--sage)">Paiement</dt>
            <dd>{paymentTypeLabel(facture.paymentType)}</dd>
          </div>
          {facture.paymentReference && (
            <div className="flex justify-between gap-4">
              <dt className="text-(--sage)">Réf. paiement</dt>
              <dd>{facture.paymentReference}</dd>
            </div>
          )}
          {facture.paymentStatus && (
            <div className="flex justify-between gap-4">
              <dt className="text-(--sage)">Statut paiement</dt>
              <dd>{paymentOrderStatusLabel(facture.paymentStatus)}</dd>
            </div>
          )}
        </dl>

        <div className="flex w-full max-w-sm items-baseline justify-between gap-4 border-t border-(--forest)/10 pt-4">
          <span className="text-sm font-semibold uppercase tracking-wide text-(--sage)">
            Total TTC
          </span>
          <span className="font-heading text-2xl text-(--forest)">
            {formatOrderPrice(facture.amount)}
          </span>
        </div>
      </div>
    </article>
  );
}
