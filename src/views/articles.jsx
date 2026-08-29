import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import { useLang } from "../context/LangContext";
import { pickLangField } from "../context/pickLang";

const API = "https://script.google.com/macros/s/AKfycbznmENKsG0AzxvG1-1Z7iTbFA5FxwF9mTnp1sXajPqKYvgYOI43zNL-MZHLb3Zj5NEUSg/exec?sheet=Articles";

export default function Articles(){
    return (
        <>
            <Navbar/>
            <ArticleSection/>
        </>
    )
}

function ArticleSection(){
    const { t, lang } = useLang();
    const [articles, setArticles] = useState(null);

    useEffect(() => {
        try { const cached = JSON.parse(localStorage.getItem("articles")); if(cached) setArticles(cached); } catch { /* ignore */ }
        fetch(API)
        .then(r => r.json())
        .then(json => {
            const data = Array.isArray(json) ? json : [];
            if(!json.error){ setArticles(data); localStorage.setItem("articles", JSON.stringify(data)); }
        })
        .catch(e => console.error(e));
    }, []);

    return (
        <div className="w-full py-24 px-6 md:px-10 max-w-6xl mx-auto text-light">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
                <div>
                    <div className="hero-text text-5xl sm:text-6xl tracking-tight leading-none">{t("articles.title")}</div>
                    <div className="text-sm text-light/40 mt-2">{t("articles.subtitle")}</div>
                </div>
                <span className="text-xs tracking-[0.2em] uppercase text-light/40">{articles?.length ?? 0} {t("articles.title")}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {
                articles != null
                    ? articles.length
                        ? articles.map((item, i) => (
                            <Link key={item.slug ?? i} to={'/articles/'+item.slug} state={item} className="rounded-lg border border-dark2 p-6 hover:border-secondary/20 hover:bg-dark2/50 transition duration-200 block">
                                <div className="text-xs tracking-[0.2em] uppercase text-light/40">{item.date ?? ""}</div>
                                <div className="hero-text text-xl font-semibold tracking-tight text-light mt-2 line-clamp-2">{pickLangField(item,"title",lang) || item.title_en || item.title_id || item.slug}</div>
                                <div className="text-[15px] leading-relaxed text-light/70 mt-3 line-clamp-3 whitespace-pre-wrap">{pickLangField(item,"content",lang).slice(0,220) || item.content_en?.slice(0,220) || item.content_id?.slice(0,220) || ""}</div>
                                <div className="mt-4 text-xs tracking-widest text-primary">{t("articles.readMore")}</div>
                            </Link>
                        ))
                        : <div className="text-light/40 text-sm">{t("articles.empty")}</div>
                    : (
                        <>
                        <div className="rounded-lg border border-dark2 p-6 animate-pulse"><div className="bg-dark2/50 rounded-lg w-3/5 h-6"></div><div className="bg-dark2/50 rounded-lg mt-4 h-4"></div><div className="bg-dark2/50 rounded-lg mt-2 h-4"></div></div>
                        <div className="rounded-lg border border-dark2 p-6 animate-pulse"><div className="bg-dark2/50 rounded-lg w-3/5 h-6"></div><div className="bg-dark2/50 rounded-lg mt-4 h-4"></div><div className="bg-dark2/50 rounded-lg mt-2 h-4"></div></div>
                        </>
                    )
            }
            </div>
        </div>
    )
}
