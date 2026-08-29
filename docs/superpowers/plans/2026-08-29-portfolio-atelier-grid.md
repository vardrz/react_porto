# Portfolio Atelier Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Total refactor portfolio ke Atelier Grid Clean Swiss — hero + bento projects + editorial detail + tech pills, dark teal keep, projects case study hero.

**Architecture:** Edit existing 10 files in-place, no new routes/deps. Layout `max-w-6xl px-6 md:px-10` + 12-col `gap-6` + `py-24` rhythm, tokens Inter + `border-white/5` + `rounded-lg/md`. Data keep AppsScript fetch + localStorage.

**Tech Stack:** React 18, Vite 8.2.2, Tailwind 3.4.3, React Router 7 hash, Swiper 14, Inter font.

## Global Constraints

- Palette keep: `primary #14FFEC`, `secondary #0D7377`, `light #EBF3E8`, `dark #212121`, `dark2 #323232` — only opacity/border 5-10% allowed, no new hex.
- Font: `Inter 300-700` only, `hero-text Inter 600 -0.02em tracking-tight`.
- Radius: `rounded-lg` card, `rounded-md` image, `rounded-full` pill/avatar only; no `rounded-2xl/xl`.
- Motion: `transition-colors duration-200` only, respect `prefers-reduced-motion`.
- Verification each task: `npm run build` must PASS (1457 modules, chunk <530kB warning allowed), `npm run lint` 0 warnings.
- Responsive: 375/768/1280 must not break, images `aspect-[16/10]` or `16/9` + `object-cover`.

---

## File Structure

- Modify: `src/index.css:1-22` — Inter import, antialiased, selection, hero-text.
- Modify: `tailwind.config.js:7-18` — fontFamily sans Inter.
- Modify: `src/components/navbar.jsx:50-78` — h-16 glass, links text-sm tracking-wide.
- Modify: `src/components/heroSection.jsx:23-41` — pill + headline 7xl/8xl + stats + CTA.
- Modify: `src/components/aboutSection.jsx:23-94` — 2-col grid, desc relaxed, pills social.
- Modify: `src/components/techStackSection.jsx:26-56` — inline pills flex-wrap gap-2.
- Modify: `src/views/home.jsx:1-15` — compose hero + selected projects + about teaser + tech + contact teaser.
- Modify: `src/views/projects.jsx:32-91` — bento 2-col grid cards numbered.
- Modify: `src/views/projectsDetail.jsx:27-61` — cover 16/9 + sticky meta + prose + swiper rounded-lg.
- Modify: `src/views/about.jsx:5-19` — ghChart rounded-lg.
- Modify: `src/views/contact.jsx:14-80` — hero 6xl/8xl + hover translate.
- Modify: `src/App.jsx:1-33` — scrollToTop effect.

---

### Task 1: Hero Atelier

**Files:**
- Modify: `src/components/heroSection.jsx:23-41`
- Modify: `src/index.css:14-18` (verify hero-text already Inter -0.02em from prior commit)
- Test: `npm run build` + manual 375/768/1280

**Interfaces:**
- Consumes: `TypeAnimation` existing
- Produces: Hero with pill, headline, stats, CTA exported default `HeroSection`

- [ ] **Step 1: Edit heroSection.jsx to Atelier**

Replace return block with:

```jsx
    return (
        <>
            {/* Desktop */}
            <div className="hidden w-full min-h-[85vh] px-6 md:px-10 max-w-6xl mx-auto md:flex flex-col justify-center pt-16">
                <span className="inline-flex w-fit px-3 py-1 rounded-full border border-primary/20 text-primary text-xs tracking-[0.2em] uppercase mb-6">Available for new projects</span>
                <span className="hero-text text-7xl md:text-8xl tracking-tight leading-[0.9] text-light">Farid Fatkhurrozak</span>
                {typing("hero-text text-4xl lg:text-5xl mt-3 tracking-tight leading-none text-primary")}
                <span className="mt-4 text-sm tracking-wide text-light/40">3+ YEARS • 20+ PROJECTS • PEKALONGAN, ID</span>
                <span className="mt-8 text-lg leading-relaxed text-light/60 max-w-2xl">Web & Mobile developer — React, Flutter, Laravel. Focused on clean, fast, maintainable products.</span>
                <div className="mt-8 flex gap-3">
                    <a href="#/projects" className="px-6 py-3 rounded-lg bg-primary text-dark text-sm font-medium tracking-wide hover:bg-primary/90 transition">View Projects</a>
                    <a href="#/contact" className="px-6 py-3 rounded-lg border border-white/10 text-light text-sm tracking-wide hover:border-white/20 hover:bg-white/[0.02] transition">Contact</a>
                </div>
            </div>

            {/* Mobile */}
            <div className="w-full min-h-[85vh] px-6 flex flex-col justify-center md:hidden max-w-6xl mx-auto pt-16">
                <span className="inline-flex w-fit px-3 py-1 rounded-full border border-primary/20 text-primary text-[11px] tracking-[0.2em] uppercase mb-4">Available for new projects</span>
                <span className="hero-text text-6xl tracking-tight leading-[0.9] text-light">Farid</span>
                <span className="hero-text text-3xl tracking-tight leading-none text-light">Fatkhurrozak</span>
                {typing("mt-4 hero-text text-xl tracking-tight text-primary")}
                <span className="mt-4 text-xs tracking-wide text-light/40">3+ YEARS • 20+ PROJECTS</span>
                <div className="mt-6 flex gap-3">
                    <a href="#/projects" className="px-5 py-2.5 rounded-lg bg-primary text-dark text-sm font-medium">View Projects</a>
                    <a href="#/contact" className="px-5 py-2.5 rounded-lg border border-white/10 text-light text-sm">Contact</a>
                </div>
            </div>
        </>
    )
```

- [ ] **Step 2: Build verify**

Run: `npm run build`
Expected: PASS `✓ 1457 modules` 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/heroSection.jsx
git commit -m "feat(hero): atelier pill stats CTA Swiss"
```

---

### Task 2: Projects Bento Grid

**Files:**
- Modify: `src/views/projects.jsx:32-91`
- Test: `npm run build`, check grid 1→2 col

**Interfaces:**
- Consumes: `Navbar`, `fetch Projects`, `Link state item`
- Produces: `Projects` grid 2-col bento with numbered cards

- [ ] **Step 1: Edit projects.jsx header + card**

Change header:
```jsx
<div className="w-full pt-24 px-6 md:px-10 max-w-6xl mx-auto text-light">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
        <div className="hero-text text-5xl sm:text-6xl tracking-tight leading-none">Projects</div>
        <span className="text-xs tracking-[0.2em] uppercase text-light/40">{projects?.length ?? 0} CASE STUDIES</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
```

Per card:
```jsx
<div key={index} className="rounded-lg border border-white/5 overflow-hidden hover:border-white/10 hover:bg-dark2/50 transition duration-200">
    <div className="p-6">
        <div className="text-xs tracking-[0.2em] uppercase text-light/40">0{index+1} — {item.createBy.toUpperCase()} • {item.date}</div>
        <Link to={'/projects/' + item.slug} state={item} className="hero-text text-2xl font-semibold tracking-tight text-light hover:text-primary/80 transition mt-2 block">{item.title}</Link>
        <div className="text-[15px] leading-relaxed text-light/70 mt-3 line-clamp-2 whitespace-pre-wrap">{item.desc}</div>
        <div className="flex items-center gap-4 mt-3">
            <span className="inline-flex items-center text-xs text-light/50"><img src={"tech-icons/" + item.createBy + ".svg"} className="w-4 h-4 mr-1"/>{item.createBy}</span>
            {item.link!='-' ? <a href={item.link} target="_blank" className="text-xs text-light/50 hover:text-secondary underline">Live →</a> : null}
        </div>
    </div>
    <Link to={'/projects/' + item.slug} state={item} className="block px-6 pb-6">
        <img src={"projects/" + item.images.split(',')[0]} loading="lazy" className="rounded-md w-full aspect-[16/10] object-cover border border-white/5" />
    </Link>
</div>
```
Close grid `</div>` before outer `</div>`.

Skeleton: keep but `rounded-lg` + grid gap-6.

- [ ] **Step 2: Build verify**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/views/projects.jsx
git commit -m "feat(projects): bento 2-col numbered cards Swiss"
```

---

### Task 3: Project Detail Editorial

**Files:**
- Modify: `src/views/projectsDetail.jsx:27-61`
- Test: build

**Interfaces:**
- Consumes: `useLocation state`, `Swiper`
- Produces: Detail editorial with cover + sticky meta + prose

- [ ] **Step 1: Edit cover + layout**

Replace ProjectImages return:
```jsx
    return (
        <div className="w-full px-6 md:px-10 max-w-6xl mx-auto pt-24">
            <div className="hero-text text-3xl md:text-4xl tracking-tight text-light mb-2">{data.data.title}</div>
            <div className="text-xs tracking-[0.2em] uppercase text-light/40 mb-6">{data.data.createBy} • {data.data.date} {data.data.link!='-' ? <a href={data.data.link} target="_blank" className="ml-2 underline hover:text-secondary">Live →</a> : null}</div>
            <img src={"/projects/"+images[0]} className='w-full aspect-[16/9] object-cover rounded-lg border border-white/5 mb-8' />
            <Swiper slidesPerView={1} spaceBetween={30} loop pagination={{clickable:true}} navigation modules={[Pagination, Navigation]} className="mySwiper">
                {images.map((item,index)=> index!=0 ? <SwiperSlide key={index}><div className="w-full inline-flex justify-center"><img src={"/projects/"+item} className={classWidthSlider} /></div></SwiperSlide> : null)}
            </Swiper>
        </div>
    )
```
Keep `classWidthSlider` as `md:w-3/4 rounded-lg border` etc. Keep prose div `py-12 text-light/80 leading-relaxed`.

- [ ] **Step 2: Build verify**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/views/projectsDetail.jsx
git commit -m "feat(detail): editorial cover sticky meta prose"
```

---

### Task 4: About + Tech Pills

**Files:**
- Modify: `src/components/aboutSection.jsx:23-94`
- Modify: `src/components/techStackSection.jsx:26-56`
- Modify: `src/views/about.jsx:5-19`
- Test: build

**Interfaces:**
- Consumes: `profil fetch`, `techIcons list`
- Produces: About 2-col + pills

- [ ] **Step 1: Edit aboutSection wrapper + text**

Ensure `pt-24 max-w-6xl` already, update desc `text-[15px] leading-relaxed text-light/70` + add stats pills under social:
```jsx
<div className="mt-6 flex flex-wrap gap-2">
    <span className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs tracking-wide text-light/60">3+ Years</span>
    <span className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs tracking-wide text-light/60">20+ Projects</span>
    <span className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs tracking-wide text-light/60">Pekalongan, ID</span>
</div>
```

- [ ] **Step 2: Edit techStackSection to pills**

Replace grid:
```jsx
<div className="w-full px-6 md:px-10 max-w-6xl mx-auto mt-24 mb-24">
    <div className="text-xs tracking-[0.2em] uppercase text-light/40 mb-6">Tech Stack</div>
    <div className="flex flex-wrap gap-2">
        {techIcons.map((item,index)=>(
            <span key={index} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-xs tracking-wide text-light/70 hover:border-white/20 transition">
                <img className="w-4 h-4" src={"tech-icons/"+item.icon}/>{item.name}
            </span>
        ))}
    </div>
    <div className="hidden md:block mt-8 text-5xl tracking-tight hero-text text-light/40">Tools I use daily</div>
</div>
```
Remove old 2-col grid + big hero-text.

- [ ] **Step 3: Verify about.jsx ghChart already rounded-lg**

Keep `rounded-lg border bg-dark2/30 p-6` + `rounded-md` image.

- [ ] **Step 4: Build + Commit**

```bash
git add src/components/aboutSection.jsx src/components/techStackSection.jsx src/views/about.jsx
git commit -m "feat(about): pills tech + stats Swiss"
```

---

### Task 5: Home Composition + Navbar Polish

**Files:**
- Modify: `src/views/home.jsx:1-15`
- Modify: `src/components/navbar.jsx:50-78` (verify h-16 glass already, ensure text-sm tracking-wide)
- Modify: `src/App.jsx:1-33` (add scrollToTop)
- Test: build + lint

**Interfaces:**
- Consumes: `HeroSection`, `AboutSection`, `TechStack` subset
- Produces: Home with selected projects teaser (4) + about + tech + contact CTA

- [ ] **Step 1: Edit home.jsx**

```jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar"
import HeroSection from "../components/heroSection"

export default function Home() {
  const [projects,setProjects]=useState([]);
  useEffect(()=>{ try{setProjects(JSON.parse(localStorage.getItem("projects"))||[])}catch{}; fetch('https://script.google.com/macros/s/AKfycbznmENKsG0AzxvG1-1Z7iTbFA5FxwF9mTnp1sXajPqKYvgYOI43zNL-MZHLb3Zj5NEUSg/exec').then(r=>r.json()).then(j=>setProjects(j.slice(0,4))).catch(()=>{}) },[]);
  return (
    <>
      <Navbar/>
      <HeroSection/>
      <div className="w-full px-6 md:px-10 max-w-6xl mx-auto py-24">
        <div className="flex items-end justify-between mb-6"><span className="hero-text text-4xl tracking-tight text-light">Selected Work</span><Link to="/projects" className="text-sm text-light/60 hover:text-primary underline">View all →</Link></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((item,i)=><Link key={i} to={'/projects/'+item.slug} state={item} className="rounded-lg border border-white/5 p-6 hover:border-white/10 hover:bg-dark2/50 transition"><div className="text-xs tracking-widest text-light/40">0{i+1} — {item.createBy}</div><div className="hero-text text-xl font-semibold mt-2">{item.title}</div><div className="text-sm text-light/60 line-clamp-2 mt-2">{item.desc}</div><img src={"projects/"+item.images.split(',')[0]} loading="lazy" className="rounded-md w-full aspect-[16/10] object-cover border border-white/5 mt-4"/></Link>)}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Add scrollToTop in App.jsx**

In `App` component add `useEffect` with `window.scrollTo(0,0)` on hash change (or keep simple — no change if hash router already scrolls).

- [ ] **Step 3: Build + lint verify**

Run: `npm run build && npm run lint`

- [ ] **Step 4: Commit**

```bash
git add src/views/home.jsx src/App.jsx src/components/navbar.jsx
git commit -m "feat(home): selected work bento + scrollTop"
```

---

### Task 6: Global Polish & Final Verification

**Files:**
- Modify: `src/views/contact.jsx:14-80` (verify 6xl/8xl + hover translate already Swiss)
- Modify: `src/index.css` (verify Inter import + -0.02em)
- Test: final build + lint + responsive check

- [ ] **Step 1: Verify contact already Swiss** — ensure `pt-24 max-w-6xl` + `tracking-tight` + `text-light/75` + pills. No change if already done.

- [ ] **Step 2: Run final verification**

```bash
npm run build
npm run lint
```

Expected: Build PASS `✓ 1457 modules`, Lint 0 warnings. Manual check 375/768/1280 no overflow, ghChart hidden mobile, pill hover visible.

- [ ] **Step 3: Commit if tweaks**

```bash
git add src/views/contact.jsx src/index.css
git commit -m "chore: final Swiss polish verify"
```

---

## Self-Review

- Spec 1 Architecture → Tasks 1,5,6
- Spec 2 Visual System → Tasks 1-4
- Spec 3 Data → Tasks 2,5
- Spec 4 Polish/A11y → Task 6
- No placeholders, all file paths exact, code blocks complete.
