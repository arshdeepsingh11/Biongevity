/**
 * /admin ↔ forms Worker (deploy/forms). The browser only ever holds a short-lived session token,
 * kept in sessionStorage so it is gone when the tab closes. Every check happens in the Worker.
 */
import { env } from "@/lib/env";
import { buildXlsx } from "@/lib/xlsx";

export interface StoredEnquiry { id: number; created_at: string; name: string; email: string; phone: string; interest: string; message: string; routed: string }

const KEY = "biongevity.admin.session";
export const adminEnabled = Boolean(env.formsUrl);

export function loadSession(): string | null {
  try {
    const s = JSON.parse(sessionStorage.getItem(KEY) || "null") as { token: string; exp: number } | null;
    return s && s.exp > Date.now() ? s.token : null;
  } catch {
    return null;
  }
}
export function clearSession() {
  try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
}

async function call(path: string, init: RequestInit) {
  let r: Response;
  try {
    r = await fetch(`${env.formsUrl}${path}`, { ...init, cache: "no-store" });
  } catch {
    return { status: 0, data: { error: "Can't reach the server — check your connection." } };
  }
  const data = await r.json().catch(() => ({}));
  return { status: r.status, data };
}

/** Signs in. Returns null on success, or a message to show. */
export async function signIn(username: string, password: string, code: string): Promise<string | null> {
  const { status, data } = await call("/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, code }),
  });
  if (status === 200 && data.token) {
    try { sessionStorage.setItem(KEY, JSON.stringify({ token: data.token, exp: data.exp })); } catch { /* ignore */ }
    return null;
  }
  return data.error || "Sign-in failed — try again.";
}

/** Saved enquiries, newest first. "expired" means sign in again. */
export async function getEnquiries(token: string): Promise<StoredEnquiry[] | "expired" | { error: string }> {
  const { status, data } = await call("/admin/enquiries", { method: "GET", headers: { Authorization: `Bearer ${token}` } });
  if (status === 401) return "expired";
  if (status !== 200) return { error: data.error || "Couldn't load enquiries." };
  return data.enquiries as StoredEnquiry[];
}

/** "10 Nov 2026, 19:42" in the viewer's own time zone. */
export const when = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const COLUMNS: [string, number, (e: StoredEnquiry) => string][] = [
  ["Date", 20, (e) => when(e.created_at)],
  ["Name", 24, (e) => e.name],
  ["Email", 30, (e) => e.email],
  ["Phone", 18, (e) => e.phone],
  ["Interested in", 28, (e) => e.interest],
  ["Message", 60, (e) => e.message],
  ["Suggested team", 24, (e) => e.routed],
];

/** Downloads the given enquiries as an Excel file. */
export function downloadExcel(rows: StoredEnquiry[]) {
  const bytes = buildXlsx(COLUMNS.map((c) => c[0]), rows.map((e) => COLUMNS.map((c) => c[2](e))), { sheet: "Enquiries", widths: COLUMNS.map((c) => c[1]) });
  const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `biongevity-enquiries-${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
