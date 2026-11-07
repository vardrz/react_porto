import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom tidak punya IntersectionObserver; component menganggap animasi
// tersedia, jadi kita beri stub yang bisa dikendalikan test.
class MockIntersectionObserver {
  static instances = [];

  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.elements = new Set();
    MockIntersectionObserver.instances.push(this);
  }

  observe(el) {
    this.elements.add(el);
  }

  unobserve(el) {
    this.elements.delete(el);
  }

  disconnect() {
    this.elements.clear();
  }

  /** Simulasikan elemen masuk viewport, untuk semua elemen yang diamati. */
  trigger(isIntersecting = true) {
    this.callback(
      [...this.elements].map((target) => ({ target, isIntersecting, intersectionRatio: isIntersecting ? 1 : 0 })),
      this
    );
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver;
globalThis.__mockIO = MockIntersectionObserver;

afterEach(() => {
  MockIntersectionObserver.instances = [];
  cleanup();
});
