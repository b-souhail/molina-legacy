"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type SidebarProps = {
  isSuperAdmin: boolean;
  mobileOpen: boolean;
  onClose?: () => void;
};

type SidebarContentProps = {
  isSuperAdmin: boolean;
  onClose?: () => void;
};

export default function Sidebar({
  isSuperAdmin,
  mobileOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      <aside
        className="
          hidden
          lg:flex
          w-72
          bg-(--forest)
          min-h-[calc(100vh-64px)]
        "
      >
        <SidebarContent
          isSuperAdmin={isSuperAdmin}
          onClose={onClose}
        />
      </aside>

      {mobileOpen && (
        <aside
          className="
            lg:hidden
            bg-(--forest)
            min-h-[calc(100vh-64px)]
            w-full
          "
        >
          <SidebarContent
            isSuperAdmin={isSuperAdmin}
            onClose={onClose}
          />
        </aside>
      )}
    </>
  );
}

function SidebarContent({
  isSuperAdmin,
  onClose,
}: SidebarContentProps) {
  const pathname = usePathname();
  const [gestionOpen, setGestionOpen] = useState(true);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleClick = () => {
    onClose?.();
  };

  const linkClass = (href: string) =>
    `text-(--gold) block rounded-md px-3 py-2 transition ${
      isActive(href)
        ? "bg-(--sage) text-(--forest)"
        : "hover:bg-(--sage)"
    }`;

  return (
    <nav className="w-full p-4 space-y-1">
      <Link href="/admin" onClick={handleClick} className={linkClass("/admin")}>
        Accueil
      </Link>

      <button
        onClick={() => setGestionOpen(!gestionOpen)}
        className="w-full flex items-center justify-between rounded-md px-3 py-2 hover:bg-(--sage) text-(--gold)"
      >
        <span>Gestion</span>
        <ChevronDown
          size={16}
          className={gestionOpen ? "rotate-180 transition" : "transition"}
        />
      </button>

      {gestionOpen && (
        <div className="ml-4 border-l pl-3 space-y-1">
          <Link
            href="/admin/professions"
            onClick={handleClick}
            className={linkClass("/admin/professions")}
          >
            Professions
          </Link>

          <Link
            href="/admin/categories"
            onClick={handleClick}
            className={linkClass("/admin/categories")}
          >
            Catégories
          </Link>

          <Link
            href="/admin/produits"
            onClick={handleClick}
            className={linkClass("/admin/produits")}
          >
            Produits
          </Link>

          {isSuperAdmin && (
            <Link
              href="/admin/staff"
              onClick={handleClick}
              className={linkClass("/admin/staff")}
            >
              Personnel
            </Link>
          )}
        </div>
      )}

      <Link
        href="/admin/commandes"
        onClick={handleClick}
        className={linkClass("/admin/commandes")}
      >
        Commandes
      </Link>

      <Link
        href="/admin/parametres"
        onClick={handleClick}
        className={linkClass("/admin/parametres")}
      >
        Paramètres
      </Link>
    </nav>
  );
}