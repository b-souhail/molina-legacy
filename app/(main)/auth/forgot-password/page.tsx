"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { requestPasswordReset } from "@/lib/auth-api";

function LuxInput({
  label,
  type = "text",
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await requestPasswordReset(email.trim());
      setSent(true);
      setError(null);
      if (result.message) {
        // message shown via sent state
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demande impossible");
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
            Réinitialisation
          </h1>
          <p className="mt-3 text-[12px] leading-relaxed text-[rgba(244,241,231,0.45)]">
            Entrez l&apos;email associé à votre compte. Nous vous enverrons un
            lien pour choisir un nouveau mot de passe.
          </p>
        </header>

        {sent ? (
          <div className="space-y-6 text-center">
            <p className="text-[13px] leading-relaxed text-[var(--gold)]">
              Si un compte existe avec cette adresse, vous recevrez un email de
              réinitialisation sous peu.
            </p>
            <Link
              href="/auth/login"
              className="inline-block text-[11px] uppercase tracking-[0.2em] text-[var(--cream)] hover:text-[var(--gold)]"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <p className="text-center text-[12px] text-red-300">{error}</p>
            )}

            <LuxInput
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={setEmail}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-[52px] rounded-[2px] border-0 bg-[linear-gradient(135deg,#B89A5A_0%,#c9ab6a_50%,#B89A5A_100%)] text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--deep)] disabled:opacity-60"
            >
              {loading ? "Envoi…" : "Envoyer le lien"}
            </button>
          </form>
        )}

        {!sent && (
          <footer className="mt-8 text-center">
            <Link
              href="/auth/login"
              className="text-[11px] text-[var(--gold)] hover:opacity-80"
            >
              Retour à la connexion
            </Link>
          </footer>
        )}
      </section>
    </main>
  );
}
