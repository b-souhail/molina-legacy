const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8081";

export type OrderLineRequest = {
  productId: number;
  quantity: number;
};

export type CreateOrderRequest = {
  items: OrderLineRequest[];
};

export type OrderLineResponse = {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
};

export type OrderResponse = {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  customerEmail?: string;
  customerName?: string;
  lines: OrderLineResponse[];
};

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    return {} as T;
  }
  return JSON.parse(text) as T;
}

export async function createOrder(
  payload: CreateOrderRequest
): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<OrderResponse | { global?: string; message?: string }>(
    res
  );

  if (res.status === 401) {
    throw new Error("CONNECT_REQUIRED");
  }

  if (!res.ok) {
    const err = data as { global?: string; message?: string };
    throw new Error(err.global ?? err.message ?? "Commande impossible");
  }

  return data as OrderResponse;
}

export async function fetchOrders(): Promise<OrderResponse[]> {
  const res = await fetch(`${API_BASE}/api/orders`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Impossible de charger les commandes");
  }

  return parseJson<OrderResponse[]>(res);
}
