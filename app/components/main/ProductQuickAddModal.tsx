"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import { useCart } from "@/lib/cart-context";
import { resolveProductImageUrl } from "@/lib/image-url";
import {
  buildVariantLabel,
  computeAdjustedPrice,
  groupProductOptions,
} from "@/lib/product-options";
import type { Product } from "@/lib/products-api";

type ProductQuickAddModalProps = {
  product: Product;
  onClose: () => void;
};

export function ProductQuickAddModal({
  product,
  onClose,
}: ProductQuickAddModalProps) {
  const { addItem } = useCart();
  const [selectedOptionIds, setSelectedOptionIds] = useState<number[]>([]);
  const [optionError, setOptionError] = useState<string | null>(null);

  const optionGroups = useMemo(
    () => groupProductOptions(product.options ?? []),
    [product.options]
  );

  const displayPrice = useMemo(
    () =>
      computeAdjustedPrice(
        product.price,
        product.options ?? [],
        selectedOptionIds
      ),
    [product, selectedOptionIds]
  );

  useEffect(() => {
    const defaults = groupProductOptions(product.options ?? [])
      .map((group) => group.choices[0]?.id)
      .filter((id): id is number => id != null);
    setSelectedOptionIds(defaults);
    setOptionError(null);
  }, [product]);

  const selectOption = (groupName: string, optionId: number) => {
    const group = optionGroups.find((entry) => entry.name === groupName);
    if (!group) return;

    const groupOptionIds = group.choices.map((choice) => choice.id);
    setSelectedOptionIds((current) => [
      ...current.filter((id) => !groupOptionIds.includes(id)),
      optionId,
    ]);
    setOptionError(null);
  };

  const handleAdd = () => {
    for (const group of optionGroups) {
      const hasSelection = group.choices.some((choice) =>
        selectedOptionIds.includes(choice.id)
      );
      if (!hasSelection) {
        setOptionError(`Choisissez une option : ${group.name}`);
        return;
      }
    }

    const allOptions = product.options ?? [];
    const variant = buildVariantLabel(allOptions, selectedOptionIds);

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: displayPrice,
      imageUrl: product.imageUrl,
      variant: variant || undefined,
      selectedOptionIds:
        selectedOptionIds.length > 0 ? selectedOptionIds : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-(--forest)/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Fermer"
      />
      <div className="relative z-10 w-full max-w-md border border-(--gold)/25 bg-(--cream) p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-(--sage) hover:text-(--forest)"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>

        <div className="flex gap-4">
          <div className="relative h-24 w-20 shrink-0 overflow-hidden border border-(--gold)/20">
            <Image
              src={resolveProductImageUrl(product.imageUrl)}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="pr-8 font-heading text-lg text-(--forest)">
              {product.name}
            </p>
            <p className="mt-1 font-heading text-xl text-(--gold)">
              {displayPrice.toFixed(0)} MAD
            </p>
          </div>
        </div>

        {optionGroups.length > 0 && (
          <div className="mt-6 space-y-4">
            {optionGroups.map((group) => (
              <div key={group.name}>
                <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-(--forest)">
                  {group.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.choices.map((choice) => {
                    const selected = selectedOptionIds.includes(choice.id);
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => selectOption(group.name, choice.id)}
                        className={`border px-3 py-1.5 text-xs transition-colors ${
                          selected
                            ? "border-(--gold) bg-(--gold)/10 text-(--forest)"
                            : "border-(--gold)/25 text-(--forest)/80 hover:border-(--gold)"
                        }`}
                      >
                        {choice.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {optionError && (
              <p className="text-sm text-red-600">{optionError}</p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleAdd}
          className="mt-6 h-12 w-full bg-(--gold) text-[10px] font-bold uppercase tracking-[0.28em] text-(--deep) transition-opacity hover:opacity-90"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
