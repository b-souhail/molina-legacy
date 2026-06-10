const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8081";

export type ProductImagePayload = {
  id?: number;
  url: string;
  principal?: boolean;
  sortOrder?: number;
};

export type ProductOptionPayload = {
  id?: number;
  name: string;
  value: string;
  priceAdjustment?: number;
};

export type AdminProduct = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  imageUrl?: string;
  images?: ProductImagePayload[];
  options?: ProductOptionPayload[];
  categoryId?: number;
  categoryName?: string;
};

export type AdminCategory = {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
  parentName?: string;
  children?: AdminCategory[];
};

export type ProductPayload = {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  imageUrl?: string;
  images?: ProductImagePayload[];
  options?: ProductOptionPayload[];
  categoryId: number;
};

export type CategoryPayload = {
  name: string;
  slug?: string;
  parentId?: number | null;
};

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

async function handleError(res: Response): Promise<never> {
  const err = await parseJson<{ global?: string }>(res);
  throw new Error(err.global ?? "Erreur");
}

export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  const res = await fetch(`${API_BASE}/api/admin/products`, {
    credentials: "include",
  });
  if (res.status === 403) throw new Error("ACCESS_DENIED");
  if (!res.ok) await handleError(res);
  return parseJson<AdminProduct[]>(res);
}

export async function fetchAdminProductById(
  id: number
): Promise<AdminProduct | null> {
  const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
    credentials: "include",
  });
  if (res.status === 404) return null;
  if (res.status === 403) throw new Error("ACCESS_DENIED");
  if (!res.ok) await handleError(res);
  return parseJson<AdminProduct>(res);
}

export async function createAdminProduct(
  payload: ProductPayload
): Promise<AdminProduct> {
  const res = await fetch(`${API_BASE}/api/admin/products`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await handleError(res);
  return parseJson<AdminProduct>(res);
}

export async function updateAdminProduct(
  id: number,
  payload: ProductPayload
): Promise<AdminProduct> {
  const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await handleError(res);
  return parseJson<AdminProduct>(res);
}

export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/admin/uploads/product-image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (res.status === 403) throw new Error("ACCESS_DENIED");
  if (!res.ok) await handleError(res);

  const data = await parseJson<{ url: string }>(res);
  if (!data.url) {
    throw new Error("Réponse d'upload invalide");
  }
  return data.url;
}

export async function deleteAdminProduct(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) await handleError(res);
}

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  const res = await fetch(`${API_BASE}/api/admin/categories`, {
    credentials: "include",
  });
  if (res.status === 403) throw new Error("ACCESS_DENIED");
  if (!res.ok) await handleError(res);
  return parseJson<AdminCategory[]>(res);
}

export async function createAdminCategory(
  payload: CategoryPayload
): Promise<AdminCategory> {
  const res = await fetch(`${API_BASE}/api/admin/categories`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await handleError(res);
  return parseJson<AdminCategory>(res);
}

export async function updateAdminCategory(
  id: number,
  payload: CategoryPayload
): Promise<AdminCategory> {
  const res = await fetch(`${API_BASE}/api/admin/categories/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await handleError(res);
  return parseJson<AdminCategory>(res);
}

export async function deleteAdminCategory(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) await handleError(res);
}
