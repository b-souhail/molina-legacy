const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8081";

export type Product = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  imageUrl: string;
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
