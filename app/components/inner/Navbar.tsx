"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth-context";

type NavbarProps = {
  onToggleSidebar: () => void;
};

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <header>
      <nav className="sticky z-50 h-16 border-b bg-(--forest) text-(--gold)">
        <div className="flex h-full items-center justify-between px-4">
          <button
            onClick={onToggleSidebar}
            className="text-2xl lg:hidden"
            aria-label="Menu"
          >
            ☰
          </button>

          <div className="hidden w-10 lg:block" />

          <h1 className="font-semibold tracking-wide">MOLINA LEGACY</h1>

          <button
            onClick={handleLogout}
            className="rounded-md border px-3 py-2 text-sm transition-colors hover:bg-(--sage) hover:text-(--forest)"
          >
            Déconnexion
          </button>
        </div>
      </nav>
    </header>
  );
}
