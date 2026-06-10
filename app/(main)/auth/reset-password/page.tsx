"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  resetPassword,
  validatePasswordResetToken,
} from "@/lib/auth-api";

function LuxInput({
  label,
  type = "password",
  placeholder,
  value,
  onChange,
  name,
  autoComplete,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  name: string;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[9px] font-medium uppercase tracking-[0.3em] text-[rgba(244,241,231,0.55)]">
        {label}
      </label>
      <input
        name={name}
        autoComplete={autoComplete}
        required
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="h-12 w-full rounded-[2px] border bg-white/[0.04] px-4 text-[13px] tracking-[0.04em] text-[var(--cream)] outline-none transition-all duration-300 placeholder:text-white/20"
        style={{
          borderColor: focused ? "#B89A5A" : "rgba(184,154,90,0.25)",
        }}
      />
    </div>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = Number(searchParams.get("id"));
  const token = searchParams.get("token") ?? "";

  const [validating, setValidating] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [matchPassword, setMatchPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id || Number.isNaN(id) || !token) {
      setTokenError("Lien de réinitialisation invalide.");
      setValidating(false);
      return;
    }

    validatePasswordResetToken(id, token)
      .catch((err: Error) => setTokenError(err.message))
      .finally(() => setValidating(false));
  }, [id, token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await resetPassword({
        id,
        token,
        newPassword,
        matchPassword,
      });
      setSuccess(true);
      setTimeout(() => router.replace("/auth/login"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Réinitialisation impossible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--forest)] px-4 py-10">
      <div className="absolute inset-0">
        <Image
          src="/image.png"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.10]"
        />
      </div>
      <div className="absolute inset-0 bg-[var(--forest)]/88" />

      <section className="relative z-10 w-full max-w-[460px] rounded-[4px] border border-[rgba(184,154,90,0.2)] bg-[rgba(17,22,19,0.82)] px-6 py-10 shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:px-10 sm:py-12">
        <header className="mb-8 text-center">
          <p className="text-[9px] uppercase tracking-[0.4em] text-[var(--gold)]">
            Mot de passe
          </p>
          <h1 className="mt-4 font-heading text-[24px] font-medium text-[var(--cream)]">
            Nouveau mot de passe
          </h1>
        </header>

        {validating && (
          <p className="text-center text-[13px] text-[rgba(244,241,231,0.55)]">
            Vérification du lien…
          </p>
        )}

        {!validating && tokenError && (
          <div className="space-y-6 text-center">
            <p className="text-[13px] text-red-300">{tokenError}</p>
            <Link
              href="/auth/forgot-password"
              className="text-[11px] text-[var(--gold)] hover:opacity-80"
            >
              Demander un nouveau lien
            </Link>
          </div>
        )}

        {!validating && !tokenError && success && (
          <p className="text-center text-[13px] text-[var(--gold)]">
            Mot de passe mis à jour. Redirection vers la connexion…
          </p>
        )}

        {!validating && !tokenError && !success && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <p className="text-center text-[12px] text-red-300">{error}</p>
            )}

            <LuxInput
              label="Nouveau mot de passe"
              name="newPassword"
              autoComplete="new-password"
              placeholder="••••••••••"
              value={newPassword}
              onChange={setNewPassword}
            />

            <LuxInput
              label="Confirmer le mot de passe"
              name="matchPassword"
              autoComplete="new-password"
              placeholder="••••••••••"
              value={matchPassword}
              onChange={setMatchPassword}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-[52px] rounded-[2px] border-0 bg-[linear-gradient(135deg,#B89A5A_0%,#c9ab6a_50%,#B89A5A_100%)] text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--deep)] disabled:opacity-60"
            >
              {loading ? "Enregistrement…" : "Enregistrer"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--forest)] text-sm text-[var(--cream)]">
          Chargement…
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
