const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8081";

export type OrderLineRequest = {
  productId: number;
  quantity: number;
  optionIds?: number[];
};

export type PaymentType = "ESPECES" | "CARTE";

export type CreateOrderRequest = {
  customerName: string;
  customerEmail: string;
  customerTel?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode?: string;
  paymentType: PaymentType;
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
  optionsLabel?: string;
};

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export type OrderResponse = {
  id: number;
  status: OrderStatus;
  total: number;
  createdAt: string;
  customerEmail?: string;
  customerName?: string;
  customerTel?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPostalCode?: string;
  paymentType?: PaymentType;
  lines: OrderLineResponse[];
};

export const paymentTypeLabel = (type?: PaymentType) => {
  if (type === "ESPECES") return "Espèces";
  if (type === "CARTE") return "Carte";
  return "—";
};

export const orderStatusLabel = (status?: OrderStatus | string) => {
  switch (status) {
    case "PENDING":
      return "En attente";
    case "CONFIRMED":
      return "Confirmée";
    case "SHIPPED":
      return "Expédiée";
    case "DELIVERED":
      return "Livrée";
    case "CANCELLED":
      return "Annulée";
    default:
      return status ?? "—";
  }
};

export const orderStatusBadgeClass = (status?: OrderStatus | string) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-800";
    case "CONFIRMED":
      return "bg-blue-50 text-blue-800";
    case "SHIPPED":
      return "bg-indigo-50 text-indigo-800";
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-800";
    case "CANCELLED":
      return "bg-red-50 text-red-800";
    default:
      return "bg-gray-50 text-gray-800";
  }
};

export const formatOrderPrice = (n: number) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
  }).format(n);

export const formatOrderDate = (value: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export type PaymentOrderStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export const PAYMENT_ORDER_STATUSES: PaymentOrderStatus[] = [
  "PENDING",
  "PAID",
  "FAILED",
  "CANCELLED",
];

export type PaymentOrderResponse = {
  id: number;
  orderId: number;
  reference: string;
  amount: number;
  method: PaymentType;
  status: PaymentOrderStatus;
  createdAt: string;
  paidAt?: string;
};

export type FactureResponse = {
  id: number;
  orderId: number;
  invoiceNumber: string;
  amount: number;
  customerName?: string;
  customerEmail?: string;
  customerTel?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPostalCode?: string;
  paymentType?: PaymentType;
  paymentStatus?: PaymentOrderStatus;
  paymentReference?: string;
  issuedAt: string;
  orderCreatedAt: string;
  lines: OrderLineResponse[];
};

export const paymentOrderStatusLabel = (status?: PaymentOrderStatus | string) => {
  switch (status) {
    case "PENDING":
      return "En attente";
    case "PAID":
      return "Payé";
    case "FAILED":
      return "Échoué";
    case "CANCELLED":
      return "Annulé";
    default:
      return status ?? "—";
  }
};

export type OrderSortKey =
  | "date-desc"
  | "date-asc"
  | "total-desc"
  | "total-asc"
  | "id-desc"
  | "id-asc"
  | "customer-asc"
  | "customer-desc"
  | "status-asc";

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

  if (res.status === 401 || res.status === 403) {
    throw new Error("CONNECT_REQUIRED");
  }

  if (!res.ok) {
    throw new Error("Impossible de charger les commandes");
  }

  return parseJson<OrderResponse[]>(res);
}

export async function fetchOrderById(orderId: number): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
    credentials: "include",
  });

  const data = await parseJson<OrderResponse | { global?: string; message?: string }>(
    res
  );

  if (res.status === 401 || res.status === 403) {
    throw new Error("CONNECT_REQUIRED");
  }

  if (res.status === 404) {
    throw new Error("Commande introuvable");
  }

  if (!res.ok) {
    const err = data as { global?: string; message?: string };
    throw new Error(err.global ?? err.message ?? "Impossible de charger la commande");
  }

  return data as OrderResponse;
}

export async function fetchPaymentByOrderId(
  orderId: number
): Promise<PaymentOrderResponse> {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/payment`, {
    credentials: "include",
  });

  const data = await parseJson<
    PaymentOrderResponse | { global?: string; message?: string }
  >(res);

  if (res.status === 401 || res.status === 403) {
    throw new Error("CONNECT_REQUIRED");
  }

  if (res.status === 404) {
    throw new Error("Paiement introuvable");
  }

  if (!res.ok) {
    const err = data as { global?: string; message?: string };
    throw new Error(err.global ?? err.message ?? "Impossible de charger le paiement");
  }

  return data as PaymentOrderResponse;
}

export async function fetchFactureByOrderId(
  orderId: number
): Promise<FactureResponse> {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/facture`, {
    credentials: "include",
  });

  const data = await parseJson<FactureResponse | { global?: string; message?: string }>(
    res
  );

  if (res.status === 401 || res.status === 403) {
    throw new Error("CONNECT_REQUIRED");
  }

  if (res.status === 404) {
    throw new Error("Facture introuvable");
  }

  if (!res.ok) {
    const err = data as { global?: string; message?: string };
    throw new Error(err.global ?? err.message ?? "Impossible de charger la facture");
  }

  return data as FactureResponse;
}

export async function updatePaymentStatus(
  orderId: number,
  status: PaymentOrderStatus
): Promise<PaymentOrderResponse> {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/payment/status`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const data = await parseJson<
    PaymentOrderResponse | { global?: string; message?: string }
  >(res);

  if (res.status === 401 || res.status === 403) {
    throw new Error("CONNECT_REQUIRED");
  }

  if (!res.ok) {
    const err = data as { global?: string; message?: string };
    throw new Error(err.global ?? err.message ?? "Mise à jour impossible");
  }

  return data as PaymentOrderResponse;
}

export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus
): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const data = await parseJson<OrderResponse | { global?: string; message?: string }>(
    res
  );

  if (res.status === 401 || res.status === 403) {
    throw new Error("CONNECT_REQUIRED");
  }

  if (!res.ok) {
    const err = data as { global?: string; message?: string };
    throw new Error(err.global ?? err.message ?? "Mise à jour impossible");
  }

  return data as OrderResponse;
}

export async function fetchMyOrders(): Promise<OrderResponse[]> {
  const res = await fetch(`${API_BASE}/api/orders/me`, {
    credentials: "include",
  });

  if (res.status === 401) {
    throw new Error("CONNECT_REQUIRED");
  }

  if (!res.ok) {
    throw new Error("Impossible de charger vos commandes");
  }

  return parseJson<OrderResponse[]>(res);
}

export async function fetchMyOrderById(
  orderId: number
): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/api/orders/me/${orderId}`, {
    credentials: "include",
  });

  const data = await parseJson<OrderResponse | { global?: string; message?: string }>(
    res
  );

  if (res.status === 401) {
    throw new Error("CONNECT_REQUIRED");
  }

  if (res.status === 403 || res.status === 404) {
    throw new Error("Commande introuvable");
  }

  if (!res.ok) {
    const err = data as { global?: string; message?: string };
    throw new Error(err.global ?? err.message ?? "Impossible de charger la commande");
  }

  return data as OrderResponse;
}
