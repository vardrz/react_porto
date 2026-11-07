import { describe, it, expect, beforeEach } from "vitest";
import { render, act, waitFor } from "@testing-library/react";
import Reveal from "./Reveal";
import Counter from "./Counter";

function opacityOf(el) {
  if (!el) return null;
  if (el.style.opacity !== "") return Number(el.style.opacity);
  const computed = window.getComputedStyle(el);
  return computed.opacity === "" ? 1 : Number(computed.opacity);
}

describe("Reveal", () => {
  beforeEach(() => {
    window.__mockIO.instances = [];
  });

  it("reveals content when the element enters the viewport", async () => {
    const { getByTestId } = render(
      <Reveal>
        <span data-testid="content">hello</span>
      </Reveal>
    );

    const wrapper = getByTestId("content").parentElement;
    // Awalnya tersembunyi (animasi memang bagian dari desain).
    expect(opacityOf(wrapper)).toBe(0);

    const observer = window.__mockIO.instances.at(-1);
    await act(async () => {
      observer.trigger(true);
    });

    await waitFor(() => expect(opacityOf(wrapper)).toBe(1), { timeout: 3000 });
  });

  it("keeps content hidden until it is actually in view", async () => {
    const { getByTestId } = render(
      <Reveal>
        <span data-testid="content">hello</span>
      </Reveal>
    );
    const wrapper = getByTestId("content").parentElement;
    expect(opacityOf(wrapper)).toBe(0);
  });
});

describe("Counter", () => {
  beforeEach(() => {
    window.__mockIO.instances = [];
  });

  it("shows the final value after entering the viewport", async () => {
    const { getByLabelText } = render(<Counter to={20} suffix="+ PROJECTS" />);
    const observer = window.__mockIO.instances.at(-1);
    await act(async () => {
      observer.trigger(true);
    });
    await waitFor(() => expect(getByLabelText("20+ PROJECTS").textContent).toBe("20+ PROJECTS"), {
      timeout: 3000,
    });
  });
});
