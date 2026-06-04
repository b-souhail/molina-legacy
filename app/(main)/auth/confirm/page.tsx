"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmRegistration } from "@/lib/auth-api";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Lien de confirmation invalide.");
      return;
    }

    confirmRegistration(token)
      .then((user) => {
        setStatus("success");
        setMessage("Votre compte est confirmé.");
        router.replace(user.redirectPath ?? "/");
      })
      .catch((err: Error) => {
        setStatus("error");
        setMessage(err.message);
      });
  }, [token, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--forest)] px-4">
      <section className="max-w-md rounded border border-[rgba(184,154,90,0.2)] bg-[rgba(17,22,19,0.9)] p-8 text-center text-[var(--cream)]">
        {status === "loading" && <p>Confirmation en cours…</p>}
        {status === "success" && <p>{message}</p>}
        {status === "error" && (
          <>
            <p className="mb-4 text-red-300">{message}</p>
            <Link href="/auth/login" className="text-[var(--gold)]">
              Retour à la connexion
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
