import { describe, it, expect } from "vitest";
import { isChunkLoadError } from "./chunkError";

describe("isChunkLoadError", () => {
  it("detects Chrome's dynamic import failure", () => {
    expect(isChunkLoadError(new Error("Failed to fetch dynamically imported module: /assets/home-abc.js"))).toBe(true);
  });

  it("detects Safari's module script failure", () => {
    expect(isChunkLoadError(new Error("Importing a module script failed."))).toBe(true);
  });

  it("detects webpack's ChunkLoadError", () => {
    const e = new Error("Loading chunk 3 failed");
    e.name = "ChunkLoadError";
    expect(isChunkLoadError(e)).toBe(true);
  });

  it("detects Firefox's message", () => {
    expect(isChunkLoadError(new Error("error loading dynamically imported module"))).toBe(true);
  });

  it("ignores unrelated errors", () => {
    expect(isChunkLoadError(new Error("Cannot read properties of undefined"))).toBe(false);
    expect(isChunkLoadError(null)).toBe(false);
    expect(isChunkLoadError(undefined)).toBe(false);
  });
});
