"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

import type { AdminCategory } from "@/lib/admin-catalog-api";
import { getParentOptions } from "@/lib/admin-catalog-utils";

type CategoryParentAutocompleteProps = {
  categories: AdminCategory[];
  value: number | null;
  onChange: (parentId: number | null) => void;
  excludeId?: number;
  required?: boolean;
  placeholder?: string;
  label?: string;
};

export function CategoryParentAutocomplete({
  categories,
  value,
  onChange,
  excludeId,
  required = false,
  placeholder = "Rechercher une catégorie parente…",
  label = "Catégorie parente",
}: CategoryParentAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const options = useMemo(
    () => getParentOptions(categories, excludeId),
    [categories, excludeId]
  );

  const selectedLabel =
    options.find((option) => option.id === value)?.label ?? "";

  const [query, setQuery] = useState(selectedLabel);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQuery(selectedLabel);
  }, [selectedLabel]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setQuery(selectedLabel);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedLabel]);

  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleSelect = (id: number, label: string) => {
    onChange(id);
    setQuery(label);
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative md:col-span-2">
      <label className="block text-sm text-(--forest)">
        {label}
        <div className="relative mt-1">
          <input
            type="text"
            value={query}
            required={required && value == null}
            placeholder={placeholder}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              if (!e.target.value.trim()) {
                onChange(null);
              }
            }}
            onFocus={() => setOpen(true)}
            className="w-full border border-(--forest)/15 bg-white px-3 py-2 pr-10"
            autoComplete="off"
          />
          {value != null && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-(--sage) hover:text-(--forest)"
              aria-label="Effacer la sélection"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </label>

      {open && (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto border border-(--gold)/25 bg-white shadow-lg">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-(--sage)">Aucun résultat</li>
          ) : (
            filtered.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.id, option.label)}
                  className={`block w-full px-3 py-2 text-left text-sm hover:bg-(--gold)/10 ${
                    value === option.id
                      ? "bg-(--gold)/15 text-(--forest)"
                      : "text-(--forest)"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
