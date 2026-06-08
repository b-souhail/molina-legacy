"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronRight } from "lucide-react";

import {
  categoryAbbr,
  fetchProfessionCategories,
  type Category,
} from "@/lib/categories-api";

type MenuPosition = {
  top: number;
  left: number;
};

function SubmenuPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        min-w-[9.5rem]
        overflow-hidden
        border
        border-(--forest)/12
        bg-(--cream)
        shadow-[0_8px_28px_rgba(17,22,19,0.14)]
      "
    >
      <div className="h-px bg-linear-to-r from-transparent via-(--gold) to-transparent" />
      <ul className="py-1">{children}</ul>
      <div className="h-px bg-linear-to-r from-transparent via-(--gold)/40 to-transparent" />
    </div>
  );
}

function CategoryMenuItem({ item }: { item: Category }) {
  const children = item.children ?? [];
  const hasChildren = children.length > 0;
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openFlyout = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setFlyoutOpen(true);
  };

  const scheduleFlyoutClose = () => {
    closeTimer.current = setTimeout(() => setFlyoutOpen(false), 120);
  };

  if (!hasChildren) {
    return (
      <li>
        <Link
          href={`/collections/${item.slug}`}
          className="
            block
            px-4
            py-2
            text-[9px]
            uppercase
            tracking-[0.16em]
            text-(--forest)/70
            transition-all
            duration-200
            hover:bg-(--gold)/8
            hover:pl-5
            hover:text-(--forest)
          "
        >
          {item.name}
        </Link>
      </li>
    );
  }

  return (
    <li
      className="relative"
      onMouseEnter={openFlyout}
      onMouseLeave={scheduleFlyoutClose}
    >
      <Link
        href={`/collections/${item.slug}`}
        className="
          flex
          items-center
          justify-between
          gap-3
          px-4
          py-2
          text-[9px]
          uppercase
          tracking-[0.16em]
          text-(--forest)/80
          transition-all
          duration-200
          hover:bg-(--gold)/8
          hover:pl-5
          hover:text-(--forest)
        "
      >
        <span className="truncate">{item.name}</span>
        <ChevronRight
          size={11}
          strokeWidth={1.75}
          className="shrink-0 text-(--gold)/80"
        />
      </Link>

      {flyoutOpen && (
        <div
          className="absolute left-full top-0 z-10 pl-1.5"
          onMouseEnter={openFlyout}
          onMouseLeave={scheduleFlyoutClose}
        >
          <SubmenuPanel>
            {children.map((child) => (
              <CategoryMenuItem key={child.id} item={child} />
            ))}
          </SubmenuPanel>
        </div>
      )}
    </li>
  );
}

function CategoryMenuItems({ items }: { items: Category[] }) {
  return (
    <>
      {items.map((item) => (
        <CategoryMenuItem key={item.id} item={item} />
      ))}
    </>
  );
}

export default function ProfessionStrip() {
  const [professions, setProfessions] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProfession, setActiveProfession] = useState<Category | null>(
    null
  );
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [mounted, setMounted] = useState(false);

  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchProfessionCategories()
      .then(setProfessions)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const updateMenuPosition = useCallback((professionId: number) => {
    const element = itemRefs.current.get(professionId);
    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 6,
      left: rect.left + rect.width / 2,
    });
  }, []);

  const openSubmenu = (profession: Category) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    const children = profession.children ?? [];
    if (children.length === 0) {
      setActiveProfession(null);
      setMenuPosition(null);
      return;
    }

    setActiveProfession(profession);
    updateMenuPosition(profession.id);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => {
      setActiveProfession(null);
      setMenuPosition(null);
    }, 150);
  };

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  useEffect(() => {
    if (!activeProfession) {
      return;
    }

    const reposition = () => updateMenuPosition(activeProfession.id);
    const close = () => {
      setActiveProfession(null);
      setMenuPosition(null);
    };

    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", reposition);

    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", reposition);
    };
  }, [activeProfession, updateMenuPosition]);

  const hasProfessions = professions.length > 0;
  const activeChildren = activeProfession?.children ?? [];

  const dropdown =
    mounted &&
    activeProfession &&
    menuPosition &&
    activeChildren.length > 0 &&
    createPortal(
      <div
        className="fixed z-[200] -translate-x-1/2 pt-2"
        style={{ top: menuPosition.top - 8, left: menuPosition.left }}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <div
          className="
            relative
            min-w-[9.5rem]
            overflow-visible
            border
            border-(--forest)/12
            bg-(--cream)
            shadow-[0_8px_28px_rgba(17,22,19,0.14)]
          "
        >
          <div className="h-px bg-linear-to-r from-transparent via-(--gold) to-transparent" />

          <ul className="overflow-visible py-1">
            <CategoryMenuItems items={activeChildren} />
          </ul>

          <div className="h-px bg-linear-to-r from-transparent via-(--gold)/40 to-transparent" />
        </div>
      </div>,
      document.body
    );

  return (
    <section className="relative z-30 bg-(--gold) px-3 py-2">
      <div className="max-w-7xl mx-auto">
        <div
          className="
            relative
            border
            border-(--forest)/15
            bg-(--cream)/35
            backdrop-blur-sm
            px-3
            py-3
          "
        >
          <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-(--forest)" />
          <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-(--forest)" />
          <span className="absolute left-0 bottom-0 h-4 w-4 border-l border-b border-(--forest)" />
          <span className="absolute right-0 bottom-0 h-4 w-4 border-r border-b border-(--forest)" />

          <div className="absolute top-0 left-8 right-8 h-px bg-(--forest)/15" />
          <div className="absolute bottom-0 left-8 right-8 h-px bg-(--forest)/15" />

          <div
            className="
              flex
              items-center
              justify-center
              gap-6
              md:gap-10
              overflow-x-auto
              scrollbar-hide
              py-1
            "
          >
            {loading ? (
              <span className="text-[10px] uppercase tracking-[0.18em] text-(--forest)/60">
                Chargement...
              </span>
            ) : error ? (
              <span className="text-[10px] uppercase tracking-[0.18em] text-(--forest)/60">
                {error}
              </span>
            ) : !hasProfessions ? (
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-14
                    h-14
                    rounded-full
                    border
                    border-(--forest)/20
                    bg-(--cream)
                  "
                >
                  <Image
                    src="/molina-logo.png"
                    alt="Molina Legacy"
                    width={34}
                    height={34}
                    className="object-contain"
                  />
                </div>
                <span
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.18em]
                    text-(--forest)
                    whitespace-nowrap
                  "
                >
                  Molina Legacy
                </span>
              </div>
            ) : (
              professions.map((profession) => {
                const isActive = activeProfession?.id === profession.id;
                const hasChildren = (profession.children ?? []).length > 0;

                return (
                  <div
                    key={profession.id}
                    ref={(node) => {
                      if (node) {
                        itemRefs.current.set(profession.id, node);
                      } else {
                        itemRefs.current.delete(profession.id);
                      }
                    }}
                    className="relative shrink-0"
                    onMouseEnter={() => openSubmenu(profession)}
                    onMouseLeave={scheduleClose}
                  >
                    <Link
                      href={`/collections/${profession.slug}`}
                      className="group flex flex-col items-center gap-1.5"
                      aria-expanded={isActive}
                      aria-haspopup={hasChildren}
                    >
                      <div
                        className={`
                          p-[2px]
                          rounded-full
                          border
                          transition-all
                          duration-500
                          ${isActive ? "border-(--gold)/60" : "border-transparent group-hover:border-(--forest)/25"}
                        `}
                      >
                        <div
                          className="
                            relative
                            flex
                            items-center
                            justify-center
                            w-12
                            h-12
                            md:w-14
                            md:h-14
                            rounded-full
                            border
                            border-(--forest)/20
                            bg-(--cream)
                            transition-all
                            duration-500
                            group-hover:scale-105
                          "
                        >
                          <span
                            className="
                              text-xs
                              md:text-sm
                              font-semibold
                              tracking-[0.14em]
                              text-(--forest)
                            "
                          >
                            {categoryAbbr(profession.name)}
                          </span>

                          <span
                            className="
                              absolute
                              inset-1
                              rounded-full
                              border
                              border-(--gold)
                              opacity-0
                              group-hover:opacity-100
                              transition-opacity
                              duration-500
                            "
                          />
                        </div>
                      </div>

                      <span
                        className={`
                          text-[8px]
                          md:text-[9px]
                          uppercase
                          tracking-[0.18em]
                          whitespace-nowrap
                          transition-colors
                          duration-300
                          ${isActive ? "text-(--forest)" : "text-(--forest)/70 group-hover:text-(--forest)"}
                        `}
                      >
                        {profession.name}
                      </span>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {dropdown}
    </section>
  );
}
