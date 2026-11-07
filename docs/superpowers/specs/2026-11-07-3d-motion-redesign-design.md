# Design — Redesign 3D + Motion System Portfolio

Tanggal: 2026-11-07
Proyek: `react_porto` (vard.is-a.dev)
Status: menunggu approval

## 1. Intent

Portfolio ini sudah punya identitas visual yang kuat: dark `#212121`, neon teal
`#14FFEC`, aksen `#0D7377`, tipografi Space Grotesk + Work Sans. Yang kurang
bukan tema, tapi **kedalaman dan gerak**. Saat ini hero hanya teks + TypeAnimation,
semua section muncul datar tanpa transisi, dan tidak ada satu pun elemen yang
membuat orang berhenti scroll di 5 detik pertama.

Tujuan redesign: membuat situs terasa *premium* dan *modern* tanpa kehilangan
karakter "software engineer". 3D dipakai sebagai **aksen di hero**, bukan
mengganti seluruh estetika. Sisanya adalah motion system yang konsisten —
justru ini yang paling berpengaruh ke persepsi "mahal".

**Keseimbangan yang dipilih user:** hero 3D yang impressive, tapi bundle dijaga,
lazy-load, dan ada fallback untuk device lemah.

Target audiens: recruiter, klien freelance, sesama developer yang buka link dari
CV/LinkedIn.

## 2. Goals

- Hero punya centerpiece 3D interaktif bertema "floating code cube".
- Motion system konsisten di seluruh situs: scroll reveal, stagger, tilt card,
  magnetic button, number counter.
- First paint tetap cepat: three.js tidak boleh masuk initial bundle dan tidak
  boleh memblokir LCP.
- Hormati `prefers-reduced-motion`. Ada jalur non-WebGL yang tetap terlihat bagus.
- Semua copy tetap dari `src/i18n/{en,id}.json`; tidak ada perubahan konten.

  *Klarifikasi (diputuskan user):* key i18n **boleh direstrukturisasi** (mis.
  `hero.stats` dipecah menjadi `hero.statsYears: 3`, `hero.statsProjects: 20`,
  `hero.statsLocation`). Syaratnya: **teks yang terlihat user identik dengan
  sekarang**. Yang berubah hanya bentuk data, bukan copy.

## 3. Non-goals

- Tidak menulis ulang copy/marketing.
- Tidak menambah halaman baru.
- Tidak mengubah alur data (Google Sheets fetch, localStorage cache).
- Tidak menyentuh halaman articles (`swiper`, `antd`) selain pembungkusan reveal.
- Tidak mengganti font display atau logo.
- Tidak membuat 3D di halaman selain home.

## 4. Anti-goals (kalau ini terjadi, redesign gagal)

- Initial JS bundle naik > 60KB gzip.
- LCP > 2.5s di simulasi mobile 4G.
- Animasi bikin scroll tersendat di HP mid-range (frame drop terlihat).
- Ada device yang melihat area kosong/hitam karena Canvas gagal load.
- Teks jadi susah dibaca karena glow berlebihan.

## 5. Constraints

- React 18.2 (BUKAN React 19) → `@react-three/fiber` harus v8, bukan v9.
  `@react-three/drei` v9, `three` 0.170.0.
- Tailwind 3.4, Vite 8, deploy statis ke GitHub Pages (`base: "/"`).
- Semua aset 3D harus **procedural** (dibangun dari geometry + material), tanpa
  file `.glb`/`.hdr` eksternal. Tidak boleh ada request ke CDN aset 3D.
- `index.html` **boleh disentuh** untuk performa (diputuskan user): hapus 3
  `<link>` Google Fonts yang tidak terpakai (Poppins, Hammersmith One, Niramit,
  Roboto Slab — tidak direferensikan di mana pun), dan samakan `theme-color`
  ke token `dark` baru.
- Halaman render di client (SPA), `HelmetProvider` untuk SEO.
- Tidak ada backend. Semua tetap statis.

## 6. Approaches yang dipertimbangkan

### A. React Three Fiber, objek procedural (DIPILIH)

Cube glass dibangun dari kode: `RoundedBox` + neon edges + inner glow core.
Material `MeshTransmissionMaterial` (drei), lighting dari `Environment` lokal
berisi `LightFormer` (tanpa fetch HDR). Mouse parallax lewat `useFrame`.

- (+) Visual paling premium: refraction, bloom, depth asli.
- (+) Interaktif dan reaktif mouse — inilah "wow" yang diminta.
- (+) Semua procedural → tidak ada aset berat, mudah diubah.
- (−) three.js ±170KB gzip. Diselesaikan dengan async chunk + lazy mount.
- (−) Perlu fallback untuk device tanpa WebGL / GPU lemah.

### B. CSS 3D murni

`transform-style: preserve-3d`, glass via `backdrop-filter`.

- (+) Zero dependency, instan, hemat baterai.
- (−) Tidak ada refraction, lighting, atau bloom asli. "Premium" hanya sampai
  tahap bagus, tidak wow.

### C. Video / Lottie loop

Render cube di Blender, ekspor video.

- (+) Ringan, konsisten lintas device.
- (−) Mati: tidak reaktif mouse. Update konten harus render ulang aset.

**Keputusan:** A, dengan B dipakai sebagai fallback. C ditolak karena mematikan
interaktivitas yang justru jadi alasan utama memakai 3D.

### Pilihan motion library

**framer-motion (dipilih)** vs CSS + IntersectionObserver.

Alasan: user memilih motion di seluruh situs. Stagger kompleks, layout animation,
dan spring physics jauh lebih murah ditulis dengan framer-motion. Biaya ±35–40KB
gzip di main chunk diterima, dan merupakan bagian dari budget 60KB.

## 7. Desain

### 7.1 Token & permukaan

Tema teal dipertahankan. Yang berubah: neutral dibuat lebih dalam supaya efek
glow punya ruang bernapas (glow di atas `#212121` terlihat pudar).

Tailwind `theme.colors` — hanya nilai, nama token tetap:

| token | sekarang | baru | alasan |
|---|---|---|---|
| `dark` | `#212121` | `#12181A` | base lebih dalam, glow kontras |
| `dark2` | `#323232` | `#1D2528` | surface tetap terbaca |
| `light` | `#EBF3E8` | `#EAF2F0` | neutral sedikit lebih dingin, match teal |
| `primary` | `#14FFEC` | tetap | brand |
| `secondary` | `#0D7377` | tetap | brand |

Token tambahan (extend): `surface` `#161E1F`, `line` `rgba(234,242,240,0.08)`,
`glow` `rgba(20,255,236,0.35)`.

Ini **call dari saya** — mudah dibalik karena semua warna tersentral di
`tailwind.config.js`. `ant-drawer-body` di `index.css` ikut disesuaikan.

Tambahan font: stack mono untuk aksen developer (`ui-monospace, "SFMono-Regular",
"JetBrains Mono", Menlo, monospace`) — pakai font sistem, tanpa request tambahan.

### 7.2 Hero

Layout desktop berubah dari satu kolom teks menjadi **dua kolom**:

```
+--------------------------+  +-----------------------+
| badge ● Open to work     |  |                       |
| FARID FATKHURROZAK       |  |    [ 3D CODE CUBE ]   |
| (typing role)            |  |    mouse parallax     |
| stats                    |  |    floating, glow     |
| subtitle                 |  |                       |
| [Projects] [Contact]     |  |                       |
+--------------------------+  +-----------------------+
```

Mobile: cube di atas (lebih kecil, 220–260px), teks di bawah, tetap one column.
Hero min-height tetap `85vh` desktop.

**Objek: floating code cube**

- `RoundedBox` ~1.6 unit, radius 0.09, smoothness 4.
- Material: `MeshTransmissionMaterial` — transmission 1, thickness 0.7,
  roughness 0.08, ior 1.45, chromaticAberration 0.04, samples 4, resolution 256.
  Di mobile (`isMobile`) turun ke `MeshPhysicalMaterial` (transmission 0.9,
  roughness 0.15) karena transmission material butuh render pass ekstra.
- Neon edges: drei `<Edges>` dengan material emissive `#14FFEC`, opacity 0.55.
- Isi cube: 5–7 baris "kode" berupa thin box emissive dengan lebar bervariasi,
  plus satu bar pengganti kursor yang berkedip (sinus via `useFrame`, bukan
  `setInterval`). Abstrak tapi terbaca sebagai kode.
- Inti: icosahedron wireframe kecil, emissive teal, rotasi berlawanan arah.
- Lighting: `<Environment resolution={128}>` berisi 3 `LightFormer` (key teal dari
  kanan atas, fill putih dingin dari kiri, rim dari belakang). Tidak ada fetch HDR.
- Background scene transparan (`alpha: true`) supaya grid CSS di belakang tetap
  terlihat.
- Mouse parallax: rotasi target = posisi pointer × 0.25 rad, di-lerp `damp`.
  Cube menganggur tetap berotasi lambat 0.15 rad/detik.
- `<ContactShadows>` tipis di bawah cube untuk grounding.

**Performa scene**

- `dpr={[1, 1.75]}`, `gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}`.
- `frameloop` di-switch: `always` saat terlihat, `never` saat keluar viewport
  (IntersectionObserver di wrapper).
- Pointer handler global, tidak pakai `OrbitControls` (tidak ada drag → hemat).
- Tidak ada post-processing (bloom via `@react-three/postprocessing` ditolak:
  +45KB dan satu fullscreen pass). Glow dibuat pakai emissive + CSS radial
  blur di belakang canvas.

**Strategi loading (penting — ini yang menjaga "seimbang")**

1. `HeroVisual` render **CSS cube statis** langsung, dari HTML pertama.
2. Setelah mount, `requestIdleCallback` (fallback `setTimeout 1200ms`) →
   `React.lazy(() => import("./HeroScene"))` → mount Canvas.
3. Canvas fade-in 400ms di atas CSS cube, CSS cube fade-out. Tidak ada layout
   shift karena keduanya absolute dalam container rasio tetap.
4. Kalau chunk gagal / WebGL tidak tersedia / `prefers-reduced-motion` /
   `navigator.hardwareConcurrency <= 4` + `deviceMemory <= 2` →
   CSS cube tetap, tidak ada retry.

`three` tidak akan masuk initial bundle karena hanya diimpor di `HeroScene.jsx`
yang di-lazy.

### 7.3 Motion system

Satu set primitif di `src/components/motion/`, dipakai ulang di semua halaman.

| Komponen | Perilaku | Catatan |
|---|---|---|
| `Reveal` | opacity 0→1, y 24→0, duration 0.6, ease `[0.22,1,0.36,1]`, `whileInView` once, margin `-80px` | primitif utama, dipakai wrapper section |
| `RevealGroup` / `Stagger` | stagger 0.07 antar child | untuk grid project & chip tech stack |
| `TiltCard` | tilt maks 6°, spring `stiffness 260 damping 22`, glare radial tipis mengikuti pointer | auto-off saat `(hover: none)` |
| `MagneticButton` | translate ke arah pointer maks 6px + scale 1.02 | hanya CTA primary |
| `Counter` | count-up angka stat (3+ tahun, 20+ proyek) | `useInView` once, 900ms. Angka dibaca dari key i18n numerik baru (`hero.statsYears`, `hero.statsProjects`); suffix `+` dan separator `•` dirender terpisah sebagai teks statis, sehingga hasil akhirnya identik dengan sekarang |
| `GlowOrb` | div blur radial teal, parallax slow terhadap scroll | dekorasi background, `pointer-events-none` |

Global: `<MotionConfig reducedMotion="user">` membungkus app, jadi
`prefers-reduced-motion` otomatis mematikan transform di semua primitif.

Penerapan per halaman:

- **Home**: hero (Reveal per elemen, stagger 0.08), featured projects grid
  (`Stagger` + `TiltCard`), section heading `Reveal`.
- **About**: `AboutSection` teks & avatar `Reveal`, chip stats `Stagger`,
  `TechStack` chip `Stagger` (maks 22 child, cukup), activity graph `Reveal`.
- **Projects**: header `Reveal`, card grid `Stagger` + `TiltCard`.
- **Contact**: heading `Reveal` dengan y lebih besar (32px), social row
  `Stagger`, hover translate tetap dipertahankan.
- **Articles**: hanya `Reveal` di wrapper — tidak menyentuh Swiper.
- **Detail pages** (`projectsDetail`, `articleDetail`): hanya `Reveal` pada
  wrapper konten di **luar** Swiper. Konfigurasi Swiper (modules, CSS import,
  markup slide) tidak disentuh sama sekali. Ini menjaga kesinambungan visual
  dari list ke detail tanpa risiko merusak carousel.

### 7.3.1 Card utility dan migrasi visual

`dark2` tetap berperan sebagai surface (dipakai luas: `bg-dark2/40`, `bg-dark2/50`).
Token `surface` dan `line` **hanya** untuk komponen baru. Untuk menghindari dua
gaya card yang berbeda, dibuat satu utilitas di `@layer components`:

```
.card  → border line, bg surface/60, shadow berlapis, hover lift + border teal 20%
```

Dipakai di surface yang memang sudah disentuh untuk motion: featured projects
(home), projects grid, activity graph (about), dan chip tech stack. Card di
`articles.jsx` dan `projectsDetail.jsx` **tidak** dimigrasi — tetap seperti
sekarang, karena halaman itu tidak masuk scope restyle.

**Call saya, bukan sesuatu yang user setujui secara eksplisit.**

### 7.4 Lapisan visual pendukung (non-3D)

Ini yang membuat "premium" terasa, dan murah:

- **Background**: fixed layer berisi (a) radial gradient teal 8% di kanan atas,
  (b) grid halus 1px `rgba(234,242,240,0.04)` ukuran 48px dengan `mask-image`
  radial fade, (c) noise SVG 3% opacity. Semua CSS, nol JS.
- **Hairline divider**: garis 1px dengan gradient fade di tepi, antar section.
- **Card**: border `line` + inner highlight atas (border-top gradient), shadow
  berlapis (`0 1px 0 rgba(255,255,255,.04) inset, 0 24px 48px -24px rgba(0,0,0,.8)`),
  hover lift `-2px` + border teal 20%.
- **Focus ring**: `focus-visible:ring-2 ring-primary/60` global untuk a11y.
- **Scrollbar**: tipis, thumb `dark2`, hover teal.

### 7.5 Struktur file

```
src/
  components/
    hero/
      HeroVisual.jsx         # wrapper: deteksi kapabilitas, lazy mount, fade
      HeroScene.jsx          # Canvas + scene (ASYNC CHUNK)
      CodeCube.jsx           # cube, edges, core, code bars
      StaticCube.jsx         # CSS 3D fallback
      heroVisual.css         # atau tailwind-only, lihat plan
    motion/
      Reveal.jsx
      Stagger.jsx
      TiltCard.jsx
      MagneticButton.jsx
      Counter.jsx
      GlowOrb.jsx
    ui/
      BackgroundFX.jsx       # grid + glow + noise, dipasang di App
  hooks/
    useCapabilities.js       # webgl, reduced-motion, device class
```

File yang diubah: `tailwind.config.js`, `src/index.css`, `src/App.jsx`
(MotionConfig + BackgroundFX), `src/components/heroSection.jsx`,
`src/components/aboutSection.jsx`, `src/components/techStackSection.jsx`,
`src/components/navbar.jsx` (minor: focus ring, backdrop),
`src/views/{home,projects,contact,about}.jsx`.

## 8. Budget & kriteria sukses

| Metrik | Target |
|---|---|
| Initial JS gzip | ≤ +60KB dari baseline (framer-motion) |
| Chunk `three` | async, tidak di-request sebelum idle |
| LCP mobile 4G | ≤ 2.5s |
| Lighthouse Performance | ≥ 85 (turun dari baseline wajar, tidak di bawah 85) |
| Lighthouse Accessibility | ≥ 95 |
| FPS scene di laptop | 60 |
| FPS di HP mid-range | ≥ 45 (kalau kurang: matikan transmission + turunkan dpr) |
| Layout shift hero | 0 |

**Cara verifikasi (diputuskan, tanpa menambah CI):** checklist manual di Chrome
DevTools sebelum merge — Lighthouse (mode mobile), Network throttling "Fast 4G",
CPU throttling 4×, dan pantau Performance panel saat scroll hero untuk frame drop.
Baseline pembanding = build `main` saat ini, diukur dengan cara yang sama.
Kalau angka chunk `three` ternyata > 300KB gzip, drei dibuang dan scene ditulis
dengan `three` langsung (RoundedBox manual via `BoxGeometry` + `MeshPhysicalMaterial`).

## 9. Yang diserahkan ke builder

- Angka presisi material (thickness, roughness) — tuning visual.
- Susunan persis baris "kode" di cube.
- Apakah CSS fallback dibuat dengan `preserve-3d` atau pseudo-3D (dua layer
  transform + blur) — yang penting terlihat seperti cube, bukan kotak datar.
- Pemecahan komponen lebih lanjut kalau satu file membengkak > 150 baris.
- Nilai `dpr` akhir setelah profiling.
