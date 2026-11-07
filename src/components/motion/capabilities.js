/**
 * IntersectionObserver tidak tersedia (browser lawas) → jangan pernah
 * menyembunyikan konten di balik animasi yang tidak akan pernah jalan.
 * Dievaluasi sekali saat modul dimuat supaya tidak ada flicker.
 */
export const CAN_REVEAL =
  typeof window !== "undefined" && typeof window.IntersectionObserver !== "undefined";
