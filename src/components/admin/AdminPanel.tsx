"use client";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { adminEnabled, clearSession, downloadExcel, getEnquiries, loadSession, signIn, when, type StoredEnquiry } from "@/lib/admin";

const field = "mt-1.5 h-12 w-full rounded-2xl border border-ink/10 bg-canvas px-4 text-[15px] outline-none focus:border-violet focus:bg-surface";

/** /admin — sign in with username, password and a Google Authenticator code, then read contact enquiries (view only). */
export function AdminPanel() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setToken(loadSession()); setReady(true); }, []);

  if (!adminEnabled) {
    return (
      <Card>
        <h1 className="text-[22px] font-semibold">Admin isn&apos;t set up yet</h1>
        <p className="mt-2 text-[14.5px] text-muted">Set <code className="rounded bg-canvas px-1.5 py-0.5 text-[13px]">NEXT_PUBLIC_FORMS_URL</code> to the forms Worker and rebuild. See docs/ADMIN_FORMS.md.</p>
      </Card>
    );
  }
  if (!ready) return null;
  return token ? <Enquiries token={token} onSignOut={() => { clearSession(); setToken(null); }} /> : <SignIn onDone={() => setToken(loadSession())} />;
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-[420px] rounded-[28px] bg-surface p-6 shadow-card ring-1 ring-ink/[0.06] sm:p-8">{children}</div>;
}

function SignIn({ onDone }: { onDone: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    const err = await signIn(username.trim(), password, code);
    setBusy(false);
    if (err) { setError(err); setCode(""); } else onDone();
  };

  return (
    <Card>
      <span className="icon-tile grid h-11 w-11 place-items-center rounded-2xl"><Icon name="lock" size={20} /></span>
      <h1 className="mt-4 text-[24px] font-semibold tracking-tight">Admin sign-in</h1>
      <p className="mt-1 text-[14px] text-muted">Contact enquiries. You&apos;ll need the code from Google Authenticator.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-[14px] font-medium">Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoCapitalize="none" spellCheck={false} required className={field} />
        </label>
        <label className="block text-[14px] font-medium">Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required className={field} />
        </label>
        <label className="block text-[14px] font-medium">6-digit code
          <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" required
            placeholder="123456" className={`${field} font-mono tracking-[0.35em]`} />
          <span className="mt-1 block text-[12.5px] text-faint">From the Google Authenticator app · changes every 30 seconds</span>
        </label>
        {error && <p role="alert" className="rounded-2xl bg-warn/10 px-4 py-3 text-[13.5px] text-warn">{error}</p>}
        <button type="submit" disabled={busy || code.length !== 6} className="btn-dark w-full justify-center disabled:opacity-60">{busy ? "Checking…" : "Sign in"}</button>
      </form>
    </Card>
  );
}

function Enquiries({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const [rows, setRows] = useState<StoredEnquiry[] | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const r = await getEnquiries(token);
    setLoading(false);
    if (r === "expired") return onSignOut();
    if ("error" in r) return setError(r.error);
    setRows(r);
  }, [token, onSignOut]);
  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!rows || !s) return rows ?? [];
    return rows.filter((e) => [e.name, e.email, e.phone, e.interest, e.message, e.routed].some((v) => v.toLowerCase().includes(s)));
  }, [rows, q]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[26px] font-semibold tracking-tight sm:text-[30px]">Contact enquiries</h1>
          <p className="mt-1 text-[14px] text-muted">
            {rows ? `${rows.length} ${rows.length === 1 ? "enquiry" : "enquiries"}${q && shown.length !== rows.length ? ` · ${shown.length} shown` : ""} · newest first · view only` : "Loading…"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={load} disabled={loading} className="btn-light h-10 px-4 text-[13.5px]"><Icon name="reset" size={15} className={loading ? "animate-spin" : ""} />Refresh</button>
          <button onClick={() => downloadExcel(shown)} disabled={!shown.length} className="btn-dark h-10 px-4 text-[13.5px] disabled:opacity-50"><Icon name="file" size={15} />Download Excel</button>
          <button onClick={onSignOut} className="h-10 rounded-full px-3 text-[13.5px] font-medium text-muted hover:text-ink">Sign out</button>
        </div>
      </div>

      <label className="relative mt-6 block max-w-[420px]">
        <span className="sr-only">Search enquiries</span>
        <Icon name="search" size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, phone, message…" className="h-11 w-full rounded-full border border-ink/10 bg-surface pl-11 pr-4 text-[14.5px] outline-none focus:border-violet" />
      </label>

      {error && <p role="alert" className="mt-6 rounded-2xl bg-warn/10 px-4 py-3 text-[14px] text-warn">{error}</p>}
      {rows && !shown.length && !error && (
        <p className="mt-10 text-center text-[15px] text-muted">{rows.length ? "No enquiries match your search." : "No enquiries yet."}</p>
      )}

      {/* Phones and tablets: one card per enquiry. */}
      <ul className="mt-6 grid grid-cols-1 gap-3 lg:hidden">
        {shown.map((e) => (
          <li key={e.id} className="min-w-0 rounded-[22px] bg-surface p-5 shadow-card ring-1 ring-ink/[0.06]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="break-words text-[16px] font-semibold leading-snug">{e.name}</div>
                <div className="text-[12.5px] text-faint">{when(e.created_at)}</div>
              </div>
              {e.interest && <span className="max-w-[45%] shrink-0 rounded-full bg-accent-light px-2.5 py-1 text-right text-[11.5px] font-semibold leading-tight text-accent">{e.interest}</span>}
            </div>
            <div className="mt-3 flex flex-col gap-1 text-[14px]">
              <a href={`mailto:${e.email}`} className="break-all text-accent underline-offset-2 hover:underline">{e.email}</a>
              {e.phone && <a href={`tel:${e.phone}`} className="text-ink underline-offset-2 hover:underline">{e.phone}</a>}
            </div>
            <p className="mt-3 whitespace-pre-wrap break-words text-[14px] leading-relaxed text-muted">{e.message}</p>
            {e.routed && <p className="mt-2 text-[12.5px] text-faint">Suggested team: {e.routed}</p>}
          </li>
        ))}
      </ul>

      {/* Desktop: table. */}
      {shown.length > 0 && (
        <div className="mt-6 hidden overflow-hidden rounded-[22px] bg-surface shadow-card ring-1 ring-ink/[0.06] lg:block">
          <table className="w-full table-fixed text-left text-[13.5px]">
            <colgroup><col className="w-[140px]" /><col className="w-[16%]" /><col className="w-[20%]" /><col className="w-[130px]" /><col className="w-[15%]" /><col /></colgroup>
            <thead className="bg-canvas text-[12px] font-semibold uppercase tracking-[0.08em] text-faint">
              <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Interested in</th><th className="px-4 py-3">Message</th></tr>
            </thead>
            <tbody className="divide-y divide-ink/[0.06] align-top">
              {shown.map((e) => (
                <tr key={e.id}>
                  <td className="px-4 py-3 text-faint">{when(e.created_at)}</td>
                  <td className="break-words px-4 py-3 font-semibold">{e.name}</td>
                  <td className="break-all px-4 py-3"><a href={`mailto:${e.email}`} className="text-accent hover:underline">{e.email}</a></td>
                  <td className="break-words px-4 py-3">{e.phone ? <a href={`tel:${e.phone}`} className="hover:underline">{e.phone}</a> : <span className="text-faint">—</span>}</td>
                  <td className="break-words px-4 py-3">{e.interest}</td>
                  <td className="px-4 py-3">
                    <p className="whitespace-pre-wrap break-words leading-relaxed text-muted">{e.message}</p>
                    {e.routed && <p className="mt-1.5 text-[12px] text-faint">Suggested team: {e.routed}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
