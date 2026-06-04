"use client";

type NavbarProps = {
  onToggleSidebar: () => void;
};

export default function Navbar({onToggleSidebar,}: NavbarProps) {
  return (
    <header >
      <nav className="sticky z-50 h-16 border-b bg-(--forest) text-(--gold)">
      <div className="h-full px-4 flex items-center justify-between">

        <button onClick={onToggleSidebar} className="lg:hidden text-2xl" aria-label="Menu">
          ☰
        </button>

        <div className="hidden lg:block w-10" />

        {/* LOGO */}
        <h1 className="font-semibold tracking-wide">
          MOLINA LEGACY
        </h1>

        <button
          className="text-sm border rounded-md px-3 py-2 hover:bg-(--sage)">
          Logout
        </button>

      </div>
      </nav>
    </header>
  );
}