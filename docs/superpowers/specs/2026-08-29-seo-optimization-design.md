# SEO Optimization — robots.txt, sitemap, meta — Design

**Date:** 2026-08-29
**Project:** react_porto (Farid Fatkhurrozak portfolio)
**Domain:** https://vard.is-a.dev
**Hosting:** GitHub Pages (dist folder, custom domain)
**Stack:** Vite 8 + React 18 + react-router-dom 7 (currently createHashRouter)

## Problem

- `createHashRouter` → URL `/#/about` fragment tidak di-crawl. Sitemap useless. Share preview pecah.
- `index.html` meta statis, title tunggal. Tiap route (`/`, `/about`, `/projects`, `/articles`, `/contact`, `/projects/:slug`, `/articles/:slug`) butuh title/description/canonical/OG unik.
- Tidak ada `robots.txt`, `sitemap.xml`, `hreflang`, `JSON-LD`, `canonical`.
- Data `projects` & `articles` dari Google Apps Script (`script.google.com`) — dinamis, butuh sitemap yang ikut dinamis agar article ter-index.
- GitHub Pages tidak support SPA fallback native (refresh `/about` → 404).

## Goals

- URL bersih `https://vard.is-a.dev/about` (BrowserRouter), SEO-friendly.
- Tiap halaman punya meta lengkap, OG/Twitter, canonical, hreflang id/en.
- `robots.txt` + `sitemap.xml` dinamis (include article & project slugs terbaru).
- Articles ter-index Google + preview sosmed (WA/Twitter/FB) tampil judul/desc/image tanpa JS.
- Tetap purely static (no SSR server), deploy via `dist` ke GitHub Pages.

## Non-Goals

- SSR/SSG full framework (Next.js/Astro). Tetap Vite SPA.
- Prerender semua konten dinamis server-side per-request.

## Approach — C Lite (chosen)

**B + generator dinamis + prerender ringan.**

- Switch Hash → BrowserRouter
- `react-helmet-async` untuk meta dinamis
- SPA fallback untuk GH Pages (copy `index.html` → `404.html` + `spa-github-pages` 404 trick)
- Build-time script `scripts/generate-sitemap.mjs` fetch API → generate `public/sitemap.xml` + `dist/sitemap.xml` + shim HTML `dist/articles/:slug/index.html` & `dist/projects/:slug/index.html` (inject meta OG/canonical) untuk crawler sosmed.
- `public/robots.txt` statis

### Alternatives considered

- **B only:** sitemap statis, CSR + Helmet. Google OK (JS render), sosmed preview kosong. Reject karena user mau articles ter-index sempurna.
- **Full vite prerenderer plugin:** heavier, API fetch di plugin config lebih kompleks, kurang fleksibel untuk GH Pages. Script custom lebih kontrol.

## Architecture

```
index.html (base meta) 
  └─ src/App.jsx (createBrowserRouter + HelmetProvider + ScrollTop)
     └─ src/components/SEO.jsx (single SEO component)
        └─ views/* (Home, About, Projects, Articles, ArticleDetail, ProjectDetail, Contact, NotFound)

public/robots.txt
public/sitemap.xml  (generated, checked in as fallback)
scripts/generate-sitemap.mjs  (fetch GAS → write sitemap + shim HTML)
vite.config.js  (base:/, build)
dist/  (404.html = index.html copy)
dist/sitemap.xml
dist/articles/<slug>/index.html
dist/projects/<slug>/index.html
```

## Components / Changes

### 1. Router fix — `src/App.jsx`

- `createHashRouter` → `createBrowserRouter`
- Keep `<Routes>` structure, add `HelmetProvider` wrapper
- `ScrollTop` tetap
- Add hydration for GH Pages SPA redirect: script decode `?p=` query (rafrexgh trick)

### 2. SEO component — `src/components/SEO.jsx` (new)

Props: `title, description, canonical, image, type, article {date,author}, lang, noindex`

Responsibilities:
- `<Helmet>` inject: `<title>`, `meta description`, `canonical`, `og:*`, `twitter:*`, `hreflang`, `robots`, `theme-color`
- JSON-LD: Person, WebSite, Article/Project via `application/ld+json`
- Defaults fallback: siteName=`Farid Fatkhurrozak`, base=`https://vard.is-a.dev`, default OG image=`/profile.png`, locale `id_ID`/`en_US`

Usage in views: each view imports SEO and sets props. `ArticleDetail`/`ProjectDetail` set after fetch (fallback + update).

### 3. View updates

- `Home`, `About`, `Projects`, `Articles`, `Contact`, `NotFound`: static meta via SEO
- `ArticleDetail`, `ProjectDetail`: dynamic meta — title = `pickLangField`, description = trimmed content (160 chars), image = first project image / article image, canonical = `https://vard.is-a.dev/articles/<slug>`, JSON-LD Article

### 4. `index.html`

- Add default meta: description, keywords, author, robots, theme-color, OG default, twitter default, canonical placeholder, `hreflang` x-default, `preconnect` fonts tetap, GH Pages SPA restore script

### 5. `vite.config.js`

- `base: "/"` (custom domain)
- Ensure `publicDir: "public"`, build outDir `dist`

### 6. `public/robots.txt` (new)

```
User-agent: *
Allow: /
Sitemap: https://vard.is-a.dev/sitemap.xml
```

### 7. `scripts/generate-sitemap.mjs` (new)

- Fetch `https://script.google.com/macros/.../exec` (projects) dan `.../exec?sheet=Articles`
- Build URL list: `/`, `/about`, `/projects`, `/articles`, `/contact` + `/projects/<slug>` + `/articles/<slug>`
- Write `public/sitemap.xml` & `dist/sitemap.xml` (urlset, lastmod, changefreq, priority)
- Generate shim HTML for each slug: read `dist/index.html`, replace `<title>`, inject `meta og`, `canonical`, `description`, `JSON-LD`, write to `dist/projects/<slug>/index.html` and `dist/articles/<slug>/index.html` — file shim hanya untuk crawler, JS app tetap hydrate normal (via meta in shim, GH Pages will serve shim HTML for that path because folder exists).

Edge: fetch gagal → fallback sitemap statis (7 URL), build tidak gagal.

NPM scripts: `"prebuild": "node scripts/generate-sitemap.mjs || echo sitemap fallback"`, `"postbuild": "node scripts/generate-sitemap.mjs --shim"`

Or single `postbuild` after vite build to copy sitemap + generate shims.

### 8. GH Pages fallback

- `public/404.html` akan di-generate postbuild sebagai copy `dist/index.html`
- Add `ghspa` redirect script in `index.html` head + decode script in body
- Ensure `.nojekyll` in `public/` / `dist/`

## Data Flow

1. Build start → Vite build → `dist/index.html` + assets
2. `postbuild` script fetch GAS → parse slugs
3. Script write `dist/sitemap.xml` (and sync to `public/`)
4. Script for each slug write `dist/articles/<slug>/index.html` shim (template = dist/index.html + head injection)
5. Copy `dist/index.html` → `dist/404.html`
6. Deploy `dist` to `gh-pages` branch (custom domain `vard.is-a.dev` via CNAME)

Runtime: user visit `vard.is-a.dev/articles/my-post` → GH Pages serves `dist/articles/my-post/index.html` (pre-injected meta) → React app hydrates → fetch fresh article data → Helmet updates meta (consistent).

Direct refresh `/about` without shim: GH Pages serves `404.html` (which is SPA) → JS decode → correct route.

## Error Handling

- GAS fetch error/timeout → log, generate sitemap statis saja
- `localStorage` parse error → ignore, fetch fallback
- Missing slug/image → SEO fallback to default image/description, `noindex` false tetap (kecuali `NotFound` → `noindex:true`)

## Testing

- `npm run build` lokal, inspect `dist/sitemap.xml` berisi article slugs, `dist/404.html` exists, `dist/articles/<slug>/index.html` meta OK
- `npx serve dist` test refresh `/about`, `/articles/<slug>`
- Google: `https://vard.is-a.dev/sitemap.xml` reachable, Search Console submit, Rich Results Test
- Sosmed: `https://www.opengraph.xyz/` check article URL preview
- Lighthouse SEO audit ≥ 90

## Commit Plan

- One commit: `feat(seo): browser router, helmet, robots, sitemap dinamis + gh-pages fallback`

## Open Issues

- Site base path for GH Pages custom domain is `/` — confirmed via `vard.is-a.dev`.
- No sitemap index needed yet (URL count < 50k).
