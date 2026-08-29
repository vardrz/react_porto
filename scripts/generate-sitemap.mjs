#!/usr/bin/env node
// Generate sitemap.xml + shim HTML for GH Pages (articles/projects) + 404.html + robots
// Fail soft: fallback to static sitemap if fetch fails
import { writeFileSync, existsSync, mkdirSync, readFileSync, copyFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";

const SITE = "https://vard.is-a.dev";
const GAS_PROJECTS = "https://script.google.com/macros/s/AKfycbznmENKsG0AzxvG1-1Z7iTbFA5FxwF9mTnp1sXajPqKYvgYOI43zNL-MZHLb3Zj5NEUSg/exec";
const GAS_ARTICLES = "https://script.google.com/macros/s/AKfycbznmENKsG0AzxvG1-1Z7iTbFA5FxwF9mTnp1sXajPqKYvgYOI43zNL-MZHLb3Zj5NEUSg/exec?sheet=Articles";

const staticUrls = [
  { loc: `${SITE}/`, changefreq: "weekly", priority: "1.0" },
  { loc: `${SITE}/articles`, changefreq: "weekly", priority: "0.9" },
];

async function fetchJson(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const j = await r.json();
    return Array.isArray(j) ? j : [];
  } catch (e) {
    console.warn(`[sitemap] fetch fail ${url}:`, e.message);
    return null;
  } finally { clearTimeout(t); }
}

function toSitemap(urls) {
  const today = new Date().toISOString().slice(0,10);
  const rows = urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod || today}</lastmod><changefreq>${u.changefreq||"weekly"}</changefreq><priority>${u.priority||"0.6"}</priority></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</urlset>\n`;
}

function escapeHtml(s){ return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;") }
function trimDesc(s, n=160){ const t=String(s||"").replace(/\s+/g," ").trim(); return t.length>n ? t.slice(0,n-1)+"…" : t }

function shimHtml(template, { title, desc, canonical, image, type, publishedTime }) {
  let html = template;
  const siteName = "Farid Fatkhurrozak";
  const pageTitle = title ? `${title} | ${siteName}` : `${siteName} | Software Developer`;
  const url = `${SITE}${canonical}`;
  const img = image?.startsWith("http") ? image : `${SITE}${image || "/profile.png"}`;
  const ld = type==="article" ? `<script type="application/ld+json">${JSON.stringify({ "@context":"https://schema.org","@type":"Article", headline:title, description:desc, image:img, datePublished:publishedTime, mainEntityOfPage:url })}</script>` : "";
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(pageTitle)}</title>`);
  html = html.replace(/<meta name="description"[^>]*>/, "");
  html = html.replace(/<link rel="canonical"[^>]*>/, "");
  html = html.replace(/<meta property="og:[^>]*>/g, "");
  html = html.replace(/<meta name="twitter:[^>]*>/g, "");
  const inject = `
    <meta name="description" content="${escapeHtml(desc)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${type||"website"}" />
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(desc)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${img}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(desc)}" />
    <meta name="twitter:image" content="${img}" />
    ${publishedTime ? `<meta property="article:published_time" content="${publishedTime}" />`: ""}
    ${ld}
  `;
  return html.replace("</head>", `${inject}\n</head>`);
}

async function main(){
  const isShimMode = process.argv.includes("--shim") || existsSync("dist/index.html");
  const urls = [...staticUrls];

  const articles = await fetchJson(GAS_ARTICLES);
  if (articles) {
    for (const a of articles) if (a.slug) urls.push({ loc: `${SITE}/articles/${a.slug}`, changefreq:"monthly", priority:"0.7", lastmod: a.date ? undefined : undefined });
  }

  const xml = toSitemap(urls);
  // write public + dist
  writeFileSync("public/sitemap.xml", xml);
  console.log(`[sitemap] wrote public/sitemap.xml (${urls.length} urls)`);
  if (existsSync("dist")) {
    writeFileSync("dist/sitemap.xml", xml);
    writeFileSync("dist/robots.txt", "User-agent: *\nAllow: /\nSitemap: https://vard.is-a.dev/sitemap.xml\n");
    if (!existsSync("dist/.nojekyll")) writeFileSync("dist/.nojekyll", "");
    // 404.html = index.html copy + GH Pages SPA redirect script already in index
    if (existsSync("dist/index.html")) {
      copyFileSync("dist/index.html", "dist/404.html");
      console.log("[sitemap] dist/404.html copied");
      // replace 404.html with GH Pages SPA redirect trick: if direct visit, redirect via ?p=
      // Use rafgraph trick: 404.html captures path and redirects to index.html?p=...
      const idx = readFileSync("dist/index.html","utf8");
      const gh404 = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Redirect</title><script>sessionStorage.redirect=location.href;location.replace(location.pathname.split('/').slice(0,1).join('/')+'/?p='+encodeURIComponent(location.pathname.slice(1)+location.search).replace(/&/g,'~and~')+location.hash)</script></head><body>Redirecting...</body></html>`;
      // Keep dist/404.html as GH trick if base is / — but we already copied SPA index; GH Pages will serve 404.html for unknown paths, SPA index handles it.
      // So we keep copied SPA as 404.html (works for custom domain). No overwrite needed.
      // Generate shims
      try {
        const tmpl = idx;
        let shimCount=0;
        if (articles) for (const a of articles) if (a.slug) {
          const title = a.title_id || a.title_en || a.title || a.slug;
          const content = a.content_id || a.content_en || a.content || "";
          const desc = trimDesc(content) || `Tulisan ${title}`;
          const html = shimHtml(tmpl, { title, desc, canonical:`/articles/${a.slug}`, image:"/profile.png", type:"article", publishedTime: a.date });
          const dir = join("dist","articles",a.slug);
          mkdirSync(dir,{recursive:true});
          writeFileSync(join(dir,"index.html"), html);
          shimCount++;
        }
        console.log(`[sitemap] shims generated: ${shimCount}`);
      } catch(e){ console.warn("[sitemap] shim fail", e.message)}
    }
  }
}

main().catch(e=>{ console.error(e); process.exit(0); });
