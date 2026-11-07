/* eslint-disable react/prop-types */
import { Component } from "react";
import { isChunkLoadError } from "../utils/chunkError";

const RELOAD_KEY = "chunk-reload-at";
const RELOAD_WINDOW = 10_000;

function reloadOnce() {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < RELOAD_WINDOW) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
}

/**
 * Chunk async bisa gagal saat deploy baru mengganti hash file (chunk lama 404).
 * Gejalanya: halaman kosong di kunjungan pertama, normal setelah reload.
 * Boundary ini reload sekali untuk mengambil manifest baru, dan menampilkan
 * pesan yang bisa diklik kalau reload juga gagal (mis. offline).
 */
export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false, retryable: false };
  }

  static getDerivedStateFromError(error) {
    return { failed: true, retryable: isChunkLoadError(error) };
  }

  componentDidCatch(error) {
    if (isChunkLoadError(error)) reloadOnce();
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="min-h-[60vh] w-full max-w-6xl mx-auto px-6 md:px-10 pt-24 flex flex-col items-start gap-4">
        <p className="text-light/70 text-sm">
          Halaman gagal dimuat. Koneksi mungkin terputus atau ada versi baru.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg border border-primary/30 text-primary text-xs tracking-wide hover:bg-primary/10 transition"
        >
          Muat ulang
        </button>
      </div>
    );
  }
}
