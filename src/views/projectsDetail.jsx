import { useState, useEffect } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { useLang } from "../context/LangContext";
import { pickLangField } from "../context/pickLang";
import SEO from "../components/SEO";
import Reveal from "../components/motion/Reveal";
import { fetchJson, readArrayCache } from "../utils/network";

import Navbar from "../components/navbar";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const API = "https://script.google.com/macros/s/AKfycbznmENKsG0AzxvG1-1Z7iTbFA5FxwF9mTnp1sXajPqKYvgYOI43zNL-MZHLb3Zj5NEUSg/exec";

export default function ProjectDetail(){
    const { t, lang } = useLang();
    const { slug } = useParams();
    const loc = useLocation();
    const [project, setProject] = useState(loc.state ?? null);
    const [checked, setChecked] = useState(!!loc.state);
    const [failed, setFailed] = useState(false);

    useEffect(()=>{
        if(loc.state) return;
        const cached = readArrayCache("projects");
        const foundCached = cached?.find(p=>p.slug===slug);
        if(foundCached){ setProject(foundCached); setChecked(true); return; }
        let cancelled = false;
        fetchJson(API).then(json=>{
            if(cancelled) return;
            const data = Array.isArray(json) ? json : [];
            const found = data.find(p=>p.slug===slug);
            if(found){ setProject(found); try{localStorage.setItem("projects",JSON.stringify(data))}catch{/*ignore*/}}
            setChecked(true);
        }).catch(()=>{ if(!cancelled){ setFailed(true); setChecked(true); } });
        return () => { cancelled = true; };
    },[slug, loc.state]);

    if(!checked) return (
        <>
            <Navbar from="projects"/>
            <div className="w-full px-6 md:px-10 max-w-6xl mx-auto pt-24"><div className="h-8 w-2/3 bg-dark2/50 rounded-lg animate-pulse"></div></div>
        </>
    );
    if(!project && failed) return (
        <>
            <Navbar from="projects"/>
            <div className="w-full px-6 md:px-10 max-w-6xl mx-auto pt-24">
                <div className="card p-6 text-sm text-light/60">{t("projects.failed")}</div>
            </div>
        </>
    );
    if(!project) return <Navigate to="/notfound" state={{ from: 'projects' }} />;

    const title = project.title || slug;
    const desc = String(pickLangField(project,"desc",lang) || project.desc || "").replace(/\s+/g," ").trim().slice(0,160);
    const img = project.images ? `/projects/${project.images.split(",")[0].trim()}` : "/profile.png";
    return (
        <>
            <SEO title={title} description={desc || title} canonical={`/projects/${slug}`} image={img} type="article" lang={lang} noindex article={{ publishedTime: project.date, author: project.createBy || "Farid Fatkhurrozak" }} />
            <Navbar from="projects"/>
            <ProjectImages data={project} t={t}/>
            <Reveal className="w-full px-6 md:px-10 max-w-6xl mx-auto py-10">
                <div className="max-w-3xl text-base md:text-lg leading-relaxed text-light/80 whitespace-pre-wrap prose prose-invert">
                    {pickLangField(project,"fullDesc",lang)}
                </div>
            </Reveal>
        </>
    )
}

function ProjectImages(data){
    const t = data.t;
    const images = data.data.images.split(',')
    const classWidthSlider = data.data.createBy != 'Flutter' ? 'md:w-3/4 rounded-lg border border-dark2' : 'h-96 md:h-[70vh] object-contain rounded-lg border border-dark2 bg-dark2/30'

    return (
        <div className="w-full px-6 md:px-10 max-w-6xl mx-auto pt-24">
            <div className="hero-text text-3xl md:text-4xl tracking-tight text-light mb-2">{data.data.title}</div>
            <div className="text-xs tracking-[0.2em] uppercase text-light/50 mb-6">{data.data.createBy} • {data.data.date} {data.data.link!='-' ? <a href={data.data.link} target="_blank" rel="noreferrer" className="ml-2 underline hover:text-secondary">{t("projects.live")}</a> : null}</div>
            <img src={"/projects/"+images[0]} className='w-full aspect-[16/9] object-cover rounded-lg border border-dark2 mb-8' />
            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                pagination={{
                clickable: true,
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mySwiper"
            >
                {
                    images.map((item, index) => (
                        index != 0 ?
                        <SwiperSlide key={index}>
                            <div className="w-full inline-flex justify-center">
                                <img src={"/projects/" + item} className={classWidthSlider} />
                            </div>
                        </SwiperSlide>
                        : ''
                    ))
                }
            </Swiper>
        </div>
    )
}