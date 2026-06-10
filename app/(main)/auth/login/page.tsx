"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/auth-api";
import { useAuth } from "@/lib/auth-context";

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
        <div
          className="h-px w-6"
          style={{ backgroundColor: subColor }}
        />

        <span
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-[0.35em]
          "
          style={{
            color: subColor,
            fontFamily: "var(--font-body)",
          }}
        >
          Legacy
        </span>

        <div
          className="h-px w-6"
          style={{ backgroundColor: subColor }}
        />
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
  const [showPass, setShowPass] = useState(false);

  const isPass = type === "password";

  return (
    <div className="flex flex-col gap-2">
      <label
        className="
          text-[9px]
          font-medium
          uppercase
          tracking-[0.3em]
          text-[rgba(244,241,231,0.55)]
        "
      >
        {label}
      </label>

      <div className="relative">
        <input
          name={name}
          autoComplete={autoComplete}
          required
          type={isPass && showPass ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="
            h-12
            w-full
            rounded-[2px]
            border
            bg-white/[0.04]
            px-4
            text-[13px]
            tracking-[0.04em]
            text-(--cream)
            outline-none
            transition-all
            duration-300
            placeholder:text-white/20
          "
          style={{
            borderColor: focused
              ? "#B89A5A"
              : "rgba(184,154,90,0.25)",
            background: focused
              ? "rgba(184,154,90,0.08)"
              : "rgba(255,255,255,0.04)",
            boxShadow: focused
              ? "0 0 20px rgba(184,154,90,0.12)"
              : "none",
            paddingRight: isPass ? "44px" : "16px",
          }}
        />

        {isPass && (
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-[rgba(184,154,90,0.5)]
            "
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

      <div
        className="
          h-[6px]
          w-[6px]
          rotate-45
          border
          border-[rgba(184,154,90,0.5)]
        "
      />

      <div className="h-px flex-1 bg-[rgba(184,154,90,0.25)]" />
    </div>
  );
}

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser, loading: authLoading, setUser } = useAuth();
  const registered = searchParams.get("registered") === "1";
  const needsEmailConfirm = searchParams.get("confirm") === "email";
  const redirectTo = searchParams.get("redirect") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && currentUser) {
      router.replace(redirectTo);
    }
  }, [authLoading, currentUser, redirectTo, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password, { rememberMe });
      setUser(user);
      const safeRedirect =
        redirectTo.startsWith("/") && !redirectTo.startsWith("//")
          ? redirectTo
          : user.redirectPath ?? "/";
      router.push(safeRedirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[var(--forest)]
        px-4
        py-10
      "
    >
      {/* IMAGE */}
      <div className="absolute inset-0">
        <Image
          src="/image.png"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.10]"
        />
      </div>

      {/* FOREST OVERLAY */}
      <div className="absolute inset-0 bg-[var(--forest)]/88" />

      {/* PATTERN */}
      <svg
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="diamonds"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 4 L36 20 L20 36 L4 20 Z"
              stroke="#B89A5A"
              strokeWidth="0.8"
              fill="none"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#diamonds)" />
      </svg>

      {/* TOP LINE */}
      <div
        className="
          absolute
          left-1/2
          top-0
          h-20
          w-px
          -translate-x-1/2
          bg-gradient-to-b
          from-transparent
          to-[rgba(184,154,90,0.4)]
        "
      />

      {/* BOTTOM LINE */}
      <div
        className="
          absolute
          bottom-0
          left-1/2
          h-20
          w-px
          -translate-x-1/2
          bg-gradient-to-t
          from-transparent
          to-[rgba(184,154,90,0.4)]
        "
      />

      {/* CARD */}
      <section
        className="
          relative
          z-10
          w-full
          max-w-[460px]
          rounded-[4px]
          border
          border-[rgba(184,154,90,0.2)]
          bg-[rgba(17,22,19,0.82)]
          px-6
          py-10
          shadow-[0_40px_120px_rgba(0,0,0,0.6)]
          backdrop-blur-2xl
          sm:px-10
          sm:py-12
        "
      >
        {/* CORNERS */}
        <div className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-(--gold)  " />
        <div className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-(--gold)" />
        <div className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-[var(--gold)]" />
        <div className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-[var(--gold)]  " />

        {/* HEADER */}
        <header className="mb-10 text-center">
          <div className="mb-10">
            <Wordmark />
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-5 bg-[rgba(184,154,90,0.4)]" />

            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.4em]
                text-[var(--gold)]
              "
            >
              Accès membre
            </span>

            <div className="h-px w-5 bg-[rgba(184,154,90,0.4)]" />
          </div>

          <h1
            className="
              mt-4
              font-heading
              text-[24px]
              font-medium
              tracking-[-0.01em]
              text-[var(--cream)]
            "
          >
            Entrez dans votre univers
          </h1>
        </header>

        {/* FORM */}
        {registered && (
          <p className="mb-4 text-center text-[12px] text-[var(--gold)]">
            {needsEmailConfirm
              ? "Compte créé. Vérifiez votre email pour confirmer votre inscription."
              : "Compte créé avec succès. Vous pouvez vous connecter."}
          </p>
        )}

        {error && (
          <p className="mb-4 text-center text-[12px] text-red-300">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            label="Mot de passe"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••••"
            value={password}
            onChange={setPassword}
          />

          {/* OPTIONS */}
          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-[10px] tracking-[0.1em] text-[rgba(244,241,231,0.45)]">
              <input
                type="checkbox"
                name="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[var(--gold)]"
              />

              Se souvenir de moi
            </label>

            <Link
              href="/auth/forgot-password"
              className="
                text-[10px]
                uppercase
                tracking-[0.15em]
                text-[var(--gold)]
                opacity-80
                transition-opacity
                hover:opacity-100
              "
            >
              Oublié ?
            </Link>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="
              mt-2
              h-[52px]
              disabled:opacity-60
              rounded-[2px]
              border-0
              bg-[linear-gradient(135deg,#B89A5A_0%,#c9ab6a_50%,#B89A5A_100%)]
              bg-[length:200%_100%]
              text-[11px]
              font-bold
              uppercase
              tracking-[0.3em]
              text-[var(--deep)]
              shadow-[0_8px_30px_rgba(184,154,90,0.3)]
              transition-all
              duration-300
              hover:bg-[position:100%_0]
              hover:shadow-[0_12px_40px_rgba(184,154,90,0.45)]
            "
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>

          <GoldDivider />
        </form>

        {/* FOOTER */}
        <footer className="mt-8 text-center">
          <p className="text-[11px] tracking-[0.08em] text-[rgba(244,241,231,0.35)]">
            Pas encore membre ?{" "}
            <Link
              href="/auth/register"
              className="
                font-medium
                text-[var(--gold)]
                transition-opacity
                hover:opacity-80
              "
            >
              Créer un compte
            </Link>
          </p>
        </footer>
      </section>
    </main>
  );
}