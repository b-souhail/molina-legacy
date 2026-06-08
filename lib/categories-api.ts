import type { Product } from "@/lib/products-api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8081";

export type Category = {
  id: number;
  name: string;
  slug: string;
  children: Category[];
};

export type CategoryPage = {
  id: number;
  name: string;
  slug: string;
  breadcrumbs: Category[];
  children: Category[];
  products: Product[];
};

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    return [] as T;
  }
  return JSON.parse(text) as T;
}

export async function fetchProfessionCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/api/categories/professions`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Impossible de charger les catégories");
  }

  return parseJson<Category[]>(res);
}

export async function fetchCategoryPage(
  slug: string
): Promise<CategoryPage | null> {
  const res = await fetch(
    `${API_BASE}/api/categories/${encodeURIComponent(slug)}`,
    { credentials: "include" }
  );

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Impossible de charger la catégorie");
  }

  return parseJson<CategoryPage>(res);
}

export function categoryAbbr(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
