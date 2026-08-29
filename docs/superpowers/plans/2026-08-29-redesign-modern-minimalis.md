# Redesign Modern Minimalis (Editorial Refine) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign full-site portfolio jadi modern minimalis editorial refine tanpa ubah palet, motion hanya Tailwind transition.

**Architecture:** Style-only changes per component (navbar, hero, projects list/detail, about/techStack, contact). Pertahankan routing `src/App.jsx:16` `createHashRouter` dan data flow GAS `fetch` + `localStorage`. Konsisten container `max-w-6xl mx-auto` dan token `white/5`.

**Tech Stack:** React 18, Tailwind 3.4.3, Vite 8.2.2, Swiper 14.2.0, react-type-animation 3.2.0, AntD 5.15.4 (existing, no new deps).

## Global Constraints
- Warna lock `tailwind.config.js:9-13` primary `#14FFEC` secondary `#0D7377` light `#EBF3E8` dark `#212121` dark2 `#323232` — tidak diubah, hanya pakai opacity `white/5`, `light/60/75/80`, `primary/20/30` (verbatim dari spec).
- No new dependencies — hanya `transition` Tailwind, tanpa `framer-motion`.
- Full-site scope `src/App.jsx:27-33` — 5 route wajib konsisten.
- Motion minimal `duration-200` `transition-colors` / `transition`.
- Build must pass `npm run build` `vite v8.2.2` `✓ 1457 modules` baseline 527kB (warning chunk >500kB allowed).

---

## File Structure

**Modified:**
- `src/index.css` — global antialiased + selection
- `src/components/navbar.jsx:50-80` — glass blur + border
- `src/components/heroSection.jsx:26-38` — typography + min-h
- `src/components/aboutSection.jsx:26-49` — bio opacity + SocialIcon hover
- `src/components/techStackSection.jsx:35-44` — pill cards
- `src/views/projects.jsx:33-86` — editorial list + divider + image border + skeleton
- `src/views/projectsDetail.jsx:27-59` — hero rounded + swiper + prose
- `src/views/contact.jsx:15-27` — card border + icon hover
- `src/views/about.jsx:12-17` — ghchart wrapper
- `src/components/drawerMenu.jsx` (inspect, adjust border if needed)
- `tailwind.config.js` — no change (verify)

**No new files.**

---

### Task 1: Global Tokens & Layout Container

**Files:**
- Modify: `src/index.css:1-18`
- Modify: `src/views/about.jsx:12-17`
- Test: `verify build` + visual `max-w-6xl`

**Interfaces:**
- Consumes: existing `tailwind.config.js:7-13` colors
- Produces: global `antialiased` + `.selection` + consistent container class used by Task 2-7

- [ ] **Step 1: Patch `src/index.css` tambah antialiased & selection**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
    font-family: "Poppins", sans-serif;
}

html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

::selection { background-color: rgb(20 255 236 / 0.2); }

.hero-text {
    font-family: "Hammersmith One", serif;
    font-weight: 600;
    letter-spacing: 1.5px;
}

.ant-drawer-body {
    background-color: #212121;
}
```

- [ ] **Step 2: Verify `src/views/about.jsx` ghchart wrapper (prep untuk Task 7 tapi test container)**

Run: `npm run build`
Expected: `✓ 1457 modules transformed` `✓ built in ~1s` PASS

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "style(global): antialiased + selection + hero tracking refine"
```

---

### Task 2: Navbar Glass Refine

**Files:**
- Modify: `src/components/navbar.jsx:50-80`
- Modify: `src/components/drawerMenu.jsx` (if exists, border tweak)
- Test: `npm run build` + scroll check `backdrop-blur`

**Interfaces:**
- Consumes: Task 1 global tokens
- Produces: `bg-dark/80 backdrop-blur-md border-b border-white/5 h-16` class contract for all pages

- [ ] **Step 1: Edit `src/components/navbar.jsx:50` container**

Old:
```jsx
<div className="fixed flex flex-row bg-dark w-full items-center p-8 text-light">
```
New:
```jsx
<div className="fixed top-0 z-50 flex flex-row bg-dark/80 backdrop-blur-md border-b border-white/5 w-full items-center px-6 md:px-10 h-16 text-light">
```

- [ ] **Step 2: Edit link hover `src/components/navbar.jsx:55-73` tambah transition**

Change each `Link` from `hover:text-primary` to `hover:text-primary transition-colors duration-200` (3 links: `/about`, `/projects`, `/contact`).

- [ ] **Step 3: Avatar border `src/components/navbar.jsx:25`**

Old: `border-2 border-primary`
New: `border-2 border-primary/30`

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: PASS, visually navbar blur on scroll

- [ ] **Step 5: Commit**

```bash
git add src/components/navbar.jsx
git commit -m "style(navbar): glass blur + border-white/5 + h-16"
```

---

### Task 3: Hero Section Refine

**Files:**
- Modify: `src/components/heroSection.jsx:26-38`
- Test: `npm run build` + responsive 375/768

**Interfaces:**
- Consumes: Task 2 navbar height `h-16`
- Produces: `min-h-[85vh]` hero contract

- [ ] **Step 1: Edit Desktop `src/components/heroSection.jsx:26`**

Old:
```jsx
<div className="hidden w-full h-screen px-10 md:flex flex-col justify-center pt-10">
    <span className="hero-text text-8xl text-light">Farid Fatkhurrozak</span>
    {typing("hero-text text-5xl lg:text-6xl mt-2 text-primary")}
    <span className="mt-10 text-3xl text-light">❝ No Hugging, Only Debugging ❞ 🤸‍♂️</span>
</div>
```
New:
```jsx
<div className="hidden w-full min-h-[85vh] px-6 md:px-10 max-w-6xl mx-auto md:flex flex-col justify-center pt-16">
    <span className="hero-text text-7xl md:text-8xl tracking-tight leading-none text-light">Farid Fatkhurrozak</span>
    {typing("hero-text text-4xl lg:text-5xl mt-3 tracking-tight text-primary")}
    <span className="mt-8 text-lg text-light/60 max-w-3xl">❝ No Hugging, Only Debugging ❞ 🤸‍♂️</span>
</div>
```

- [ ] **Step 2: Edit Mobile `src/components/heroSection.jsx:33`**

Old: `w-full h-screen px-8 flex ... text-7xl ... text-4xl ... text-base`
New: `w-full min-h-[85vh] px-6 flex ... text-6xl ... text-3xl ... text-light/60 max-w-3xl`

Full new mobile block:
```jsx
<div className="w-full min-h-[85vh] px-6 flex flex-col justify-center md:hidden max-w-6xl mx-auto">
    <span className="hero-text text-6xl sm:text-7xl tracking-tight leading-none text-light">Farid</span>
    <span className="hero-text text-3xl sm:text-5xl tracking-tight leading-none text-light">Fatkhurrozak</span>
    {typing("mt-5 hero-text text-xl sm:text-2xl tracking-tight text-primary")}
    <span className="mt-8 text-base text-light/60">❝ No Hugging, Only Debugging ❞ 🤸‍♂️</span>
</div>
```

- [ ] **Step 3: Verify**

Run: `npm run build` Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/heroSection.jsx
git commit -m "style(hero): editorial scale min-h-[85vh] tracking-tight"
```

---

### Task 4: Projects List Editorial Refine

**Files:**
- Modify: `src/views/projects.jsx:33-86`
- Test: `npm run build` + empty/skeleton visual

**Interfaces:**
- Consumes: Task 1 container, Task 2 navbar
- Produces: `py-12 border-b border-white/5` item contract, image `rounded-xl border`

- [ ] **Step 1: Edit wrapper `src/views/projects.jsx:33`**

Old: `w-full pt-32 px-10 text-light`
New: `w-full pt-24 px-6 md:px-10 max-w-6xl mx-auto text-light`

Old title: `hero-text text-5xl sm:text-7xl mb-16`
New: `hero-text text-5xl sm:text-6xl tracking-tight leading-none mb-12`

- [ ] **Step 2: Edit item `src/views/projects.jsx:39`**

Old: `w-full flex flex-col-reverse  md:flex-row pb-16`
New: `w-full flex flex-col-reverse md:flex-row gap-8 py-12 border-b border-white/5 last:border-0`

Title link `text-3xl sm:text-4xl text-primary` -> `text-2xl sm:text-3xl text-primary hover:text-primary/80 transition-colors duration-200`

Meta row `text-lg` -> `text-sm text-light/60`

Desc `text-md mt-3 whitespace-pre-wrap` -> `text-[15px] leading-relaxed text-light/75 mt-3 whitespace-pre-wrap line-clamp-3`

Date `text-sm text-primary mt-2` -> `text-xs tracking-wide text-primary/70 mt-3`

Image `rounded-lg w-full h-fit ...` -> `rounded-xl w-full aspect-[16/10] object-cover border border-white/5 hover:border-white/10 transition`

- [ ] **Step 3: Edit skeleton `src/views/projects.jsx:72-86`**

Old inner `bg-dark2 animate-pulse rounded-md`
New: `bg-dark2/50 animate-pulse rounded-xl border border-white/5`

Wrapper `mb-16` -> `py-12 border-b border-white/5`

- [ ] **Step 4: Verify**

Run: `npm run build` Expected: PASS, list divider visible

- [ ] **Step 5: Commit**

```bash
git add src/views/projects.jsx
git commit -m "style(projects): editorial divider + clamped desc + rounded-xl"
```

---

### Task 5: Project Detail Refine

**Files:**
- Modify: `src/views/projectsDetail.jsx:27-59`
- Test: `npm run build` + Swiper navigation

**Interfaces:**
- Consumes: Task 4 image border contract
- Produces: `rounded-2xl` hero, `prose` desc

- [ ] **Step 1: Edit desc `src/views/projectsDetail.jsx:20`**

Old: `w-full px-10 md:px-28 py-16 text-xl md:text-3xl text-light whitespace-pre-wrap`
New: `w-full px-6 md:px-10 max-w-6xl mx-auto py-12 text-base md:text-lg leading-relaxed text-light/80 whitespace-pre-wrap prose prose-invert max-w-none`

- [ ] **Step 2: Edit hero image `src/views/projectsDetail.jsx:34`**

Old: `w-full md:w-1/2 rounded-lg mb-5`
New: `w-full md:w-3/4 aspect-[16/10] object-cover rounded-2xl border border-white/5 mb-8`

- [ ] **Step 3: Edit slider image class `src/views/projectsDetail.jsx:29`**

Old: `md:w-3/4 rounded-md` / `h-96 md:h-screen rounded-md`
New: `md:w-3/4 rounded-xl border border-white/5` / `h-96 md:h-[70vh] object-contain rounded-xl border border-white/5 bg-dark2/30`

- [ ] **Step 4: Verify**

Run: `npm run build` Expected: PASS, swiper renders

- [ ] **Step 5: Commit**

```bash
git add src/views/projectsDetail.jsx
git commit -m "style(detail): rounded-2xl hero + prose desc"
```

---

### Task 6: About Section + TechStack Refine

**Files:**
- Modify: `src/components/aboutSection.jsx:26-49`
- Modify: `src/components/techStackSection.jsx:35-51`
- Test: `npm run build`

**Interfaces:**
- Consumes: Task 1-2 tokens
- Produces: pill card `rounded-2xl border-white/5` contract

- [ ] **Step 1: About bio `src/components/aboutSection.jsx:44`**

Old: `text-light ... text-xl md:text-2xl`
New: `text-light/75 text-lg md:text-xl leading-relaxed whitespace-pre-wrap`

SocialIcon already patched `bg-light/90` in prior commit — add hover:

Edit `src/components/aboutSection.jsx:89` inner `SocialIcon` wrapper:

Old: `w-12 h-12 rounded-full bg-light inline-flex ...`
New: `w-11 h-11 rounded-full bg-light/90 hover:bg-light transition duration-200 inline-flex justify-center items-center border border-white/5`

- [ ] **Step 2: TechStack cards `src/components/techStackSection.jsx:39-42`**

Old:
```jsx
<div key={index} className="pb-5 flex flex-col items-center">
    <img className="w-10 h-10" src={"tech-icons/" + item.icon}/>
    <span className="text-light text-xs mt-2">{item.name}</span>
</div>
```
New:
```jsx
<div key={index} className="flex flex-col items-center gap-2 p-3 bg-dark2/50 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-dark2 transition duration-200">
    <img className="w-8 h-8" src={"tech-icons/" + item.icon}/>
    <span className="text-light/70 text-[11px] tracking-wide">{item.name}</span>
</div>
```

Grid old `grid-cols-4 sm:grid-cols-5` -> `grid-cols-4 sm:grid-cols-5 gap-4`

Wrapper old `w-full px-10 mt-44 mb-24` -> `w-full px-6 md:px-10 max-w-6xl mx-auto mt-32 mb-24`

- [ ] **Step 3: Verify**

Run: `npm run build` Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/aboutSection.jsx src/components/techStackSection.jsx
git commit -m "style(about): pill tech cards + relaxed bio"
```

---

### Task 7: Contact + GhChart Wrapper + Final Verification

**Files:**
- Modify: `src/views/contact.jsx:15-27`
- Modify: `src/views/about.jsx:12-17`
- Test: `npm run build` + responsive check

**Interfaces:**
- Consumes: all prior tasks
- Produces: final visual consistency

- [ ] **Step 1: Contact wrapper `src/views/contact.jsx:18`**

Old: `w-full px-10 pt-32`
New: `w-full px-6 md:px-10 max-w-6xl mx-auto pt-24`

Title old `text-6xl sm:text-8xl lg:text-9xl` -> `text-6xl sm:text-7xl lg:text-8xl tracking-tight leading-none`

Subtitle `text-5xl sm:text-6xl` -> `text-4xl sm:text-5xl tracking-tight text-primary`

Desc `text-xl md:text-2xl md:pr-10` -> `text-lg md:text-xl text-light/75 leading-relaxed`

SocialIcon `src/views/contact.jsx:72` add hover:

Old: `flex flex-row items-center py-2`
New: `flex flex-row items-center py-3 hover:translate-x-1 transition duration-200`

Icon circle `w-7 h-7` -> `w-8 h-8 bg-light/90 border border-white/5`

- [ ] **Step 2: GhChart `src/views/about.jsx:12`**

Old: `<div className="hidden md:block w-full px-10 mt-44 mb-24">`
New: `<div className="hidden md:block w-full px-6 md:px-10 max-w-6xl mx-auto mt-32 mb-24 rounded-2xl border border-white/5 bg-dark2/30 p-6">`

Inner title `text-3xl` -> `text-2xl tracking-tight`, image `w-full` -> `w-full rounded-xl`

- [ ] **Step 3: Final verification**

Run:
```bash
npm run build
npm run lint
```
Expected: build PASS `✓ 1457 modules`, lint 0 warnings

Manual: check 375/768/1280 — navbar blur, divider, rounded, hover.

- [ ] **Step 4: Commit**

```bash
git add src/views/contact.jsx src/views/about.jsx
git commit -m "style(contact): hover translate + ghchart glass panel"
```

---

## Self-Review
- Spec coverage: Tokens ✅ Task1, Navbar/Hero ✅ Task2-3, Projects list/detail ✅ Task4-5, About/Tech/Contact/ghchart ✅ Task6-7 — all spec sections mapped.
- Placeholder scan: no TBD/TODO, all code blocks complete, exact paths `src/...:line`.
- Type consistency: Tailwind classes `border-white/5`, `bg-dark2/50`, `text-light/75` consistent across tasks, `max-w-6xl mx-auto px-6 md:px-10` repeated verbatim.
