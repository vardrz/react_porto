import { describe, it, expect } from "vitest";
import en from "./en.json";
import id from "./id.json";

describe("hero stats keys", () => {
  for (const [name, dict] of [["en", en], ["id", id]]) {
    it(`${name} exposes numeric stats`, () => {
      expect(typeof dict.hero.statsYears).toBe("number");
      expect(typeof dict.hero.statsProjects).toBe("number");
      expect(dict.hero.statsLocation).toBe("PEKALONGAN, ID");
      expect(dict.hero.stats).toBeUndefined();
      expect(dict.hero.statsMobile).toBeUndefined();
    });
  }
});
