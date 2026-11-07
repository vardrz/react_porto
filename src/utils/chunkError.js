/** True kalau error berasal dari kegagalan memuat chunk async (deploy baru / offline). */
export function isChunkLoadError(error) {
  if (!error) return false;
  const msg = String(error.message || error);
  return (
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg) ||
    /error loading dynamically imported module/i.test(msg) ||
    error.name === "ChunkLoadError"
  );
}
