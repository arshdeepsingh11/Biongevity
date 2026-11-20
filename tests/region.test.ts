import { describe, expect, it } from "vitest";
import { convertPrice, formatPrice, isRegion, RATE_CAD_AED, REGIONS } from "../src/lib/region";

describe("regions", () => {
  it("knows the two faces of the site", () => {
    expect(REGIONS.intl.currency).toBe("CAD");
    expect(REGIONS.intl.office.city).toBe("Calgary");
    expect(REGIONS.uae.currency).toBe("AED");
    expect(REGIONS.uae.office.city).toBe("Dubai");
    expect(isRegion("uae") && isRegion("intl") && !isRegion("us") && !isRegion(null)).toBe(true);
  });

  it("shows CAD list prices unchanged for International", () => {
    expect(convertPrice(699, "intl")).toEqual({ amount: 699, currency: "CAD", approx: false });
    expect(formatPrice(699, "intl")).toBe("$699");
    expect(formatPrice(833.99, "intl")).toBe("$833.99");
  });

  it("converts to AED at the indicative rate, rounded to the nearest 10, and flags it", () => {
    const c = convertPrice(699, "uae");
    expect(c.currency).toBe("AED");
    expect(c.approx).toBe(true);
    expect(c.amount % 10).toBe(0);
    expect(Math.abs(c.amount - 699 * RATE_CAD_AED)).toBeLessThan(5);
    expect(formatPrice(699, "uae")).toMatch(/^AED [\d,]+$/);
    expect(formatPrice(1198, "uae")).toBe(`AED ${(Math.round((1198 * RATE_CAD_AED) / 10) * 10).toLocaleString("en-AE")}`);
  });
});
