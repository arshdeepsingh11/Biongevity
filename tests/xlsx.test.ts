import { describe, expect, it } from "vitest";
import { buildXlsx, crc32 } from "../src/lib/xlsx";

const dec = new TextDecoder();

/** Reads the stored (uncompressed) entries back out of a zip. */
function unzip(bytes: Uint8Array) {
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const files: Record<string, string> = {};
  let at = 0;
  while (v.getUint32(at, true) === 0x04034b50) {
    const size = v.getUint32(at + 18, true), nameLen = v.getUint16(at + 26, true), extra = v.getUint16(at + 28, true);
    const name = dec.decode(bytes.subarray(at + 30, at + 30 + nameLen));
    const start = at + 30 + nameLen + extra;
    const data = bytes.subarray(start, start + size);
    expect(crc32(data)).toBe(v.getUint32(at + 14, true));
    files[name] = dec.decode(data);
    at = start + size;
  }
  return files;
}

describe("Excel export", () => {
  it("computes the standard CRC-32", () => {
    expect(crc32(new TextEncoder().encode("123456789"))).toBe(0xcbf43926);
  });

  it("writes a valid workbook with escaped text cells", () => {
    const files = unzip(buildXlsx(["Name", "Message"], [["Asha <A&B>", "=HYPERLINK(\"x\")\nline 2"], ["Omar", "مرحبا"]], { sheet: "Enquiries" }));
    expect(Object.keys(files)).toEqual(["[Content_Types].xml", "_rels/.rels", "xl/workbook.xml", "xl/_rels/workbook.xml.rels", "xl/styles.xml", "xl/worksheets/sheet1.xml"]);
    const sheet = files["xl/worksheets/sheet1.xml"];
    expect(sheet).toContain("Asha &lt;A&amp;B&gt;");
    expect(sheet).toContain("مرحبا");
    // Text that looks like a formula stays text: there is no <f> element anywhere.
    expect(sheet).not.toContain("<f>");
    expect(sheet).toContain('r="B3"');
    expect(files["xl/workbook.xml"]).toContain('name="Enquiries"');
  });

  it("drops characters XML cannot hold", () => {
    const files = unzip(buildXlsx(["A"], [["bell\u0007ok"]]));
    expect(files["xl/worksheets/sheet1.xml"]).toContain(">bellok<");
  });
});
