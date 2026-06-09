"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Navbar from "../components/inner/Navbar";
import Sidebar from "../components/inner/Sidebar";
import { useAuth } from "@/lib/auth-context";
import { isAdminUser, isSuperAdminUser } from "@/lib/auth-utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/auth/login?redirect=/admin");
      return;
    }

    if (!isAdminUser(user)) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user || !isAdminUser(user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--cream) text-sm text-(--sage)">
        Chargement…
      </div>
    );
  }

  const isSuperAdmin = isSuperAdminUser(user);

  return (
    <>
      <Navbar onToggleSidebar={() => setMobileOpen((prev) => !prev)} />

      <div className="hidden lg:flex">
        <Sidebar
          isSuperAdmin={isSuperAdmin}
          mobileOpen={false}
          onClose={() => setMobileOpen(false)}
        />
        <main className="flex-1 bg-(--cream) p-6">{children}</main>
      </div>

      <div className="lg:hidden">
        <Sidebar
          isSuperAdmin={isSuperAdmin}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        {!mobileOpen && (
          <main className="bg-(--cream) p-4">{children}</main>
        )}
      </div>
    </>
  );
}
