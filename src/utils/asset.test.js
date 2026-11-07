import { describe, expect, it } from "vitest";
import { asset } from "./asset";

describe("asset", () => {
  it("membuat path absolut terhadap root", () => {
    expect(asset("projects/dandani.png")).toBe("/projects/dandani.png");
    expect(asset("/projects/dandani.png")).toBe("/projects/dandani.png");
  });

  it("membiarkan URL absolut dan protocol-relative", () => {
    expect(asset("https://example.com/a.png")).toBe("https://example.com/a.png");
    expect(asset("//cdn.example.com/a.png")).toBe("//cdn.example.com/a.png");
    expect(asset("data:image/png;base64,AAA")).toBe("data:image/png;base64,AAA");
  });

  it("mengembalikan string kosong untuk nilai kosong", () => {
    expect(asset("")).toBe("");
    expect(asset(undefined)).toBe("");
    expect(asset(null)).toBe("");
  });
});
