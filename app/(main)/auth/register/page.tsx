"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth-api";

function Wordmark({
  mainColor = "#F4F1E7",
  subColor = "#B89A5A",
}: {
  mainColor?: string;
  subColor?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="font-heading text-[28px] font-bold leading-none tracking-[-0.01em]"
        style={{ color: mainColor }}
      >
        Molina
      </span>

      <div className="flex items-center gap-2">
        <div className="h-px w-6" style={{ backgroundColor: subColor }} />
        <span
          className="text-[9px] font-medium uppercase tracking-[0.35em]"
          style={{ color: subColor, fontFamily: "var(--font-body)" }}
        >
          Legacy
        </span>
        <div className="h-px w-6" style={{ backgroundColor: subColor }} />
      </div>
    </div>
  );
}

function LuxInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  autoComplete,
  required = true,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  name: string;
  autoComplete?: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPass = type === "password";

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[9px] font-medium uppercase tracking-[0.3em] text-[rgba(244,241,231,0.55)]">
        {label}
      </label>
      <div className="relative">
        <input
          name={name}
          autoComplete={autoComplete}
          required={required}
          type={isPass && showPass ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="h-12 w-full rounded-[2px] border bg-white/[0.04] px-4 text-[13px] tracking-[0.04em] text-[var(--cream)] outline-none transition-all duration-300 placeholder:text-white/20"
          style={{
            borderColor: focused ? "#B89A5A" : "rgba(184,154,90,0.25)",
            background: focused
              ? "rgba(184,154,90,0.08)"
              : "rgba(255,255,255,0.04)",
            boxShadow: focused ? "0 0 20px rgba(184,154,90,0.12)" : "none",
            paddingRight: isPass ? "44px" : "16px",
          }}
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-[0.2em] text-[rgba(184,154,90,0.5)]"
          >
            {showPass ? "CACHER" : "VOIR"}
          </button>
        )}
      </div>
    </div>
  );
}

function GoldDivider() {
  return (
    <div className="my-1 flex items-center gap-3">
      <div className="h-px flex-1 bg-[rgba(184,154,90,0.25)]" />
      <div className="h-[6px] w-[6px] rotate-45 border border-[rgba(184,154,90,0.5)]" />
      <div className="h-px flex-1 bg-[rgba(184,154,90,0.25)]" />
    </div>
  );
}

export default function Register() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [matchPassword, setMatchPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await register({
        firstName,
        lastName,
        email,
        password,
        matchPassword,
        tel: tel || undefined,
      });
      const confirmParam = result.requiresEmailConfirmation ? "&confirm=email" : "";
      router.push(`/auth/login?registered=1${confirmParam}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inscription impossible");
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
        <header className="mb-10 text-center">
          <div className="mb-10">
            <Wordmark />
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-5 bg-[rgba(184,154,90,0.4)]" />
            <span className="text-[9px] uppercase tracking-[0.4em] text-[var(--gold)]">
              Nouveau membre
            </span>
            <div className="h-px w-5 bg-[rgba(184,154,90,0.4)]" />
          </div>
          <h1 className="mt-4 font-heading text-[24px] font-medium tracking-[-0.01em] text-[var(--cream)]">
            Créer votre compte
          </h1>
        </header>

        {error && (
          <p className="mb-4 text-center text-[12px] text-red-300">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <LuxInput
            label="Prénom"
            name="firstName"
            autoComplete="given-name"
            placeholder="Jean"
            value={firstName}
            onChange={setFirstName}
          />
          <LuxInput
            label="Nom"
            name="lastName"
            autoComplete="family-name"
            placeholder="Dupont"
            value={lastName}
            onChange={setLastName}
          />
          <LuxInput
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={setEmail}
          />
          <LuxInput
            label="Téléphone (optionnel)"
            name="tel"
            autoComplete="tel"
            placeholder="0612345678"
            value={tel}
            onChange={setTel}
            required={false}
          />
          <LuxInput
            label="Mot de passe"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="••••••••••"
            value={password}
            onChange={setPassword}
          />
          <LuxInput
            label="Confirmer le mot de passe"
            type="password"
            name="matchPassword"
            autoComplete="new-password"
            placeholder="••••••••••"
            value={matchPassword}
            onChange={setMatchPassword}
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-[52px] rounded-[2px] border-0 bg-[linear-gradient(135deg,#B89A5A_0%,#c9ab6a_50%,#B89A5A_100%)] text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--deep)] shadow-[0_8px_30px_rgba(184,154,90,0.3)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(184,154,90,0.45)] disabled:opacity-60"
          >
            {loading ? "Création…" : "Créer un compte"}
          </button>

          <GoldDivider />
        </form>

        <footer className="mt-8 text-center">
          <p className="text-[11px] tracking-[0.08em] text-[rgba(244,241,231,0.35)]">
            Déjà membre ?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-[var(--gold)] transition-opacity hover:opacity-80"
            >
              Se connecter
            </Link>
          </p>
        </footer>
      </section>
    </main>
  );
}
