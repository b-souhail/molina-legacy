"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { resolveProductImageUrl } from "@/lib/image-url";
import { createOrder, type PaymentType } from "@/lib/orders-api";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
  }).format(n);

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerTel, setCustomerTel] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("ESPECES");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setCustomerName((current) =>
        current || `${user.firstName} ${user.lastName}`.trim()
      );
      setCustomerEmail((current) => current || user.email);
      setCustomerTel((current) => current || user.tel || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const order = await createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerTel: customerTel.trim() || undefined,
        shippingAddress: shippingAddress.trim(),
        shippingCity: shippingCity.trim(),
        shippingPostalCode: shippingPostalCode.trim() || undefined,
        paymentType,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          optionIds: item.selectedOptionIds,
        })),
      });
      clearCart();
      router.push(`/checkout/success?order=${order.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible de passer la commande"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-(--cream)">
        <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
          <ShoppingBag size={40} className="mb-6 text-(--gold)" strokeWidth={1.2} />
          <h1 className="font-heading text-3xl text-(--forest)">Panier vide</h1>
          <p className="mt-4 text-sm text-(--sage)">
            Ajoutez des articles avant de passer commande.
          </p>
          <Link
            href="/collections"
            className="mt-8 border border-(--forest)/25 px-8 py-3 text-[10px] uppercase tracking-[0.35em] text-(--forest) transition-colors hover:border-(--forest) hover:bg-(--forest) hover:text-(--gold)"
          >
            Voir les collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--cream)">
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">
        <div className="mb-10">
          <p className="mb-3 text-[9px] uppercase tracking-[0.55em] text-(--sage)">
            Commande
          </p>
          <h1 className="font-heading text-3xl text-(--forest) md:text-4xl">
            Finaliser la commande
          </h1>
          <p className="mt-3 text-sm text-(--sage)">
            Aucun compte requis. Renseignez vos coordonnées pour confirmer.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-10 lg:grid-cols-[1.4fr_1fr]"
        >
          <div className="space-y-8">
            <section className="space-y-4 border border-(--gold)/20 bg-white/40 p-5">
              <h2 className="font-heading text-xl text-(--forest)">
                Vos coordonnées
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
                    Nom complet
                  </span>
                  <input
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="h-12 border border-(--gold)/25 bg-white px-4 text-sm text-(--forest) outline-none focus:border-(--gold)"
                    placeholder="Votre nom"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
                    Email
                  </span>
                  <input
                    required
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="h-12 border border-(--gold)/25 bg-white px-4 text-sm text-(--forest) outline-none focus:border-(--gold)"
                    placeholder="vous@exemple.com"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
                    Téléphone
                  </span>
                  <input
                    value={customerTel}
                    onChange={(e) => setCustomerTel(e.target.value)}
                    className="h-12 border border-(--gold)/25 bg-white px-4 text-sm text-(--forest) outline-none focus:border-(--gold)"
                    placeholder="06 00 00 00 00"
                  />
                </label>
              </div>
            </section>

            <section className="space-y-4 border border-(--gold)/20 bg-white/40 p-5">
              <h2 className="font-heading text-xl text-(--forest)">
                Adresse de livraison
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
                    Adresse
                  </span>
                  <textarea
                    required
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="border border-(--gold)/25 bg-white px-4 py-3 text-sm text-(--forest) outline-none focus:border-(--gold)"
                    placeholder="Rue, immeuble, appartement…"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
                    Ville
                  </span>
                  <input
                    required
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    className="h-12 border border-(--gold)/25 bg-white px-4 text-sm text-(--forest) outline-none focus:border-(--gold)"
                    placeholder="Casablanca"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-(--sage)">
                    Code postal
                  </span>
                  <input
                    value={shippingPostalCode}
                    onChange={(e) => setShippingPostalCode(e.target.value)}
                    className="h-12 border border-(--gold)/25 bg-white px-4 text-sm text-(--forest) outline-none focus:border-(--gold)"
                    placeholder="20000"
                  />
                </label>
              </div>
            </section>

            <section className="space-y-4 border border-(--gold)/20 bg-white/40 p-5">
              <h2 className="font-heading text-xl text-(--forest)">
                Mode de paiement
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-center gap-3 border px-4 py-4 transition-colors ${
                    paymentType === "ESPECES"
                      ? "border-(--gold) bg-(--gold)/10"
                      : "border-(--gold)/25 bg-white hover:border-(--gold)/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentType"
                    value="ESPECES"
                    checked={paymentType === "ESPECES"}
                    onChange={() => setPaymentType("ESPECES")}
                    className="accent-(--gold)"
                  />
                  <div>
                    <p className="text-sm font-medium text-(--forest)">Espèces</p>
                    <p className="text-xs text-(--sage)">Paiement à la livraison</p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 border px-4 py-4 transition-colors ${
                    paymentType === "CARTE"
                      ? "border-(--gold) bg-(--gold)/10"
                      : "border-(--gold)/25 bg-white hover:border-(--gold)/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentType"
                    value="CARTE"
                    checked={paymentType === "CARTE"}
                    onChange={() => setPaymentType("CARTE")}
                    className="accent-(--gold)"
                  />
                  <div>
                    <p className="text-sm font-medium text-(--forest)">Carte</p>
                    <p className="text-xs text-(--sage)">Paiement par carte bancaire</p>
                  </div>
                </label>
              </div>
            </section>

            <section className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.cartKey}
                  className="flex gap-4 border border-(--gold)/20 bg-white/40 p-4"
                >
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden border border-(--gold)/15">
                    <Image
                      src={resolveProductImageUrl(item.imageUrl)}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-heading text-lg text-(--forest)">
                        {item.name}
                      </h3>
                      {item.variant && (
                        <p className="mt-1 text-xs text-(--sage)">{item.variant}</p>
                      )}
                      <p className="mt-1 text-sm text-(--sage)">
                        {formatPrice(item.price)} / unité
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-(--gold)/25">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.cartKey, item.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center text-(--forest)/60 hover:text-(--gold)"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm text-(--forest)">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.cartKey, item.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center text-(--forest)/60 hover:text-(--gold)"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => removeItem(item.cartKey)}
                          className="text-[10px] uppercase tracking-[0.18em] text-(--sage) hover:text-(--forest)"
                        >
                          Retirer
                        </button>
                        <p className="mt-2 font-heading text-xl text-(--gold)">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </div>

          <aside className="h-fit border border-(--gold)/25 bg-white/50 p-6">
            <h2 className="font-heading text-2xl text-(--forest)">Récapitulatif</h2>
            <div className="my-6 h-px bg-linear-to-r from-transparent via-(--gold)/30 to-transparent" />

            <div className="space-y-3 text-sm text-(--sage)">
              <div className="flex justify-between">
                <span>Articles</span>
                <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>Offerte</span>
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between border-t border-(--gold)/20 pt-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-(--sage)">
                Total TTC
              </p>
              <p className="font-heading text-4xl text-(--gold)">
                {formatPrice(total)}
              </p>
            </div>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 h-14 w-full border border-(--gold) bg-(--gold) text-[11px] font-semibold uppercase tracking-[0.35em] text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "Commande en cours…" : "Confirmer la commande"}
            </button>

            <Link
              href="/collections"
              className="mt-4 block text-center text-[10px] uppercase tracking-[0.2em] text-(--sage) hover:text-(--gold)"
            >
              Continuer vos achats
            </Link>
          </aside>
        </form>
      </div>
    </div>
  );
}
