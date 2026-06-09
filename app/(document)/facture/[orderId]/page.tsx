"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Printer } from "lucide-react";

import { FactureDocumentShell } from "@/app/components/main/FactureDocumentShell";
import { FactureView } from "@/app/components/main/FactureView";
import { fetchFactureByOrderId, type FactureResponse } from "@/lib/orders-api";

export default function PublicFacturePage() {
  const params = useParams();
  const orderId = Number(params.orderId);
  const [facture, setFacture] = useState<FactureResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || Number.isNaN(orderId)) {
      setError("Commande invalide");
      setLoading(false);
      return;
    }

    fetchFactureByOrderId(orderId)
      .then(setFacture)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur de chargement")
      )
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--cream) text-sm text-(--sage)">
        Chargement de la facture…
      </div>
    );
  }

  if (error || !facture) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-(--cream) px-4 text-center">
        <p className="text-sm text-red-600">{error ?? "Facture introuvable"}</p>
        <Link
          href="/"
          className="mt-6 text-sm text-(--sage) hover:text-(--forest)"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <FactureDocumentShell
      toolbar={
        <>
          <Link href="/" className="text-sm text-(--sage) hover:text-(--forest)">
            Accueil
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 border border-(--forest)/20 bg-white px-4 py-2 text-sm text-(--forest) hover:bg-(--forest)/5"
          >
            <Printer size={16} />
            Imprimer
          </button>
        </>
      }
    >
      <FactureView facture={facture} />
    </FactureDocumentShell>
  );
}
