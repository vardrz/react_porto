import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import { useLang } from "../context/LangContext";
import { pickLangField } from "../context/pickLang";
import SEO from "../components/SEO";
import Reveal from "../components/motion/Reveal";
import Stagger from "../components/motion/Stagger";
import { fetchJson, readArrayCache } from "../utils/network";

const API = "https://script.google.com/macros/s/AKfycbznmENKsG0AzxvG1-1Z7iTbFA5FxwF9mTnp1sXajPqKYvgYOI43zNL-MZHLb3Zj5NEUSg/exec?sheet=Articles";

export default function Articles(){
    const { lang } = useLang();
    return (
        <>
            <SEO title={lang==="id"?"Tulisan":"Blog"} canonical="/articles" description="Catatan & tulisan Farid tentang web, mobile, dan engineering." lang={lang} />
            <Navbar/>
            <ArticleSection/>
        </>
    )
 }

function ArticleSection(){
    const { t, lang } = useLang();
    const [articles, setArticles] = useState(() => readArrayCache("articles"));
    const [failed, setFailed] = useState(false);
    const [loading, setLoading] = useState(true);

    const load = useCallback(() => {
        let cancelled = false;
        setLoading(true);
        setFailed(false);
        fetchJson(API)
        .then(json => {
            if (cancelled) return;
            const data = Array.isArray(json) ? json : [];
            setArticles(data);
            try { localStorage.setItem("articles", JSON.stringify(data)); } catch { /* ignore */ }
        })
        .catch(() => { if (!cancelled) setFailed(true); })
        .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    useEffect(load, [load]);

    return (
        <div className="w-full py-24 px-6 md:px-10 max-w-6xl mx-auto text-light">
            <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
                <div>
                    <div className="hero-text text-5xl sm:text-6xl tracking-tight leading-none">{t("articles.title")}</div>
                    <div className="text-sm text-light/50 mt-2">{t("articles.subtitle")}</div>
                </div>
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-light/50">{articles?.length ?? 0} {t("articles.title")}</span>
            </Reveal>
            <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6" gap={0.06}>
            {
                articles == null
                    ? (
                        <>
                        <div className="rounded-lg border border-dark2 p-6 animate-pulse"><div className="bg-dark2/50 rounded-lg w-3/5 h-6"></div><div className="bg-dark2/50 rounded-lg mt-4 h-4"></div><div className="bg-dark2/50 rounded-lg mt-2 h-4"></div></div>
                        <div className="rounded-lg border border-dark2 p-6 animate-pulse"><div className="bg-dark2/50 rounded-lg w-3/5 h-6"></div><div className="bg-dark2/50 rounded-lg mt-4 h-4"></div><div className="bg-dark2/50 rounded-lg mt-2 h-4"></div></div>
                        </>
                    )
                    : articles.length
                        ? articles.map((item, i) => (
                            <Stagger.Item key={item.slug ?? i}>
                            <Link to={'/articles/'+item.slug} state={item} className="card h-full p-6 block">
                                <div className="text-xs tracking-[0.2em] uppercase text-light/50">{item.date ?? ""}</div>
                                <div className="hero-text text-xl font-semibold tracking-tight text-light mt-2 line-clamp-2">{pickLangField(item,"title",lang) || item.title_en || item.title_id || item.slug}</div>
                                {(() => { const c = pickLangField(item,"content",lang) || item.content_en || item.content_id || ""; const w = c.split(/\s+/); const p = w.length > 22 ? w.slice(0,22).join(" ")+"…" : c; return <div className="text-[15px] leading-relaxed text-light/70 mt-3 line-clamp-3 whitespace-pre-wrap">{p}</div>; })()}
                                <div className="mt-4 text-xs tracking-widest text-primary">{t("articles.readMore")}</div>
                            </Link>
                            </Stagger.Item>
                        ))
                        : (
                            <Stagger.Item className="md:col-span-2">
                                <div className="card p-6 text-sm text-light/60 flex flex-wrap items-center gap-4">
                                    <span>{t(failed ? "articles.failed" : "articles.empty")}</span>
                                    {failed ? (
                                        <button onClick={load} disabled={loading} className="px-4 py-1.5 rounded-lg border border-primary/30 text-primary text-xs tracking-wide hover:bg-primary/10 transition disabled:opacity-50">
                                            {t("common.retry")}
                                        </button>
                                    ) : null}
                                </div>
                            </Stagger.Item>
                        )
            }
            </Stagger>
        </div>
    )
}
