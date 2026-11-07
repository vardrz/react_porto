/**
 * Helper jaringan dengan timeout. Tujuannya: request yang menggantung tidak
 * boleh membuat UI bertahan di state loading selamanya.
 */

const DEFAULT_TIMEOUT = 12000;

export async function fetchJson(url, { timeout = DEFAULT_TIMEOUT, signal } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Baca cache array dari localStorage. Null jika kosong/rusak/bukan array. */
export function readArrayCache(key, storage = typeof localStorage === "undefined" ? null : localStorage) {
  if (!storage) return null;
  try {
    const parsed = JSON.parse(storage.getItem(key));
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
