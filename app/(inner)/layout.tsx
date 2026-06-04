"use client";

import { useState } from "react";

import Navbar from "../components/inner/Navbar";
import Sidebar from "../components/inner/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode;}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <Navbar onToggleSidebar={() =>setMobileOpen((prev) => !prev)}/>

      {/* DESKTOP */}
      <div className="hidden lg:flex"> <Sidebar isSuperAdmin={true} mobileOpen={false} onClose={() => setMobileOpen(false)}/>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      {/* MOBILE */}
      <div className="lg:hidden">
        <Sidebar isSuperAdmin={true} mobileOpen={mobileOpen}onClose={() => setMobileOpen(false)} />
        {!mobileOpen && (
          <main className="p-4">
            {children}
          </main>
        )}
      </div>
    </>
  );
}