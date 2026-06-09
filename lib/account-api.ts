import type { UserResponse } from "@/lib/auth-api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8081";

export type UserAddress = {
  id: number;
  label?: string;
  address: string;
  city: string;
  postalCode: string;
  defaultAddress: boolean;
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

export async function fetchProfile(): Promise<UserResponse> {
  const res = await fetch(`${API_BASE}/api/account/profile`, {
    credentials: "include",
  });
  if (res.status === 401) throw new Error("CONNECT_REQUIRED");
  if (!res.ok) await handleError(res);
  return parseJson<UserResponse>(res);
}

export async function updateProfile(payload: {
  firstName: string;
  lastName: string;
  email: string;
  tel?: string;
}): Promise<UserResponse> {
  const res = await fetch(`${API_BASE}/api/account/profile`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await handleError(res);
  return parseJson<UserResponse>(res);
}

export async function changePassword(payload: {
  oldPassword: string;
  newPassword: string;
  matchPassword: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/api/account/change-password`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await handleError(res);
}

export async function fetchAddresses(): Promise<UserAddress[]> {
  const res = await fetch(`${API_BASE}/api/account/addresses`, {
    credentials: "include",
  });
  if (res.status === 401) throw new Error("CONNECT_REQUIRED");
  if (!res.ok) await handleError(res);
  return parseJson<UserAddress[]>(res);
}

export async function createAddress(
  payload: Omit<UserAddress, "id">
): Promise<UserAddress> {
  const res = await fetch(`${API_BASE}/api/account/addresses`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await handleError(res);
  return parseJson<UserAddress>(res);
}

export async function updateAddress(
  id: number,
  payload: Omit<UserAddress, "id">
): Promise<UserAddress> {
  const res = await fetch(`${API_BASE}/api/account/addresses/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await handleError(res);
  return parseJson<UserAddress>(res);
}

export async function deleteAddress(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/account/addresses/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) await handleError(res);
}
