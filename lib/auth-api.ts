const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8081";

export type UserResponse = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  tel?: string;
  enabled: boolean;
  roles: string[];
  redirectPath: string;
};

export type ApiError = Record<string, string>;

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    return {} as T;
  }
  return JSON.parse(text) as T;
}

export async function login(
  email: string,
  password: string,
  verificationCode?: string
): Promise<UserResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, verificationCode }),
  });

  const data = await parseJson<UserResponse | ApiError>(res);

  if (!res.ok) {
    const err = data as ApiError;
    throw new Error(err.global ?? err.email ?? "Connexion impossible");
  }

  return data as UserResponse;
}

export async function register(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  matchPassword: string;
  tel?: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<ApiError>(res);

  if (!res.ok) {
    const firstError =
      data.global ??
      data.email ??
      data.password ??
      data.firstName ??
      data.lastName ??
      data.matchPassword ??
      "Inscription impossible";
    throw new Error(firstError);
  }
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function getCurrentUser(): Promise<UserResponse | null> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    credentials: "include",
  });

  if (res.status === 401) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Impossible de récupérer la session");
  }

  return parseJson<UserResponse>(res);
}

export async function confirmRegistration(
  token: string
): Promise<UserResponse> {
  const res = await fetch(
    `${API_BASE}/api/auth/confirm?token=${encodeURIComponent(token)}`,
    { credentials: "include" }
  );

  const data = await parseJson<UserResponse | ApiError>(res);

  if (!res.ok) {
    const err = data as ApiError;
    throw new Error(err.status ?? err.global ?? "Confirmation invalide");
  }

  return data as UserResponse;
}
