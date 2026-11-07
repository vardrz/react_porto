import { describe, it, expect, beforeEach } from "vitest";
import { render, act, waitFor } from "@testing-library/react";
import { useState } from "react";
import Stagger from "./Stagger";

/** Ambil opacity efektif yang dipasang motion pada elemen. */
function opacityOf(el) {
  if (!el) return null;
  if (el.style.opacity !== "") return Number(el.style.opacity);
  const computed = window.getComputedStyle(el);
  return computed.opacity === "" ? 1 : Number(computed.opacity);
}

/**
 * Regresi: item yang mount SETELAH container sudah terdeteksi in-view tidak
 * boleh tertinggal di opacity 0. Ini yang terjadi di /projects dan /articles,
 * di mana <Stagger> dirender sebelum data fetch selesai.
 */
describe("Stagger with late-arriving children", () => {
  beforeEach(() => {
    window.__mockIO.instances = [];
  });

  it("keeps late-mounted items visible once the container is already in view", async () => {
    function Page() {
      const [items, setItems] = useState([]);
      // Tombol untuk mensimulasikan fetch yang selesai belakangan.
      return (
        <div>
          <button onClick={() => setItems(["a", "b"])}>load</button>
          <Stagger className="grid" gap={0.05}>
            {items.map((id) => (
              <Stagger.Item key={id}>
                <span data-testid={`item-${id}`}>{id}</span>
              </Stagger.Item>
            ))}
          </Stagger>
        </div>
      );
    }

    const { getByText, queryByTestId, findByTestId } = render(<Page />);

    // 1. Container sudah terlihat di viewport (IO fires) SEBELUM data ada.
    const observer = window.__mockIO.instances[0];
    expect(observer).toBeTruthy();
    await act(async () => {
      observer.trigger(true);
    });

    // 2. Belum ada item.
    expect(queryByTestId("item-a")).toBeNull();

    // 3. Data datang.
    await act(async () => {
      getByText("load").click();
    });

    // 4. Item harus terlihat, bukan tertinggal di opacity 0.
    const item = await findByTestId("item-a");
    expect(item).toBeTruthy();
    const wrapper = item.parentElement;
    await waitFor(() => expect(opacityOf(wrapper)).toBe(1), { timeout: 3000 });
  });
});
