"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Menu, Search, User, X } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { isAdminUser } from "@/lib/auth-utils";
import Cart from "./Cart";

const NAV_LINKS = [
  { label: "Collections", href: "/collections" },
  { label: "Architecte", href: "/collections/architecte" },
  { label: "Notaire", href: "/collections/notaire" },
  { label: "Avocat", href: "/collections/avocat" },
  { label: "Nouveautés", href: "/collections?sort=newest" },
];

function UserMenu() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <button className="text-(--forest)">
        <User size={18} strokeWidth={1.7} />
      </button>
    );
  }

  if (!user) {
    return (
      <Link href="/auth/login">
        <button className="text-(--forest) transition-colors hover:text-(--gold)">
          <User size={18} strokeWidth={1.7} />
        </button>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="text-(--forest) transition-colors hover:text-(--gold)"
        aria-label="Menu compte"
      >
        <User size={18} strokeWidth={1.7} />
      </button>

      {open && (
        <>
          <button
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
          />
          <div className="absolute right-0 z-50 mt-3 min-w-44 border border-(--gold)/20 bg-(--cream) py-2 shadow-lg">
            <p className="px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-(--sage)">
              {user.firstName}
            </p>
            {isAdminUser(user) && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-xs text-(--forest) hover:bg-(--gold)/10"
              >
                Administration
              </Link>
            )}
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-xs text-(--forest) hover:bg-(--gold)/10"
            >
              Mon compte
            </Link>
            <Link
              href="/account/orders"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-xs text-(--forest) hover:bg-(--gold)/10"
            >
              Mes commandes
            </Link>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-xs text-(--forest) hover:bg-(--gold)/10"
            >
              Commander
            </Link>
            <button
              onClick={async () => {
                await logout();
                setOpen(false);
                router.push("/");
              }}
              className="block w-full px-4 py-2 text-left text-xs text-(--forest) hover:bg-(--gold)/10"
            >
              Déconnexion
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const submitSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchOpen(false);
    setMobileOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  useEffect(() => { const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
     if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full transition-all duration-500 bg-(--cream)"
      style={{ borderBottom: `1px solid ${scrolled ? "var(--gold)" : "transparent"}`, boxShadow: scrolled ? "0 4px 30px rgba(17,22,19,0.06)" : "none", }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative flex items-center justify-between h-20">
          {/* LEFT DESKTOP */}
          <div className="hidden lg:flex items-center gap-8 flex-1">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <Link key={link.href} href={link.href} className="text-xs uppercase tracking-[0.18em] text-(--forest) hover:text-(--gold) transition-colors font-medium">
                {link.label}
              </Link>
            ))}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setMobileOpen(true)} className="text-(--forest) hover:text-(--gold) transition-colors">
              <Menu size={22} strokeWidth={1.7} />
            </button>
          </div>


          {/* CENTER LOGO */}
          <div
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <Link href="/">
              <Image src="/molina-logo.png" alt="Molina Legacy" width={130} height={40} priority className="object-contain" />
            </Link>
          </div>

          {/* RIGHT DESKTOP */}
          <div className="hidden lg:flex items-center justify-end gap-8 flex-1">
            {NAV_LINKS.slice(3).map((link) => (
              <Link key={link.href} href={link.href} className="text-xs uppercase tracking-[0.18em] text-(--forest) hover:text-(--gold) transition-colors font-medium">
                {link.label}
              </Link>
            ))}

            <div className="flex items-center gap-5 ml-2">
              <button onClick={() => setSearchOpen((v) => !v)} className="text-(--forest) hover:text-(--gold) transition-colors">
                <Search size={18} strokeWidth={1.7} />
              </button>
              <UserMenu />
              <Cart />
            </div>
          </div>

          {/* MOBILE RIGHT */}
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={() => setSearchOpen((v) => !v)} className="text-(--forest)">
              <Search size={19} strokeWidth={1.7} />
            </button>

            <UserMenu />

            <Cart />

          </div>
        </div>

        {/* SEARCH BAR */}
        <div
          className="overflow-hidden transition-all duration-500"
          style={{
            maxHeight: searchOpen ? "70px" : "0px",
            opacity: searchOpen ? 1 : 0,
          }}
        >
          <form
            className="pb-5"
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch();
            }}
          >
            <div className="flex items-center gap-3 border border-(--gold) px-4 py-3">
              <Search size={16} strokeWidth={1.7} className="text-(--gold)" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une pièce..."
                className="flex-1 bg-transparent text-sm tracking-[0.05em] text-(--forest) outline-none placeholder:text-(--sage)"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-(--sage) hover:text-(--forest)"
                  aria-label="Effacer la recherche"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-100 bg-(--cream) transition-transform duration-500 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`} >
        <div className="flex items-center justify-between px-6 h-20 border-b border-(--gold)">
          <span className="text-sm uppercase tracking-[0.2em] text-(--forest)">Menu</span>
          <button onClick={() => setMobileOpen(false)}className="text-(--forest)">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col px-6 py-10 gap-8">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="text-(--forest) text-lg uppercase tracking-[0.12em] hover:text-(--gold) transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      {/* GOLD LINE */}
      <div className="h-px transition-opacity duration-500"style={{background:"linear-gradient(to right, transparent, var(--gold), transparent)", opacity: scrolled ? 1 : 0,}}/>
    </nav>
  );
}