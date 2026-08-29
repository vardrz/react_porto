/* eslint-disable react/prop-types */
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://vard.is-a.dev";
const SITE_NAME = "Farid Fatkhurrozak";
const DEFAULT_TITLE = "Farid Fatkhurrozak | Software Developer";
const DEFAULT_DESC =
  "Web & Mobile developer — React, Flutter, Go. Fokus bikin produk bersih, cepat, mudah dirawat. 3+ tahun, 20+ proyek, Pekalongan ID.";
const DEFAULT_IMAGE = `${SITE_URL}/profile.png`;

export default function SEO({
  title,
  description,
  canonical,
  image,
  type = "website",
  noindex = false,
  article, // { publishedTime, modifiedTime, author, tags }
  lang = "id",
}) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESC;
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const img = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`
    : DEFAULT_IMAGE;
  const canonicalHref = canonical ? url : SITE_URL + "/";

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Farid Fatkhurrozak",
    url: SITE_URL,
    image: DEFAULT_IMAGE,
    jobTitle: "Software Developer",
    address: { "@type": "PostalAddress", addressLocality: "Pekalongan", addressCountry: "ID" },
    sameAs: [
      "https://github.com/vardrz",
      "https://www.linkedin.com/in/vardrz",
      "https://instagram.com/vard.rz",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ["id-ID", "en-US"],
  };

  const articleJsonLd =
    type === "article" && article
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title || DEFAULT_TITLE,
          description: desc,
          image: img,
          author: { "@type": "Person", name: article.author || SITE_NAME },
          datePublished: article.publishedTime,
          dateModified: article.modifiedTime || article.publishedTime,
          mainEntityOfPage: url,
        }
      : null;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{pageTitle}</title>
      <meta name="description" content={desc} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonicalHref} />

      {/* hreflang */}
      <link rel="alternate" hrefLang="id" href={url} />
      <link rel="alternate" hrefLang="en" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content={lang === "id" ? "id_ID" : "en_US"} />
      {type === "article" && article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      <meta name="theme-color" content="#0a0a0a" />

      <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteJsonLd)}</script>
      {articleJsonLd && <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>}
    </Helmet>
  );
}

export { SITE_URL };
