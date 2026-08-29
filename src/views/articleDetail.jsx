import { useState, useEffect } from "react";
import { Navigate, useLocation, useParams, Link } from "react-router-dom";
import Navbar from "../components/navbar";
import { useLang } from "../context/LangContext";
import { pickLangField } from "../context/pickLang";

const API = "https://script.google.com/macros/s/AKfycbznmENKsG0AzxvG1-1Z7iTbFA5FxwF9mTnp1sXajPqKYvgYOI43zNL-MZHLb3Zj5NEUSg/exec?sheet=Articles";

export default function ArticleDetail(){
    const { t, lang } = useLang();
    const { slug } = useParams();
    const loc = useLocation();
    const [article, setArticle] = useState(loc.state ?? null);
    const [checked, setChecked] = useState(!!loc.state);

    useEffect(() => {
        if(loc.state) return;
        // try cache
        try {
            const cached = JSON.parse(localStorage.getItem("articles"));
            const found = cached?.find(a => a.slug === slug);
            if(found){ setArticle(found); setChecked(true); return; }
        } catch { /* ignore */ }
        fetch(API).then(r=>r.json()).then(json=>{
            const data = Array.isArray(json) ? json : [];
            const found = data.find(a => a.slug === slug);
            if(found){ setArticle(found); try{ localStorage.setItem("articles", JSON.stringify(data)); } catch{/*ignore*/}}
            setChecked(true);
        }).catch(()=> setChecked(true));
    }, [slug, loc.state]);

    if(!checked) return (
        <>
            <Navbar from="articles"/>
            <div className="w-full px-6 md:px-10 max-w-6xl mx-auto pt-24"><div className="h-8 w-2/3 bg-dark2/50 rounded-lg animate-pulse"></div><div className="mt-4 h-4 w-full bg-dark2/50 rounded-lg animate-pulse"></div></div>
        </>
    );
    if(!article) return <Navigate to="/notfound" state={{ from: 'articles' }} />;

    const title = pickLangField(article,"title",lang) || article.title_en || article.title_id || article.slug;
    const content = pickLangField(article,"content",lang) || article.content_en || article.content_id || "";

    return (
        <>
            <Navbar from="articles"/>
            <div className="w-full px-6 md:px-10 max-w-6xl mx-auto pt-24">
                <Link to="/articles" className="text-xs tracking-widest text-light/40 hover:text-primary transition">← {t("articles.back")}</Link>
                <div className="hero-text text-3xl md:text-4xl tracking-tight text-light mt-4">{title}</div>
                <div className="text-xs tracking-[0.2em] uppercase text-light/40 mt-3">{article.date ?? ""} • {article.slug}</div>
            </div>
            <div className="w-full px-6 md:px-10 max-w-6xl mx-auto py-10">
                <div className="max-w-3xl text-base md:text-lg leading-relaxed text-light/80 whitespace-pre-wrap prose prose-invert">
                    {content}
                </div>
            </div>
        </>
    )
}
