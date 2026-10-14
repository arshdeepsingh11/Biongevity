"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_THEME, THEMES, THEME_KEY, resolveTheme, type ThemeChoice, type ThemeId } from "@/lib/theme";

interface ThemeState { choice: ThemeChoice; theme: ThemeId; setChoice: (c: ThemeChoice) => void }
const Ctx = createContext<ThemeState | null>(null);

/** Applies the chosen theme to <html data-theme>, saves it, and keeps <meta name="theme-color"> in sync. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>(DEFAULT_THEME);
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY) as ThemeChoice | null;
      if (saved && (saved === "auto" || THEMES.some((t) => t.id === saved))) setChoiceState(saved);
    } catch { /* storage blocked: keep default */ }
  }, []);

  useEffect(() => {
    const apply = () => {
      const t = resolveTheme(choice);
      setTheme(t);
      const d = document.documentElement;
      d.setAttribute("data-theme", t);
      d.style.colorScheme = t === "midnight" ? "dark" : "light";
      const meta = THEMES.find((x) => x.id === t)!.meta;
      document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", meta));
    };
    apply();
    if (choice !== "auto") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [choice]);

  const setChoice = useCallback((c: ThemeChoice) => {
    setChoiceState(c);
    try { localStorage.setItem(THEME_KEY, c); } catch { /* ignore */ }
  }, []);

  const value = useMemo(() => ({ choice, theme, setChoice }), [choice, theme, setChoice]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTheme must be used inside <ThemeProvider>");
  return c;
}
