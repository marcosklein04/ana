import type { Profile, Period, CycleInfo } from "@/types";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json();
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const api = {
  getProfiles: () =>
    request<PaginatedResponse<Profile>>("/profiles/").then((r) => r.results),

  getProfile: (id: number) => request<Profile>(`/profiles/${id}/`),

  createProfile: (data: {
    name: string;
    whatsapp: string;
    last_period_start?: string;
    cycle_length?: number;
    reminders_enabled?: boolean;
  }) => request<Profile>("/profiles/", { method: "POST", body: JSON.stringify(data) }),

  updateProfile: (id: number, data: Partial<Profile>) =>
    request<Profile>(`/profiles/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),

  getPeriods: (profileId: number) =>
    request<Period[]>(`/profiles/${profileId}/periods/`),

  addPeriod: (profileId: number, start_date: string, notes?: string) =>
    request<Period>(`/profiles/${profileId}/periods/`, {
      method: "POST",
      body: JSON.stringify({ start_date, notes }),
    }),

  getNextPeriod: (profileId: number) =>
    request<CycleInfo>(`/profiles/${profileId}/next-period/`),

  sendTestReminder: (profileId: number) =>
    request<unknown>(`/profiles/${profileId}/send-test-reminder/`, { method: "POST" }),
};
