/**
 * Bangun URL aset dari folder public.
 *
 * Path relatif seperti "projects/foto.png" di-resolve browser terhadap URL
 * halaman, bukan root. Di /projects/ hasilnya jadi /projects/projects/foto.png.
 * Helper ini memaksa semuanya absolut terhadap root deploy.
 */
export function asset(path) {
  if (!path) return "";
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:")) return path;
  return "/" + String(path).replace(/^\/+/, "");
}
