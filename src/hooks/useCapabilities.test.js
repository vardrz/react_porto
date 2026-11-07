import { describe, it, expect } from "vitest";
import { classifyDevice } from "./useCapabilities";

describe("classifyDevice", () => {
  it("off when reduced motion", () =>
    expect(classifyDevice({ reducedMotion: true, hardwareConcurrency: 8, deviceMemory: 8 })).toBe("off"));
  it("lite on low-end device", () =>
    expect(classifyDevice({ reducedMotion: false, hardwareConcurrency: 4, deviceMemory: 2 })).toBe("lite"));
  it("full on capable device", () =>
    expect(classifyDevice({ reducedMotion: false, hardwareConcurrency: 8, deviceMemory: 8 })).toBe("full"));
  it("lite when deviceMemory is undefined but cores low", () =>
    expect(classifyDevice({ reducedMotion: false, hardwareConcurrency: 2, deviceMemory: undefined })).toBe("lite"));
});
