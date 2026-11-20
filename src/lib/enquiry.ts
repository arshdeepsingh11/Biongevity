/** Contact enquiries: POST to the configured endpoint, or fall back to a pre-filled email. */
export interface Enquiry { name: string; email: string; phone: string; interest: string; msg: string; routed: string }

/** Pre-filled email to the care team. Body is kept short: some mail apps cut long mailto links. */
export function mailtoUrl(e: Enquiry, to: string) {
  const body = [`Name: ${e.name}`, `Email: ${e.email}`, e.phone && `Phone: ${e.phone}`, `Interest: ${e.interest}`, "", e.msg.slice(0, 1500)].filter((l) => l !== "").join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(`Enquiry: ${e.interest}`)}&body=${encodeURIComponent(body)}`;
}

/**
 * "sent"   → the endpoint accepted it (2xx)
 * "mailed" → no endpoint configured; the visitor's email app was opened instead
 * "error"  → endpoint rejected it, timed out or was unreachable
 */
export async function submitEnquiry(e: Enquiry, endpoint: string, fallbackTo: string, timeoutMs = 15_000): Promise<"sent" | "mailed" | "error"> {
  if (!endpoint) {
    window.location.href = mailtoUrl(e, fallbackTo);
    return "mailed";
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e), signal: ctrl.signal });
    return r.ok ? "sent" : "error";
  } catch {
    return "error";
  } finally {
    clearTimeout(timer);
  }
}
