import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchJson, readArrayCache } from "./network";

describe("fetchJson", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("returns parsed json on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([{ a: 1 }]) }))
    );
    await expect(fetchJson("https://x.test")).resolves.toEqual([{ a: 1 }]);
  });

  it("throws on non 2xx so caller can settle its own state", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) }))
    );
    await expect(fetchJson("https://x.test")).rejects.toThrow("HTTP 500");
  });

  it("aborts when the request hangs past the timeout", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url, { signal }) =>
          new Promise((_resolve, reject) => {
            signal.addEventListener("abort", () => reject(new Error("aborted")));
          })
      )
    );
    const promise = fetchJson("https://x.test", { timeout: 1000 });
    const assertion = expect(promise).rejects.toThrow("aborted");
    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
  });

  it("does not reject when the response arrives before the timeout", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ ok: 1 }) }))
    );
    const promise = fetchJson("https://x.test", { timeout: 1000 });
    await vi.advanceTimersByTimeAsync(2000);
    await expect(promise).resolves.toEqual({ ok: 1 });
  });
});

describe("readArrayCache", () => {
  const storage = (value) => ({ getItem: () => value });

  it("returns the parsed array", () => {
    expect(readArrayCache("k", storage('[{"a":1}]'))).toEqual([{ a: 1 }]);
  });

  it("returns null for missing or invalid json", () => {
    expect(readArrayCache("k", storage(null))).toBeNull();
    expect(readArrayCache("k", storage("{nope"))).toBeNull();
  });

  it("returns null when the value is not an array", () => {
    expect(readArrayCache("k", storage('{"a":1}'))).toBeNull();
  });
});
