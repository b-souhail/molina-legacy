const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8081";

export type ProductImage = {
  id?: number;
  url: string;
  principal: boolean;
  sortOrder: number;
};

export type ProductOption = {
  id: number;
  name: string;
  value: string;
  priceAdjustment: number;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  imageUrl: string;
  images?: ProductImage[];
  options?: ProductOption[];
};

export type ProductSort =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest";

export type PagedProducts = {
  items: Product[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
};

export type ProductQuery = {
  page?: number;
  size?: number;
  sort?: ProductSort;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
};

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    return [] as T;
  }
  return JSON.parse(text) as T;
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/products`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Impossible de charger les produits");
  }

  return parseJson<Product[]>(res);
}

function buildProductQuery(params: ProductQuery): string {
  const search = new URLSearchParams();
  if (params.page != null) search.set("page", String(params.page));
  if (params.size != null) search.set("size", String(params.size));
  if (params.sort) search.set("sort", params.sort);
  if (params.categorySlug) search.set("categorySlug", params.categorySlug);
  if (params.minPrice != null) search.set("minPrice", String(params.minPrice));
  if (params.maxPrice != null) search.set("maxPrice", String(params.maxPrice));
  const q = search.toString();
  return q ? `?${q}` : "";
}

export async function fetchProductsPaged(
  params: ProductQuery = {}
): Promise<PagedProducts> {
  const res = await fetch(
    `${API_BASE}/api/products${buildProductQuery({
      page: params.page ?? 0,
      size: params.size ?? 12,
      sort: params.sort ?? "name-asc",
      categorySlug: params.categorySlug,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
    })}`,
    { credentials: "include" }
  );

  if (!res.ok) {
    throw new Error("Impossible de charger les produits");
  }

  return parseJson<PagedProducts>(res);
}

export async function fetchPopularProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/products/popular`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Impossible de charger les produits populaires");
  }

  return parseJson<Product[]>(res);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) {
    return [];
  }

  const res = await fetch(
    `${API_BASE}/api/products/search?q=${encodeURIComponent(q)}`,
    { credentials: "include" }
  );

  if (!res.ok) {
    throw new Error("Impossible de rechercher les produits");
  }

  return parseJson<Product[]>(res);
}

export async function fetchProductBySlug(
  slug: string
): Promise<Product | null> {
  const res = await fetch(
    `${API_BASE}/api/products/${encodeURIComponent(slug)}`,
    { credentials: "include" }
  );

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Impossible de charger le produit");
  }

  return parseJson<Product>(res);
}
