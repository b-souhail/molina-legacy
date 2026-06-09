"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2 } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <div className="min-h-screen bg-(--cream)">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
        <CheckCircle2 size={48} className="mb-6 text-(--gold)" strokeWidth={1.2} />
        <p className="mb-3 text-[9px] uppercase tracking-[0.55em] text-(--sage)">
          Merci
        </p>
        <h1 className="font-heading text-3xl text-(--forest) md:text-4xl">
          Commande confirmée
        </h1>
        {orderId && (
          <p className="mt-4 text-sm text-(--sage)">
            Votre commande n°{orderId} a bien été enregistrée.
          </p>
        )}
        <p className="mt-2 max-w-md text-sm leading-relaxed text-(--sage)">
          Nous préparons votre commande. Vous recevrez une confirmation par email.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          {orderId && (
            <Link
              href={`/facture/${orderId}`}
              className="border border-(--forest)/25 px-8 py-3 text-[10px] uppercase tracking-[0.35em] text-(--forest) transition-colors hover:border-(--forest) hover:bg-(--forest) hover:text-(--gold)"
            >
              Voir la facture
            </Link>
          )}
          <Link
            href="/"
            className="border border-(--forest)/25 px-8 py-3 text-[10px] uppercase tracking-[0.35em] text-(--forest) transition-colors hover:border-(--forest) hover:bg-(--forest) hover:text-(--gold)"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/collections"
            className="border border-(--gold) bg-(--gold) px-8 py-3 text-[10px] uppercase tracking-[0.35em] text-black transition-opacity hover:opacity-90"
          >
            Continuer vos achats
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-(--cream) text-sm text-(--sage)">
          Chargement…
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
