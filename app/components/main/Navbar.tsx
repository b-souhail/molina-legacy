"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Menu, Search, User, X, } from "lucide-react";
import Cart from "./Cart";

const NAV_LINKS = ["Collections", "Homme", "Femme", "Accessoires", "Nouveautés",];

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

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
              <Link key={link} href="#" className="text-xs uppercase tracking-[0.18em] text-(--forest) hover:text-(--gold) transition-colors font-medium"> {link} </Link>
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
              <Link key={link} href="#" className="text-xs uppercase tracking-[0.18em] text-(--forest) hover:text-(--gold) transition-colors font-medium">
                {link}
              </Link>
            ))}

            <div className="flex items-center gap-5 ml-2">
              <button onClick={() => setSearchOpen((v) => !v)} className="text-(--forest) hover:text-(--gold) transition-colors">
                <Search size={18} strokeWidth={1.7} />
              </button>
              <Link href="/auth/login">
                <button className="text-(--forest) hover:text-(--gold) transition-colors">
                  <User size={18} strokeWidth={1.7} />
                </button>
              </Link>
              <Cart />
            </div>
          </div>

          {/* MOBILE RIGHT */}
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={() => setSearchOpen((v) => !v)} className="text-(--forest)">
              <Search size={19} strokeWidth={1.7} />
            </button>

            <Link href="/auth/login">
              <button className="text-(--forest)">
                <User size={19} strokeWidth={1.7} />
              </button>
            </Link>

            <Cart />

          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="overflow-hidden transition-all duration-500"style={{maxHeight: searchOpen ? "70px" : "0px",opacity: searchOpen ? 1 : 0,}}>
          <div className="pb-5">
            <div className="flex items-center gap-3 border border-(--gold) px-4 py-3">
              <Search size={16} strokeWidth={1.7}className="text-(--gold)"/>
              <input ref={inputRef}type="text"value={query}onChange={(e) => setQuery(e.target.value)}placeholder="Rechercher une pièce..."className=" flex-1 bg-transparent outline-none text-sm tracking-[0.05em] text-(--forest) placeholder:text-(--sage)"/>
              {query && (<button onClick={() => setQuery("")} className="text-(--sage) hover:text-(--forest)">
                  <X size={16} />
                </button>)}
            </div>
          </div>
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
            <Link key={link} href="#" className="text-(--forest) text-lg uppercase tracking-[0.12em] hover:text-(--gold) transition-colors">{link}
            </Link>
          ))}
        </div>
      </div>
      {/* GOLD LINE */}
      <div className="h-px transition-opacity duration-500"style={{background:"linear-gradient(to right, transparent, var(--gold), transparent)", opacity: scrolled ? 1 : 0,}}/>
    </nav>
  );
}