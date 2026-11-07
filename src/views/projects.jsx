import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import { useLang } from "../context/LangContext";
import { pickLangField } from "../context/pickLang";
import SEO from "../components/SEO";
import Reveal from "../components/motion/Reveal";
import Stagger from "../components/motion/Stagger";
import TiltCard from "../components/motion/TiltCard";
import { fetchJson, readArrayCache } from "../utils/network";
import { asset } from "../utils/asset";

export default function Projects(){
    const { lang } = useLang();
    return (
        <>
            <SEO title="Projects" canonical="/projects" description="Kumpulan proyek Farid — Web & Mobile: React, Flutter, Laravel, Go. 20+ proyek selesai." lang={lang} noindex />
            <Navbar/>
            <ProjectSection/>
        </>
    )
 }


function ProjectSection(){
    const { t, lang } = useLang();
    const [projects, setProjects] = useState(() => readArrayCache("projects"));
    const [failed, setFailed] = useState(false);
    const [loading, setLoading] = useState(true);

    const load = useCallback(() => {
        let cancelled = false;
        setLoading(true);
        setFailed(false);
        fetchJson('https://script.google.com/macros/s/AKfycbznmENKsG0AzxvG1-1Z7iTbFA5FxwF9mTnp1sXajPqKYvgYOI43zNL-MZHLb3Zj5NEUSg/exec')
        .then(json => {
            if (cancelled) return;
            const data = Array.isArray(json) ? json : [];
            setProjects(data);
            try { localStorage.setItem("projects", JSON.stringify(data)); } catch { /* ignore */ }
        })
        .catch(() => { if (!cancelled) setFailed(true); })
        .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    useEffect(load, [load]);

    return (
        <div className="w-full py-24 px-6 md:px-10 max-w-6xl mx-auto text-light">
            <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
                <div className="hero-text text-5xl sm:text-6xl tracking-tight leading-none">{t("projects.title")}</div>
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-light/50">{projects?.length ?? 0} {t("projects.featured")}</span>
            </Reveal>
            <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6" gap={0.07}>
            {
                projects == null
                    ? (
                        <>
                        <div className="rounded-lg border border-dark2 p-6 animate-pulse"><div className="bg-dark2/50 rounded-lg w-3/5 h-6"></div><div className="bg-dark2/50 rounded-lg mt-4 h-4"></div><div className="bg-dark2/50 rounded-lg mt-2 h-4"></div><div className="bg-dark2/50 rounded-lg mt-6 h-40"></div></div>
                        <div className="rounded-lg border border-dark2 p-6 animate-pulse"><div className="bg-dark2/50 rounded-lg w-3/5 h-6"></div><div className="bg-dark2/50 rounded-lg mt-4 h-4"></div><div className="bg-dark2/50 rounded-lg mt-2 h-4"></div><div className="bg-dark2/50 rounded-lg mt-6 h-40"></div></div>
                        </>
                    )
                    : projects.length
                    ? projects.map((item, index) => (
                        <Stagger.Item key={item.slug ?? index}>
                        <TiltCard max={4} className="card overflow-hidden h-full">
                            <div className="p-6">
                                <div className="font-mono text-xs tracking-[0.2em] uppercase text-light/50">0{index+1} — {(item.createBy ?? "").toUpperCase()} • {item.date}</div>
                                <Link to={'/projects/' + item.slug} state={item} className="hero-text text-2xl font-semibold tracking-tight text-light hover:text-primary/80 transition mt-2 block">{item.title}</Link>
                                <div className="text-[15px] leading-relaxed text-light/70 mt-3 line-clamp-2 whitespace-pre-wrap">{pickLangField(item,"desc",lang)}</div>
                                <div className="flex items-center gap-4 mt-3">
                                    <span className="inline-flex items-center text-xs text-light/50"><img src={asset("tech-icons/" + item.createBy + ".svg")} className="w-4 h-4 mr-1" alt=""/>{item.createBy}</span>
                                    {item.link!='-' ? <a href={item.link} target="_blank" rel="noreferrer" className="text-xs text-light/50 hover:text-secondary underline">{t("projects.live")}</a> : null}
                                </div>
                            </div>
                            <Link to={'/projects/' + item.slug} state={item} className="block px-6 pb-6">
                                <img src={asset("projects/" + item.images.split(',')[0])} loading="lazy" alt={item.title} className="rounded-lg w-full aspect-[16/10] object-cover border border-line" />
                            </Link>
                        </TiltCard>
                        </Stagger.Item>
                    ))
                    : (
                        <Stagger.Item className="md:col-span-2">
                            <div className="card p-6 text-sm text-light/60 flex flex-wrap items-center gap-4">
                                <span>{t(failed ? "projects.failed" : "projects.empty")}</span>
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
