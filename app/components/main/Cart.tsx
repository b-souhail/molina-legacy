"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { useCart } from "@/lib/cart-context";
import { resolveProductImageUrl } from "@/lib/image-url";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
  }).format(n);

export default function Cart() {
  const {
    items,
    isOpen,
    total,
    totalQty,
    openCart,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={openCart}
        className="relative flex items-center justify-center text-(--forest) hover:text-(--gold) transition-colors duration-300 hover:opacity-80"
        aria-label="Ouvrir le panier"
      >
        <ShoppingBag size={19} strokeWidth={1.7} />
        {totalQty > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--gold) px-1 text-[9px] font-bold text-white">
            {totalQty}
          </span>
        )}
      </button>

      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/55 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-(--gold)/15 bg-[#16251d] transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-px w-full bg-linear-to-r from-transparent via-(--gold) to-transparent" />

        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-(--gold)">
              Molina Legacy
            </p>
            <h2 className="mt-2 font-(family-name:--font-heading) text-3xl text-(--cream)">
              Panier
            </h2>
          </div>

          <button
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center border border-(--gold)/15 text-(--cream)/60 transition-all duration-300 hover:border-(--gold) hover:text-(--gold)"
            aria-label="Fermer le panier"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <p className="text-center text-sm text-(--cream)/50">
              Votre panier est vide.
            </p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.productId}
                  className="group flex gap-4 border border-white/5 bg-white/[0.025] p-3 transition-colors duration-300 hover:border-(--gold)/20"
                >
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden border border-white/5">
                    <Image
                      src={resolveProductImageUrl(item.imageUrl)}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-sm leading-relaxed text-(--cream)">
                        {item.name}
                      </h3>
                      {item.variant && (
                        <p className="mt-1 text-[11px] tracking-[0.08em] text-(--cream)/40">
                          {item.variant}
                        </p>
                      )}
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="flex items-center border border-(--gold)/15">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center text-(--cream)/50 transition-colors hover:text-(--gold)"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm text-(--cream)">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center text-(--cream)/50 transition-colors hover:text-(--gold)"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-(--cream)/30 transition-colors hover:text-(--gold)"
                          aria-label="Retirer du panier"
                        >
                          <Trash2 size={14} />
                        </button>
                        <p className="font-(family-name:--font-heading) text-xl text-(--gold)">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <footer className="border-t border-white/5 bg-[#111c16] p-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-(--cream)/35">
                Total TTC
              </p>
              <p className="mt-2 font-(family-name:--font-heading) text-4xl text-(--gold)">
                {formatPrice(total)}
              </p>
            </div>
          </div>

          <Link
            href="/checkout"
            onClick={closeCart}
            className={`flex h-14 w-full items-center justify-center border border-(--gold) bg-(--gold) text-[11px] font-semibold uppercase tracking-[0.35em] text-black transition-all duration-300 hover:opacity-90 ${
              items.length === 0
                ? "pointer-events-none opacity-40"
                : ""
            }`}
          >
            Commander
          </Link>

          {items.length === 0 && (
            <Link
              href="/collections"
              onClick={closeCart}
              className="mt-3 block text-center text-[11px] uppercase tracking-[0.2em] text-(--cream)/50 hover:text-(--gold)"
            >
              Continuer vos achats
            </Link>
          )}
        </footer>
      </aside>
    </>
  );
}
