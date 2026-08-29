# Portfolio Atelier Grid — Total Refactor Design Spec
Date: 2026-08-29 | Status: Approved | Vibe: Clean Swiss | Palette: keep dark teal

## 1. Objective
Total refactor portfolio `react_porto` jadi modern minimal Swiss yang wow, fokus *Projects case study*, audience hybrid (hiring + client + brand), tetap dark `#212121` + teal `#14FFEC` sebagai aksen tipis.

## 2. Architecture & Layout
- Stack: React 18, Vite 8.2.2, Tailwind 3.4.3, React Router 7 hash, Swiper 14, TypeAnimation. No new deps, Inter via Google Fonts.
- Shell: `max-w-[1280px] max-w-6xl mx-auto px-6 md:px-10`, 12-col grid `gap-6`, section `py-24 md:py-32`, hairline `border-white/5`, navbar `fixed h-16 bg-dark/80 backdrop-blur-md border-b`.
- Routes: `/` (hero + selected 4 projects + about teaser + tech pills + contact), `/projects` (grid all), `/projects/:slug` (editorial detail + sticky meta + swiper), `/about` (full story + ghChart), `/contact`, `/notfound`.
- Naming: keep `src/views/*.jsx`, `src/components/*.jsx`, `src/App.jsx` createHashRouter.

## 3. Visual System — Swiss + Dark Teal
- Tokens: `dark #212121` bg, `dark2 #323232` card@50%+border, `light #EBF3E8` text (80 body /60 meta /75 desc), `primary #14FFEC` accent hover/underline/pill, `secondary #0D7377` alt link, `border white/5`, `muted light/40 label`.
- Typography: Inter 300-700 global (`* Inter`, `hero-text Inter 600 -0.02em tracking-tight`), hero `text-7xl md:text-8xl leading-[0.9]`, section label `text-xs tracking-[0.2em] uppercase text-light/40`, body `text-[15px] leading-relaxed`.
- Effects: `transition-colors duration-200` only, `hover:border-white/10 hover:bg-dark2/50`, no gradient/shadow, `rounded-lg` card / `rounded-md` image (swiss sharp), `prefers-reduced-motion` disables.
- Navbar: `h-16 px-6 md:px-10`, links `text-sm tracking-wide hover:text-primary`.
- Hero: pill `AVAILABLE FOR NEW PROJECTS` (`rounded-full border border-primary/20 text-primary text-xs tracking-widest`), headline 2-line, stats bar `3+ years • 20+ projects • Pekalongan` (`text-sm text-light/60`), CTA `View Projects (primary)` + `Contact (ghost border)`.

## 4. Components
### 4.1 Projects Grid Card (Bento 2-col)
- Container `rounded-lg border border-white/5 overflow-hidden hover:border-white/10 transition`.
- Inner `p-6`: top `01 — WEB APP • 2024` (`text-xs tracking-widest text-light/40`), title `Link hero-text text-2xl font-semibold tracking-tight hover:text-primary/80`, meta `createBy icon + Link • secondary hover`, desc `line-clamp-2 text-light/70 leading-relaxed`, image `aspect-[16/10] object-cover rounded-md border border-white/5 mt-4`.
- Grid `grid-cols-1 md:grid-cols-2 gap-6`, pagination skeletons `rounded-lg animate-pulse`.
### 4.2 Project Detail Editorial
- Cover `aspect-[16/9] rounded-lg border`, sticky meta left `Stack • Year • Link` (`text-sm`), body `prose prose-invert max-w-none text-light/80 whitespace-pre-wrap py-12`, Swiper `rounded-lg border`.
### 4.3 Tech Pills
- `flex flex-wrap gap-2` `px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-xs tracking-wide text-light/70` + icon 16px, no card grid.
### 4.4 About
- 2-col `md:grid-cols-2 gap-8`, left `profile.png rounded-lg border`, right `text-lg leading-relaxed text-light/75` + `Social pills` (`w-11 h-11 rounded-full bg-light/90 border`).
- GhChart `rounded-lg border bg-dark2/30 p-6` hidden mobile.
### 4.5 Contact
- `hero-text 6xl/8xl Let's/Connect`, desc `text-light/75`, SocialIcon `py-3 hover:translate-x-1` + `w-8 h-8 rounded-full bg-light/90 border`.

## 5. Data & Interaction
- Load: `useState localStorage projects` → `fetch AppsScript exec` → set + cache; profil `?sheet=Profil` → json[0] → localStorage profil. `fetch` catch log, fallback cache. Loading skeletons, error no crash.
- Nav: `Link to=/projects/:slug state=item`, detail guard `state==null → Navigate /notfound`. Add `useEffect scrollTo(0,0)` on route change.
- Images: `projects/{file}` + `tech-icons/{svg}` `loading=lazy` grid, avatar pulse placeholder.
- Hover: `border-white/10` + `bg-dark2/50` + `text-primary/80`, focus `ring-1 ring-primary/30`.

## 6. Polish, A11y, Perf
- 8dp rhythm, `max-w-6xl` konsisten, responsive 375/768/1280 + landscape, touch ≥44px, contrast ≥4.5:1, `aria-hidden` decorative, `alt` meaningful, `cursor-pointer`.
- Perf: no extra deps, single Inter request, CSS <26kB, JS <530kB, `gap`/`space-y` only.
- Verification: `npm run build` PASS (vite 1457 modules), `npm run lint` 0 warnings, manual 375/768/1280 + reduced-motion.

## 7. Success Criteria
- Recruiter paham stack + projects dalam 30s, client lihat CTA + contact 1 tap, visual Clean Swiss bukan corporate template, case study depth terbaca, build/lint pass.

## 8. Out of Scope
- Blog/CMS, i18n, auth, payment, new backend, light mode. Warna tema tidak diganti (keep dark teal).

## 9. File Map
- Edit: `src/index.css`, `tailwind.config.js`, `src/components/navbar.jsx`, `heroSection.jsx`, `aboutSection.jsx`, `techStackSection.jsx`, `src/views/home.jsx`, `projects.jsx`, `projectsDetail.jsx`, `about.jsx`, `contact.jsx`, `src/App.jsx`.
- Docs: this spec. No new routes.

## 10. Risks
- Image ratio inconsistency → enforce `aspect-[16/10]` + `object-cover`. Long desc overflow → `line-clamp-2` + `whitespace-pre-wrap` detail.
