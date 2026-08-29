# SEO Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Switch hash router to browser router, add react-helmet-async meta per page, robots.txt, dynamic sitemap + shim HTML for articles/projects, GH Pages SPA fallback for vard.is-a.dev.

**Architecture:** SPA tetap CSR, meta dinamis via Helmet, build-time Node script fetch GAS API generate sitemap/shim, 404.html copy untuk GH Pages refresh, base "/" untuk custom domain.

**Tech Stack:** Vite 8, React 18, react-router-dom 7.18.3, react-helmet-async, Node fetch (native), GH Pages

## Global Constraints

- Domain: https://vard.is-a.dev (canonical base)
- Hosting: GitHub Pages dist folder, custom domain, no SSR
- Router: createBrowserRouter, base "/"
- Articles data: https://script.google.com/macros/s/.../exec?sheet=Articles
- Projects data: https://script.google.com/macros/s/.../exec
- Must keep i18n id/en hreflang

---

### Task 1: Setup SEO infra + react-helmet-async

**Files:**
- Modify: `package.json`
- Create: `src/components/SEO.jsx`
- Modify: `src/App.jsx`
- Modify: `vite.config.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: react-helmet-async, LangContext
- Produces: SEO({title, description, canonical, image, type, noindex, article}) component, HelmetProvider wrapper

- [ ] **Step 1: Install dep**

```bash
npm install react-helmet-async
```

- [ ] **Step 2: Create SEO component**

`src/components/SEO.jsx` — Helmet with title, description, canonical, og:*, twitter:*, hreflang id/en, JSON-LD Person/WebSite/Article, noindex support. Defaults: siteUrl=https://vard.is-a.dev, siteName=Farid Fatkhurrozak, defaultImage=/profile.png

- [ ] **Step 3: Wrap App with HelmetProvider + fix router**

`src/App.jsx`: `createHashRouter` → `createBrowserRouter`, wrap with `<HelmetProvider>`, keep Routes, add GH Pages SPA decode not needed yet.

- [ ] **Step 4: Update vite.config.js base**

```js
export default defineConfig({ plugins:[react()], base:"/" })
```

- [ ] **Step 5: Update index.html defaults + SPA GH script**

Add default description, og, twitter, canonical placeholder, theme-color, robots, plus GH SPA script (head + body decode).

- [ ] **Step 6: Verify dev builds**

Run: `npm run build` expected PASS, `npm run dev` route /about works without #

- [ ] **Step 7: Commit**

```bash
git add package.json src/components/SEO.jsx src/App.jsx vite.config.js index.html
git commit -m "feat(seo): helmet provider, browser router, base SEO"
```

### Task 2: Static SEO files + GH Pages fallback

**Files:**
- Create: `public/robots.txt`
- Create: `public/.nojekyll`
- Create: `scripts/generate-sitemap.mjs`
- Modify: `package.json` (scripts)
- Modify: `public/sitemap.xml` (initial fallback)

**Interfaces:**
- Consumes: GAS API fetch, dist/index.html template
- Produces: public/sitemap.xml, dist/sitemap.xml, dist/404.html, dist/articles/:slug/index.html shims

- [ ] **Step 1: robots.txt**

```
User-agent: *
Allow: /
Sitemap: https://vard.is-a.dev/sitemap.xml
```

- [ ] **Step 2: .nojekyll**

empty file

- [ ] **Step 3: generate-sitemap.mjs**

Fetch GAS endpoints, build urlset (/,/about,/projects,/articles,/contact + slugs), write sitemap.xml, copy dist/index.html → shim per slug injecting title/meta/canonical/OG/JSON-LD, copy dist/index.html → dist/404.html. Fail soft fallback.

- [ ] **Step 4: package.json scripts**

```json
"postbuild": "node scripts/generate-sitemap.mjs"
```

- [ ] **Step 5: Initial sitemap fallback in public/**

Static sitemap with 7 URLs for offline build.

- [ ] **Step 6: Build verify**

Run: `npm run build` check `dist/sitemap.xml`, `dist/404.html`, `dist/articles/*` exists

- [ ] **Step 7: Commit**

```bash
git add public/robots.txt public/.nojekyll public/sitemap.xml scripts/generate-sitemap.mjs package.json
git commit -m "feat(seo): robots, sitemap generator, gh-pages fallback"
```

### Task 3: Inject SEO per view

**Files:**
- Modify: `src/views/home.jsx`
- Modify: `src/views/about.jsx`
- Modify: `src/views/projects.jsx`
- Modify: `src/views/projectsDetail.jsx`
- Modify: `src/views/articles.jsx`
- Modify: `src/views/articleDetail.jsx`
- Modify: `src/views/contact.jsx`
- Modify: `src/views/notFound.jsx`

**Interfaces:**
- Consumes: SEO component, useLang, pickLangField
- Produces: Each view renders <SEO> with correct props

- [ ] **Step 1: Home/About/Projects/Articles/Contact/NotFound static SEO**

Each file import SEO, add `<SEO title="..." description="..." canonical="https://vard.is-a.dev/..." />` with id/en variants via t() or pickLang.

- [ ] **Step 2: ArticleDetail & ProjectDetail dynamic SEO**

After fetch, compute title/desc/image/canonical, render SEO with type=article, article meta, noindex false. Loading state renders fallback SEO.

- [ ] **Step 3: Verify**

`npm run build && npx serve dist` manual check view-source meta per route

- [ ] **Step 4: Commit**

```bash
git add src/views/*.jsx
git commit -m "feat(seo): per-page meta OG canonical hreflang"
```

### Task 4: Final verification

**Files:**
- None (verification only)

- [ ] **Step 1: Build & inspect**

```bash
npm run build
cat dist/sitemap.xml
cat dist/robots.txt
ls dist/404.html
ls dist/articles
```

Expected: sitemap contains vard.is-a.dev URLs, 404.html equals index.html, shims exist

- [ ] **Step 2: Lighthouse**

Run Lighthouse SEO audit ≥90

- [ ] **Step 3: Deploy**

Push dist to gh-pages (user manual) or `gh-pages` action. Verify https://vard.is-a.dev/sitemap.xml live
