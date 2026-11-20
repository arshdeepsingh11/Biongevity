/** Any part of the page can open the assistant (optionally with a question) without a shared provider. */
export interface AskDetail { q?: string; selection?: string; section?: string; source?: "hero" | "selection" | "launcher" | "page" }

export const ASK_EVENT = "bio:ask";

export function openAssistant(detail: AskDetail = {}) {
  window.dispatchEvent(new CustomEvent<AskDetail>(ASK_EVENT, { detail }));
}
