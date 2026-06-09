import type { AdminCategory } from "@/lib/admin-catalog-api";

export function isProfession(category: AdminCategory): boolean {
  return category.parentId == null;
}

export function getCategoryPath(
  category: AdminCategory,
  all: AdminCategory[]
): string {
  const parts = [category.name];
  let current = category;

  while (current.parentId != null) {
    const parent = all.find((item) => item.id === current.parentId);
    if (!parent) break;
    parts.unshift(parent.name);
    current = parent;
  }

  return parts.join(" / ");
}

export function getDescendantIds(
  categoryId: number,
  all: AdminCategory[]
): Set<number> {
  const ids = new Set<number>();
  const stack = [categoryId];

  while (stack.length > 0) {
    const current = stack.pop()!;
    all
      .filter((item) => item.parentId === current)
      .forEach((child) => {
        ids.add(child.id);
        stack.push(child.id);
      });
  }

  return ids;
}

export function getParentOptions(
  all: AdminCategory[],
  excludeId?: number
): { id: number; label: string }[] {
  const excluded = new Set<number>();
  if (excludeId != null) {
    excluded.add(excludeId);
    getDescendantIds(excludeId, all).forEach((id) => excluded.add(id));
  }

  return all
    .filter((category) => !excluded.has(category.id))
    .map((category) => ({
      id: category.id,
      label: getCategoryPath(category, all),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "fr"));
}
