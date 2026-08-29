# Design Spec — Redesign Modern Minimalis Portfolio (Editorial Refine)

**Date:** 2026-08-29
**Scope:** Full-site (`src/App.jsx:27-33` — `/`, `/about`, `/projects`, `/projects/:slug`, `/contact`)
**Constraints:** Warna tema lock `tailwind.config.js:9-13` (`primary #14FFEC`, `secondary #0D7377`, `light #EBF3E8`, `dark #212121`, `dark2 #323232`) — tidak diubah. No new deps, minimal motion (Tailwind `transition` only).

## 1. Context & Goals
- Current: `heroSection.jsx:26` hero 8xl padat, `projects.jsx:39` flex-col list tanpa divider, `techStackSection.jsx:35` grid icon rapat, `navbar.jsx:50` solid `bg-dark`.
- Goals: modern minimalis ala Soft Minimal + Glass tapi motion minimal (opsi A), kesan lega, hierarchy jelas, tetap dark portfolio dev. Verifikasi via `npm run build` + responsive 375/768/1280.

## 2. Decisions
- Scope: A Full-site (disetujui)
- Arah visual: B Soft Minimal + Glass (disetujui) namun eksekusi via **Pendekatan B Editorial Refine** (dipilih user — diff kecil, risiko rendah)
- Motion: A Minimal — hanya `hover` + `transition-colors 200ms`, tanpa `framer-motion`

## 3. Approaches Considered
- **A Glass Bento (rekomendasi awal):** bento grid 12-col, `bg-dark2/50 backdrop-blur`, blur navbar. Trade-off: impact tinggi tapi ubah layout projects besar.
- **B Editorial Refine (chosen):** pertahankan single column, tambah divider `h-px bg-white/5`, spacing `gap-12`, border `white/5` halus. Trade-off: aman, modern tanpa overhaul.
- **C Panel Glass:** wrapper `rounded-3xl` per section. Trade-off: kotak-kotak, nesting berat mobile.

## 4. Design — Section 1 Tokens & Global
- Token baru: `white/5` untuk border/divider, `light/60`, `light/75`, `light/80`, `primary/20`, `primary/30`.
- Layout: `max-w-6xl mx-auto px-6 md:px-10 lg:px-16` konsisten semua views.
- Typography: `hero-text tracking-tight leading-none`, body `text-light/80 antialiased`, accent `text-primary`.
- Global: `body bg-dark`, `selection:bg-primary/20`, divider `h-px bg-white/5`.

## 5. Design — Section 2 Navbar + Hero
- Navbar `src/components/navbar.jsx:50`: `fixed h-16 bg-dark/80 backdrop-blur-md border-b border-white/5`, link `hover:text-primary transition-colors duration-200` (`:55-73`), avatar border `border-primary/30`.
- Hero `src/components/heroSection.jsx:26-38`: scale `text-7xl md:text-8xl tracking-tight`, wrapper `min-h-[85vh]` bukan `h-screen`, quote `text-light/60 text-lg max-w-3xl`, TypeAnimation tetap `text-primary`.

## 6. Design — Section 3 Projects List & Detail
- List `src/views/projects.jsx:33-70`: `gap-12`, item `py-12 border-b border-white/5 last:border-0`, title `text-3xl hover:text-primary transition`, meta `text-sm text-light/60`, desc `text-light/75 leading-relaxed line-clamp-3`, date `text-primary/70 text-sm`, image `rounded-xl border border-white/5 hover:border-white/10 transition aspect-[16/10] object-cover`.
- Skeleton `:72-86`: `rounded-xl bg-dark2/50`.
- Detail `src/views/projectsDetail.jsx:27-32`: hero `rounded-2xl border border-white/5`, Swiper `rounded-xl overflow-hidden`, pagination bullet primary, desc `prose prose-invert max-w-none text-light/80 whitespace-pre-wrap`.

## 7. Design — Section 4 About / TechStack / Contact
- About `src/components/aboutSection.jsx:26-49`: bio `text-light/75 leading-relaxed whitespace-pre-wrap`, SocialIcon `bg-light/90 hover:bg-light transition`, avatar `border border-white/10`.
- TechStack `src/components/techStackSection.jsx:35-44`: gap `gap-4`, card `p-3 bg-dark2/50 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-dark2 transition`, icon `w-10 h-10`.
- Contact `src/views/contact.jsx:15-27`: card `rounded-2xl border border-white/5 p-8`, SocialIcon `py-3 hover:translate-x-1 transition`.
- ghchart `src/views/about.jsx:12-17`: wrapper `rounded-2xl border border-white/5 p-6`.
- Error: empty projects `text-light/50`, detail null -> `Navigate to="/notfound"`.

## 8. Architecture & Data Flow
- Tetap `createHashRouter` `src/App.jsx:16`, `HashRouter` + `Routes`. No routing change.
- Data flow tidak berubah: Projects fetch GAS `projects.jsx:23`, Profil fetch `aboutSection.jsx:12` dengan `localStorage` cache.
- Component isolation: Navbar, HeroSection, AboutSection, TechStack, ProjectSection, ProjectDetail — style-only changes, no prop API change.

## 9. Error Handling & Testing
- Build check: `npm run build` must `✓ 1457 modules` (baseline `527kB`). Warning chunk >500kB tetap.
- Responsive: 375, 768, 1280 manual check.
- Empty/error states preserved.

## 10. Non-Goals
- Tidak ganti palet, tidak tambah `framer-motion`, tidak ubah struktur data GAS, tidak code-split baru.

## 11. Implementation Order (for writing-plans)
1. Tokens & layout container
2. Navbar + Hero
3. Projects list + skeleton
4. Project detail Swiper
5. About + TechStack + Contact
