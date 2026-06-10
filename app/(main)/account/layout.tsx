"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/lib/auth-context";

const LINKS = [
  { href: "/account", label: "Profil" },
  { href: "/account/favorites", label: "Favoris" },
  { href: "/account/addresses", label: "Adresses" },
  { href: "/account/password", label: "Mot de passe" },
  { href: "/account/orders", label: "Mes commandes" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-(--cream) text-sm text-(--sage)">
        Chargement du compte…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--cream) px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-heading text-3xl text-(--forest) md:text-4xl">
          Mon compte
        </h1>
        <p className="mt-2 text-sm text-(--sage)">
          Bonjour {user.firstName}, gérez vos informations personnelles.
        </p>

        <nav className="mt-8 flex flex-wrap gap-2 border-b border-(--gold)/20 pb-4">
          {LINKS.map((link) => {
            const active =
              link.href === "/account"
                ? pathname === "/account"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-[10px] uppercase tracking-[0.22em] ${
                  active
                    ? "bg-(--forest) text-(--gold)"
                    : "border border-(--forest)/15 text-(--forest) hover:border-(--forest)"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
