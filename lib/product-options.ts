import type { ProductOption } from "@/lib/products-api";

export type ProductOptionGroup = {
  name: string;
  choices: ProductOption[];
};

export function groupProductOptions(
  options: ProductOption[] = []
): ProductOptionGroup[] {
  const groups = new Map<string, ProductOption[]>();

  for (const option of options) {
    const existing = groups.get(option.name) ?? [];
    existing.push(option);
    groups.set(option.name, existing);
  }

  return Array.from(groups.entries()).map(([name, choices]) => ({
    name,
    choices: choices.sort((a, b) => a.value.localeCompare(b.value, "fr")),
  }));
}

export function buildVariantLabel(
  options: ProductOption[],
  selectedIds: number[]
): string {
  const selected = options.filter((option) => selectedIds.includes(option.id));
  return selected.map((option) => `${option.name}: ${option.value}`).join(" / ");
}

export function computeAdjustedPrice(
  basePrice: number,
  options: ProductOption[],
  selectedIds: number[]
): number {
  const adjustment = options
    .filter((option) => selectedIds.includes(option.id))
    .reduce((sum, option) => sum + Number(option.priceAdjustment ?? 0), 0);
  return Number(basePrice) + adjustment;
}

export function buildCartKey(productId: number, variant?: string): string {
  return variant ? `${productId}:${variant}` : String(productId);
}
