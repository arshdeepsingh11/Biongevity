import { afterEach, describe, expect, it, vi } from "vitest";
import { mailtoUrl, submitEnquiry, type Enquiry } from "@/lib/enquiry";

const E: Enquiry = { name: "Ana Lee", email: "ana@example.com", phone: "", interest: "Cardiology", msg: "Blood pressure & sleep?", routed: "Cardiology" };

afterEach(() => vi.unstubAllGlobals());

describe("contact enquiries", () => {
  it("reports sent only when the endpoint returns 2xx", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 200 })));
    expect(await submitEnquiry(E, "https://hook.example", "info@biongevity.com")).toBe("sent");
  });

  it("reports an error when the endpoint rejects the enquiry (previously shown as success)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    expect(await submitEnquiry(E, "https://hook.example", "info@biongevity.com")).toBe("error");
  });

  it("reports an error when the network fails (previously did nothing)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    expect(await submitEnquiry(E, "https://hook.example", "info@biongevity.com")).toBe("error");
  });

  it("times out instead of hanging", async () => {
    vi.stubGlobal("fetch", vi.fn((_url: string, init: RequestInit) => new Promise((_, reject) => init.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError"))))));
    expect(await submitEnquiry(E, "https://hook.example", "info@biongevity.com", 20)).toBe("error");
  });

  it("opens a pre-filled email when no endpoint is configured (previously faked success)", async () => {
    const location = { href: "" };
    vi.stubGlobal("window", { location });
    expect(await submitEnquiry(E, "", "info@biongevity.com")).toBe("mailed");
    expect(location.href.startsWith("mailto:info@biongevity.com?subject=")).toBe(true);
  });

  it("encodes the email body safely and skips empty fields", () => {
    const url = mailtoUrl(E, "info@biongevity.com");
    const body = decodeURIComponent(url.split("&body=")[1]);
    expect(body).toContain("Name: Ana Lee");
    expect(body).toContain("Blood pressure & sleep?");
    expect(body).not.toContain("Phone:");
    expect(url).not.toContain("& sleep"); // the & is encoded, so it cannot break the mailto query
  });
});
