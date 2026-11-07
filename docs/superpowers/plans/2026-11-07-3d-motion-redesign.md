# 3D + Motion Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tambahkan hero 3D "floating code cube" yang lazy-loaded dan motion system konsisten di seluruh portfolio, tanpa mengorbankan performa first paint.

**Architecture:** Tema teal dipertahankan dengan neutral yang lebih dalam. Hero memakai dua lapis: `StaticCube` (CSS, render instan) dan `HeroScene` (R3F, async chunk yang dimount saat idle lalu fade-in). Motion dipusatkan di 6 primitif framer-motion yang dipakai ulang, dibungkus `MotionConfig reducedMotion="user"`.

**Tech Stack:** React 18.2, Vite 8, Tailwind 3.4, framer-motion 14, three 0.170, @react-three/fiber 8.18, @react-three/drei 9.122, Vitest (baru, hanya untuk logika murni).

**Spec:** `docs/superpowers/specs/2026-11-07-3d-motion-redesign-design.md`

## Global Constraints

- React **18.2** → `@react-three/fiber` **v8** (v9 butuh React 19). Drei **v9**.
- `three@0.170.0`, `@react-three/fiber@8.18.0`, `@react-three/drei@9.122.0`, `framer-motion@14.10.1`.
- Semua aset 3D procedural. Tanpa `.glb`/`.hdr`, tanpa request CDN aset 3D.
- `three` tidak boleh ada di initial bundle — impor hanya dari `HeroScene.jsx`, yang di-`React.lazy`.
- Semua copy dari `src/i18n/{en,id}.json`; restrukturisasi key boleh, teks yang terlihat user identik.
- `prefers-reduced-motion` dimatikan otomatis lewat `MotionConfig reducedMotion="user"`.
- Budget: initial JS ≤ +60KB gzip; LCP mobile 4G ≤ 2.5s; Lighthouse Perf ≥ 85, A11y ≥ 95.
- Token warna: `dark #12181A`, `dark2 #1D2528`, `light #EAF2F0`, `primary #14FFEC`, `secondary #0D7377`, extend `surface #161E1F`, `line rgba(234,242,240,0.08)`, `glow rgba(20,255,236,0.35)`.
- Jangan sentuh konfigurasi Swiper di `projectsDetail.jsx` / `articleDetail.jsx`.

## Review Focus

1. **Device tanpa WebGL / konteks hilang** — user harus tetap melihat cube CSS yang rapi, bukan area kosong atau canvas hitam.
2. **`prefers-reduced-motion: reduce`** — tidak ada transform/opacity animasi yang tersisa; konten langsung terlihat penuh, termasuk cube (statis, tanpa rotasi).
3. **Chunk three.js gagal dimuat (offline/blocked)** — fallback CSS tetap, tanpa error overlay Vite di production, tanpa retry loop.
4. **Navigasi SPA berulang** (home → about → home) — canvas tidak leak, listener pointer lepas, tidak ada dobel mount.
5. **Alpha/teks glow berlebihan** — teks body tetap kontras ≥ 4.5:1 terhadap background baru `#12181A`.

---

### Task 1: Dependency + design tokens

**Files:**
- Modify: `package.json`
- Modify: `tailwind.config.js`
- Modify: `src/index.css`
- Modify: `index.html`
- Delete: `pnpm-lock.yaml`

**Interfaces:**
- Produces: token Tailwind `dark`, `dark2`, `light`, `primary`, `secondary`, `surface`, `line`, `glow`; utilitas `.card`, `.hairline`, `.text-glow`; font stack `mono`.

- [ ] **Step 1: Install dependencies dengan npm (CI pakai `npm ci`)**

```bash
npm install three@0.170.0 @react-three/fiber@8.18.0 @react-three/drei@9.122.0 framer-motion@14.10.1
npm install -D vitest@2
```

Hapus `pnpm-lock.yaml` supaya tidak ada lockfile ganda.

- [ ] **Step 2: Update `tailwind.config.js`**

Ganti blok `colors` dengan nilai spec, dan extend tambahan:

```js
colors: {
  primary: "#14FFEC",
  secondary: "#0D7377",
  light: "#EAF2F0",
  dark: "#12181A",
  dark2: "#1D2528",
  surface: "#161E1F",
  line: "rgba(234,242,240,0.08)",
  glow: "rgba(20,255,236,0.35)",
},
extend: {
  fontFamily: {
    sans: ['Work Sans', 'sans-serif'],
    heading: ['Space Grotesk', 'sans-serif'],
    mono: ['ui-monospace', 'SFMono-Regular', 'JetBrains Mono', 'Menlo', 'monospace'],
  },
  transitionTimingFunction: { premium: "cubic-bezier(0.22, 1, 0.36, 1)" },
},
```

- [ ] **Step 3: Tambah utilitas di `src/index.css`**

```css
@layer components {
  .card {
    @apply rounded-xl border border-line bg-surface/60 transition duration-300 ease-premium;
    box-shadow: 0 1px 0 rgba(255,255,255,.04) inset, 0 24px 48px -24px rgba(0,0,0,.8);
  }
  .card:hover { @apply -translate-y-0.5 border-primary/20; }
  .hairline {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(234,242,240,.10), transparent);
  }
}
```

Tambahkan juga `:focus-visible` global (`outline: 2px solid #14FFEC; outline-offset: 2px`), scrollbar tipis, dan ubah `.ant-drawer-body` ke `#12181A`.

- [ ] **Step 4: Bersihkan `index.html`**

Hapus tiga `<link>` Google Fonts (Poppins, Hammersmith One/Niramit/Roboto Slab). Sisakan `preconnect` saja. Ubah `<meta name="theme-color" content="#0a0a0a" />` → `#12181A`, dan `body class="bg-dark"` tetap.

- [ ] **Step 5: Verifikasi build**

Run: `npm run build`
Expected: exit 0, `dist/` terbentuk. Cek `dist/assets/*.js` — belum ada chunk berisi three.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tailwind.config.js src/index.css index.html
git rm --cached pnpm-lock.yaml
git commit -m "chore: add 3d/motion deps and deepen neutral tokens"
```

---

### Task 2: `useCapabilities` + test

**Files:**
- Create: `src/hooks/useCapabilities.js`
- Create: `src/hooks/useCapabilities.test.js`
- Modify: `package.json` (script `test`)

**Interfaces:**
- Produces: `classifyDevice({ reducedMotion, hardwareConcurrency, deviceMemory }) -> "full" | "lite" | "off"` (fungsi murni, diekspor), dan `useCapabilities() -> { webgl: boolean, reducedMotion: boolean, tier: "full" | "lite" | "off" }`.

- [ ] **Step 1: Tambah script test**

```json
"test": "vitest run"
```

- [ ] **Step 2: Tulis test yang gagal**

```js
import { describe, it, expect } from "vitest";
import { classifyDevice } from "./useCapabilities";

describe("classifyDevice", () => {
  it("off when reduced motion", () =>
    expect(classifyDevice({ reducedMotion: true, hardwareConcurrency: 8, deviceMemory: 8 })).toBe("off"));
  it("lite on low-end device", () =>
    expect(classifyDevice({ reducedMotion: false, hardwareConcurrency: 4, deviceMemory: 2 })).toBe("lite"));
  it("full on capable device", () =>
    expect(classifyDevice({ reducedMotion: false, hardwareConcurrency: 8, deviceMemory: 8 })).toBe("full"));
  it("lite when deviceMemory is undefined but cores low", () =>
    expect(classifyDevice({ reducedMotion: false, hardwareConcurrency: 2, deviceMemory: undefined })).toBe("lite"));
});
```

- [ ] **Step 3: Run test, pastikan gagal**

Run: `npm test`
Expected: FAIL — `classifyDevice` is not a function.

- [ ] **Step 4: Implementasi `src/hooks/useCapabilities.js`**

`classifyDevice` murni: `off` jika `reducedMotion`; `lite` jika `hardwareConcurrency <= 4` atau `deviceMemory !== undefined && deviceMemory <= 2`; selain itu `full`.
`useCapabilities` membaca `window.matchMedia("(prefers-reduced-motion: reduce)")` (dengan listener `change`), mendeteksi WebGL lewat `document.createElement("canvas").getContext("webgl2") || getContext("webgl")`, membaca `navigator.hardwareConcurrency` / `navigator.deviceMemory`, dan mengembalikan tier dari `classifyDevice`. Jika `webgl` false → paksa tier `off`.

- [ ] **Step 5: Run test, pastikan lulus**

Run: `npm test`
Expected: PASS 4 tests.

- [ ] **Step 6: Commit**

```bash
git add src/hooks package.json package-lock.json
git commit -m "feat(hooks): add capability detection for 3d tier"
```

---

### Task 3: Motion primitives

**Files:**
- Create: `src/components/motion/Reveal.jsx`
- Create: `src/components/motion/Stagger.jsx`
- Create: `src/components/motion/TiltCard.jsx`
- Create: `src/components/motion/MagneticButton.jsx`
- Create: `src/components/motion/Counter.jsx`
- Create: `src/components/motion/GlowOrb.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Produces:
  - `<Reveal delay?={number} y?={number} as?="div">{children}</Reveal>`
  - `<Stagger gap?={number}>{children}</Stagger>` (each child wrapped by `Stagger.Item`)
  - `<Stagger.Item>{children}</Stagger.Item>`
  - `<TiltCard max?={number}>{children}</TiltCard>`
  - `<MagneticButton as?="a" href?="..." onClick?>{children}</MagneticButton>`
  - `<Counter to={number} suffix?="string" duration?={number} />`
  - `<GlowOrb className?>`

- [ ] **Step 1: `Reveal.jsx`**

`motion.div` dengan `initial={{opacity:0, y}}`, `whileInView={{opacity:1, y:0}}`, `viewport={{once:true, margin:"-80px"}}`, `transition={{duration:0.6, delay, ease:[0.22,1,0.36,1]}}`. Terima `className`.

- [ ] **Step 2: `Stagger.jsx`**

Parent sebagai `motion.div` dengan `variants` `{hidden:{}, show:{transition:{staggerChildren: gap}}}` dan `initial="hidden" whileInView="show" viewport={{once:true, margin:"-80px"}}`. `Stagger.Item` = `motion.div` dengan `variants={{hidden:{opacity:0,y:24}, show:{opacity:1,y:0, transition:{duration:0.5, ease:[0.22,1,0.36,1]}}}}`.

- [ ] **Step 3: `TiltCard.jsx`**

`useMotionValue` x/y → `useSpring(stiffness 260, damping 22)` → `useTransform` ke `rotateX`/`rotateY` maks `max` derajat (default 6). `onPointerMove` hitung posisi relatif; `onPointerLeave` reset ke 0. Matikan jika `window.matchMedia("(hover: none)").matches` (render div biasa). `style={{transformStyle:"preserve-3d"}}`.

- [ ] **Step 4: `MagneticButton.jsx`**

Wrapper `motion.a`/`motion.button` (pilih dari prop `as`), `useSpring` x/y, geser maks 6px mengikuti pointer relatif terhadap center, `whileHover={{scale:1.02}}`. Sama: nonaktif saat `(hover: none)`.

- [ ] **Step 5: `Counter.jsx`**

`useInView(ref, {once:true})`; saat true jalankan `animate(0, to, {duration: duration/1000, ease:"easeOut", onUpdate})` dari framer-motion, render `Math.round(v)` diikuti `suffix`. Kalau `useReducedMotion()` true, render `to` langsung tanpa animasi. `aria-label` = `${to}${suffix}`.

- [ ] **Step 6: `GlowOrb.jsx`**

`div` `absolute pointer-events-none` dengan `background: radial-gradient(circle, var(--glow), transparent 70%)`, `filter: blur(60px)`, opacity 0.25, dan parallax halus lewat `useScroll` + `useTransform` (y 0→40). Tidak menerima interaksi.

- [ ] **Step 7: Wire `MotionConfig` di `src/App.jsx`**

Bungkus `<RouterProvider>` dengan `<MotionConfig reducedMotion="user">` di dalam `LangProvider`.

- [ ] **Step 8: Verifikasi build**

Run: `npm run build`
Expected: exit 0. Tidak ada warning "use client" atau peer dependency baru.

- [ ] **Step 9: Commit**

```bash
git add src/components/motion src/App.jsx
git commit -m "feat(motion): add reveal/stagger/tilt/magnetic/counter primitives"
```

---

### Task 4: Background layer

**Files:**
- Create: `src/components/ui/BackgroundFX.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css` (keyframes noise/grid jika perlu)

**Interfaces:**
- Produces: `<BackgroundFX />` — satu layer `fixed inset-0 -z-10 pointer-events-none`.

- [ ] **Step 1: Implementasi `BackgroundFX.jsx`**

Tiga lapis dalam satu container: (a) radial gradient teal `rgba(20,255,236,0.08)` di `70% 10%`, (b) grid 48px `rgba(234,242,240,0.04)` via `background-image: linear-gradient(...), linear-gradient(...)` dengan `mask-image: radial-gradient(ellipse at center, black, transparent 75%)`, (c) noise SVG inline data-URI opacity 0.03. Semua CSS statis, tanpa JS.

- [ ] **Step 2: Pasang di `App.jsx`**

Render `<BackgroundFX />` sekali di dalam `Root()` sebelum `<Routes>`, dan `body` tetap `bg-dark`.

- [ ] **Step 3: Verifikasi visual**

Run: `npm run dev`, buka `/`.
Expected: grid samar + glow teal terlihat, tidak menangkap klik (klik CTA tetap jalan).

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/BackgroundFX.jsx src/App.jsx src/index.css
git commit -m "feat(ui): add static grid/glow background layer"
```

---

### Task 5: Static cube fallback

**Files:**
- Create: `src/components/hero/StaticCube.jsx`
- Create: `src/components/hero/heroVisual.css`

**Interfaces:**
- Produces: `<StaticCube className? />` — cube CSS 3D murni, tanpa JS interaktif.

- [ ] **Step 1: Struktur CSS 3D**

Container `perspective: 900px`, kubus `transform-style: preserve-3d` dengan 6 face (`translateZ(±90px)`, `rotateY(±90deg)`). Face: `background: linear-gradient(135deg, rgba(20,255,236,.10), rgba(234,242,240,.03))`, `border: 1px solid rgba(20,255,236,.35)`, `backdrop-filter: blur(2px)`. Isi tiap face: 3-4 `<span>` bar tipis (lebar bervariasi, tinggi 3px, background `rgba(20,255,236,.5)`) untuk kesan baris kode.

- [ ] **Step 2: Animasi idle**

`@keyframes float` (translateY ±8px, 6s ease-in-out infinite) dan `@keyframes spin` (`rotateX(-16deg) rotateY(0→360deg)`, 24s linear infinite) pada kubus. `@media (prefers-reduced-motion: reduce)` → `animation: none`.

- [ ] **Step 3: Verifikasi visual**

Run: `npm run dev`, buka `/about` sementara render manual (atau Storybook tidak ada — cukup cek lewat `heroSection` di Task 6).
Expected: kubus terlihat punya volume, bukan kotak datar.

- [ ] **Step 4: Commit**

```bash
git add src/components/hero/StaticCube.jsx src/components/hero/heroVisual.css
git commit -m "feat(hero): add css 3d cube fallback"
```

---

### Task 6: Hero 3D scene (async chunk)

**Files:**
- Create: `src/components/hero/HeroScene.jsx`
- Create: `src/components/hero/CodeCube.jsx`
- Create: `src/components/hero/HeroVisual.jsx`

**Interfaces:**
- Consumes: `useCapabilities()` dari Task 2, `StaticCube` dari Task 5.
- Produces: `<HeroVisual />` — komponen yang dipakai `heroSection.jsx`.

- [ ] **Step 1: `CodeCube.jsx`**

Props: `{ lite = false }`. Isi:
- `<RoundedBox args={[1.6,1.6,1.6]} radius={0.09} smoothness={4}>` dengan material glass. `lite` → `meshPhysicalMaterial` (`transmission 0.9, roughness 0.15, thickness 0.5, ior 1.45, color "#0D7377", transparent`). Non-lite → `<MeshTransmissionMaterial samples={4} resolution={256} thickness={0.7} roughness={0.08} ior={1.45} chromaticAberration={0.04} />` dari drei.
- `<Edges color="#14FFEC" lineWidth={1} transparent opacity={0.55} />` di dalam RoundedBox.
- Grup "kode": array 6 bar `<mesh>` dengan `boxGeometry args={[w,0.035,0.02]}` (w 0.3–0.7 acak deterministik), `meshBasicMaterial color="#14FFEC" transparent opacity={0.75}`, posisi y berjarak 0.12, z `0.55`. Satu bar kursor dengan opacity dianimasikan sinus `Math.sin(state.clock.elapsedTime*2)` di `useFrame`.
- Core: `<icosahedronGeometry args={[0.28,0]} />` + `<meshBasicMaterial wireframe color="#14FFEC" transparent opacity={0.5} />`, rotasi berlawanan.
- `useFrame`: rotasi idle `0.15 rad/s` pada sumbu Y; rotasi target dari pointer (`state.pointer.x * 0.25`, negatif untuk Y) di-lerp `THREE.MathUtils.damp(current, target, 3, delta)`.
- `lite`: turunkan baris kode ke 4 dan matikan `Edges` `lineWidth` (pakai 1).

- [ ] **Step 2: `HeroScene.jsx`**

```jsx
<Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} camera={{ position: [0,0,4.2], fov: 35 }}>
  <ambientLight intensity={0.35} />
  <directionalLight position={[3,4,2]} intensity={1.6} color="#14FFEC" />
  <directionalLight position={[-4,1,-2]} intensity={0.9} color="#EAF2F0" />
  <Environment resolution={128}>
    <LightFormer form="rect" intensity={2} color="#14FFEC" position={[3,3,2]} scale={[3,3,1]} />
    <LightFormer form="rect" intensity={1} color="#ffffff" position={[-3,0,1]} scale={[3,3,1]} />
    <LightFormer form="ring" intensity={1.5} color="#0D7377" position={[0,-3,-2]} scale={[2,2,1]} />
  </Environment>
  <Suspense fallback={null}><CodeCube lite={lite} /></Suspense>
</Canvas>
```

`frameloop` dikontrol dari prop `active` (`always`/`never`). Tidak ada postprocessing. Tidak ada `<OrbitControls>`.

- [ ] **Step 3: `HeroVisual.jsx`**

Logika:
1. `const { webgl, tier } = useCapabilities()`.
2. Selalu render `<StaticCube />` sebagai lapisan dasar (`absolute inset-0`).
3. State `sceneReady` (chunk mounted) dan `sceneFailed`.
4. `useEffect`: jika `webgl && tier !== "off"` → jadwalkan mount lewat `requestIdleCallback` (fallback `setTimeout 1200`) dan `cancelIdleCallback` di cleanup.
5. Mount `const HeroScene = lazy(() => import("./HeroScene"))` di dalam `<Suspense fallback={null}>`; bungkus dengan `<ErrorBoundary fallback={null}>` kecil lokal (class component) yang men-set `sceneFailed`.
6. Canvas dibungkus `motion.div` `initial={{opacity:0}} animate={{opacity: sceneReady ? 1 : 0}} transition={{duration:0.4}}`; `StaticCube` opacity jadi 0 saat `sceneReady`.
7. IntersectionObserver pada container → prop `active` ke `HeroScene`. `IO` di-disconnect di cleanup.
8. Container: `relative aspect-square w-full max-w-[420px] mx-auto` (mobile) / `aspect-square` penuh di kolom kanan desktop.

- [ ] **Step 4: Verifikasi chunk async**

Run: `npm run build`
Expected: ada file `dist/assets/HeroScene-*.js` terpisah. Grep `dist/assets/index-*.js` tidak mengandung `THREE.WebGLRenderer`.
Verifikasi: `grep -c "WebGLRenderer" dist/assets/index-*.js` → 0.

- [ ] **Step 5: Verifikasi fallback saat WebGL mati**

Sementara paksa `webgl: false` di `useCapabilities`, jalankan dev server.
Expected: hanya CSS cube tampil, console tanpa error. Kembalikan.

- [ ] **Step 6: Commit**

```bash
git add src/components/hero
git commit -m "feat(hero): add lazy-loaded three.js code cube with css fallback"
```

---

### Task 7: i18n stats numerik

**Files:**
- Modify: `src/i18n/en.json`
- Modify: `src/i18n/id.json`
- Create: `src/i18n/i18n.test.js`

**Interfaces:**
- Produces: `hero.statsYears: number`, `hero.statsProjects: number`, `hero.statsLocation: string`. Key `hero.stats` dan `hero.statsMobile` dihapus.

- [ ] **Step 1: Tulis test yang gagal**

```js
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
```

- [ ] **Step 2: Run test, pastikan gagal**

Run: `npm test`
Expected: FAIL — `statsYears` undefined.

- [ ] **Step 3: Update kedua JSON**

`en.json`: ganti `"stats"` dan `"statsMobile"` dengan `"statsYears": 3, "statsProjects": 20, "statsLocation": "PEKALONGAN, ID"`.
`id.json`: sama, dengan lokasi tetap `"PEKALONGAN, ID"` (identik dengan teks sekarang).

- [ ] **Step 4: Cari sisa pemakaian**

Run: `grep -rn "statsMobile\|hero.stats" src/`
Expected: hanya `heroSection.jsx` (akan diubah di Task 8).

- [ ] **Step 5: Run test, pastikan lulus**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/i18n
git commit -m "refactor(i18n): expose hero stats as numeric keys"
```

---

### Task 8: Hero section dua kolom

**Files:**
- Modify: `src/components/heroSection.jsx` (tulis ulang)
- Modify: `src/components/navbar.jsx` (focus ring + backdrop)

**Interfaces:**
- Consumes: `<HeroVisual />` (Task 6), `<Reveal>`/`<Stagger>` (Task 3), `<Counter>` (Task 3), key i18n (Task 7).

- [ ] **Step 1: Satukan DOM desktop/mobile**

Satu tree, bukan dua. Grid `grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16`, `min-h-[85vh]`, padding atas `pt-24`. Kolom kiri: badge, nama, typing, stats, subtitle, CTA. Kolom kanan: `<div className="order-first lg:order-none"><HeroVisual/></div>`.

- [ ] **Step 2: Ganti stats statis dengan Counter**

Render: `<Counter to={t("hero.statsYears")} suffix="+ YEARS" />` • `<Counter to={t("hero.statsProjects")} suffix="+ PROJECTS" />` • `<span>{t("hero.statsLocation")}</span>`. Teks akhir harus persis `3+ YEARS • 20+ PROJECTS • PEKALONGAN, ID`.

Catatan: `t()` saat ini mengembalikan value apa pun; pastikan angka dikirim sebagai `number` (JSON sudah number, jadi `to={Number(t("hero.statsYears"))}`).

- [ ] **Step 3: Ukuran responsif**

Nama: `text-5xl sm:text-6xl lg:text-7xl xl:text-8xl`. Typing: `text-2xl sm:text-3xl lg:text-4xl`. Hapus varian mobile khusus (huruf `FARID` besar + letterSpacing) — sekarang satu layout.

- [ ] **Step 4: Bungkus dengan Reveal**

Badge, nama, typing, stats, subtitle, CTA masing-masing `<Reveal delay={n*0.08}>`; CTA pakai `<MagneticButton>` untuk tombol primary.

- [ ] **Step 5: Navbar**

Tambah `focus-visible:ring-2 focus-visible:ring-primary/60` pada `Link` dan tombol bahasa; ganti `bg-dark/80` → `bg-dark/70`. Tidak mengubah struktur.

- [ ] **Step 6: Verifikasi visual**

Run: `npm run dev`, buka `/` di desktop dan mobile viewport.
Expected: cube tampil di kanan (desktop) / atas (mobile), teks stats sama persis dengan sebelumnya, typing masih jalan, CTA mengarah ke `/projects` dan `/contact`.

- [ ] **Step 7: Commit**

```bash
git add src/components/heroSection.jsx src/components/navbar.jsx
git commit -m "feat(hero): two-column layout with 3d cube and counters"
```

---

### Task 9: Terapkan motion ke halaman

**Files:**
- Modify: `src/views/home.jsx`
- Modify: `src/views/projects.jsx`
- Modify: `src/views/about.jsx`
- Modify: `src/views/contact.jsx`
- Modify: `src/views/articles.jsx`
- Modify: `src/views/projectsDetail.jsx`
- Modify: `src/views/articleDetail.jsx`
- Modify: `src/components/aboutSection.jsx`
- Modify: `src/components/techStackSection.jsx`

**Interfaces:**
- Consumes: `Reveal`, `Stagger`, `Stagger.Item`, `TiltCard` (Task 3), `.card` (Task 1).

- [ ] **Step 1: Home**

Heading "Featured Projects" → `<Reveal>`. Grid dibungkus `<Stagger gap={0.07}>`, tiap card `<Stagger.Item>` + `<TiltCard>` + `className="card"` (ganti `rounded-lg border border-dark2 p-6 hover:...`).

- [ ] **Step 2: Projects**

Header `<Reveal>`. Grid `<Stagger>` + `<TiltCard className="card ...">`. Skeleton state tidak dianimasikan.

- [ ] **Step 3: About**

`aboutSection.jsx`: kolom teks `<Reveal>`, chip stats `<Stagger>`, avatar `<Reveal>`. `techStackSection.jsx`: judul `<Reveal>`, chip container `<Stagger>`.
`about.jsx`: blok Activity Graph dibungkus `<Reveal>` dan class `card`.

- [ ] **Step 4: Contact**

Heading `<Reveal y={32}>`, deskripsi `<Reveal delay={0.08}>`, tiap `SocialIcon` dibungkus `<Stagger.Item>` dalam `<Stagger>`.

- [ ] **Step 5: Articles + detail pages**

`articles.jsx`: hanya heading `<Reveal>`. Card artikel **tidak** diubah kelasnya.
`projectsDetail.jsx`: bungkus blok `<div className="w-full px-6 ... py-10">` dengan `<Reveal>`; jangan sentuh `<Swiper>`.
`articleDetail.jsx`: bungkus wrapper konten dengan `<Reveal>`.

- [ ] **Step 6: Verifikasi visual semua rute**

Run: `npm run dev`, kunjungi `/`, `/about`, `/projects`, `/projects/<slug>`, `/articles`, `/articles/<slug>`, `/contact`.
Expected: tidak ada elemen yang tertinggal invisible (opacity 0 permanen), Swiper detail masih bisa digeser, tidak ada layout shift saat reveal.

- [ ] **Step 7: Commit**

```bash
git add src/views src/components/aboutSection.jsx src/components/techStackSection.jsx
git commit -m "feat: apply reveal/stagger/tilt motion across pages"
```

---

### Task 10: Verifikasi akhir

**Files:** tidak ada perubahan kode kecuali perbaikan yang ditemukan.

- [ ] **Step 1: Lint**

Run: `npm run lint`
Expected: exit 0, 0 warning (config `--max-warnings 0`).

- [ ] **Step 2: Test**

Run: `npm test`
Expected: semua PASS.

- [ ] **Step 3: Build + ukur bundle**

Run: `npm run build`
Hitung gzip: `gzip -c dist/assets/index-*.js | wc -c`
Expected: naik ≤ 60KB dibanding build `main`. Chunk `HeroScene-*.js` ada dan tidak direferensikan dari `index-*.js` selain sebagai dynamic import.

- [ ] **Step 4: Lighthouse manual**

DevTools → Lighthouse → mode Mobile, category Performance + Accessibility + Best Practices.
Expected: Performance ≥ 85, Accessibility ≥ 95.

- [ ] **Step 5: Cek reduced motion**

DevTools → Rendering → `prefers-reduced-motion: reduce`, reload `/`.
Expected: tidak ada cube berputar, tidak ada fade-in, semua konten langsung terlihat.

- [ ] **Step 6: Cek navigasi berulang**

Navigasi `/` → `/about` → `/` lima kali.
Expected: satu canvas saja, tidak ada duplikasi, tidak ada error di console.

- [ ] **Step 7: Commit perbaikan (jika ada)**

```bash
git add -A
git commit -m "fix: address issues found in final verification"
```
