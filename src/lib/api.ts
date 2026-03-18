/// <reference path="../types/fake-env.d.ts" />
// const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL ?? "https://wc26-api.onrender.com/api";
const API_BASE_URL = (typeof window !== 'undefined' && window.__FAKE_ENV__?.VITE_PUBLIC_API_URL) 
  ? window.__FAKE_ENV__.VITE_PUBLIC_API_URL 
  : "https://wc26-api.onrender.com/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jwtToken");
}

function getAuthHeaders() {
  const token = getToken();
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
    ...getAuthHeaders(),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || "Request failed");
    (err as any).status = res.status;
    (err as any).payload = data;
    throw err;
  }

  return data;
}

export async function login(email: string, password: string) {
  return request<{ jwtToken: string; _id?: string; role?: string; balance?: number; packsRemaining?: number; collectedCardIds?: number[] }>(
    "/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }
  );
}

export async function register(email: string, firstName: string, password: string) {
  return request<{ success: boolean; message: string; userId?: string }>(
    "/user",
    {
      method: "POST",
      body: JSON.stringify({ email, firstName, password }),
    }
  );
}

export async function getCurrentUser(userId: string) {
  return request<any>(`/user/${userId}`);
}

export async function updateUser(userId: string, updates: Record<string, any>) {
  return request<any>(`/user/${userId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function getPlayerCards() {
  return request<any[]>("/playercards");
}

export async function getTeams() {
  return request<any[]>("/teams");
}

export async function getUserPredictions(email: string) {
  return request<any>(`/predictions/${encodeURIComponent(email)}`);
}

export async function savePredictions(predictions: any[]) {
  return request<any>("/predictions", {
    method: "POST",
    body: JSON.stringify({ predictions }),
  });
}
