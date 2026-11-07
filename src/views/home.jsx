import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar"
import HeroSection from "../components/heroSection"
import { useLang } from "../context/LangContext"
import { pickLangField } from "../context/pickLang"
import SEO from "../components/SEO"
import Reveal from "../components/motion/Reveal"
import Stagger from "../components/motion/Stagger"
import TiltCard from "../components/motion/TiltCard"

export default function Home() {
  const { t, lang } = useLang();
  const [projects,setProjects]=useState([]);
  useEffect(()=>{ try{setProjects(JSON.parse(localStorage.getItem("projects"))||[])}catch(e){ void e } fetch('https://script.google.com/macros/s/AKfycbznmENKsG0AzxvG1-1Z7iTbFA5FxwF9mTnp1sXajPqKYvgYOI43zNL-MZHLb3Zj5NEUSg/exec').then(r=>r.json()).then(j=>setProjects(j.slice(0,4))).catch(()=>{ /* ignore */ }) },[]);
  return (
    <>
      <SEO canonical="/" description="Web & Mobile developer — React, Flutter, Go. Fokus bikin produk bersih, cepat, mudah dirawat. 3+ tahun, 20+ proyek." lang={lang} />
      <Navbar/>
      <HeroSection/>
      <div className="w-full px-6 md:px-10 max-w-6xl mx-auto py-24">
        <Reveal className="flex items-end justify-between mb-6">
          <span className="hero-text text-4xl tracking-tight text-light">{t("home.featured")}</span>
          <Link to="/projects" className="text-sm text-light/60 hover:text-primary underline">{t("home.viewAll")}</Link>
        </Reveal>
        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6" gap={0.07}>
          {projects.map((item,i)=>(
            <Stagger.Item key={i}>
              <TiltCard max={4} className="card h-full">
                <Link to={'/projects/'+item.slug} state={item} className="block p-6">
                  <div className="font-mono text-xs tracking-widest text-light/50">0{i+1} — {item.createBy}</div>
                  <div className="hero-text text-xl font-semibold mt-2 text-light">{item.title}</div>
                  <div className="text-sm text-light/60 line-clamp-2 mt-2 whitespace-pre-wrap">{pickLangField(item,"desc",lang)}</div>
                  <img src={"projects/"+item.images.split(',')[0]} loading="lazy" className="rounded-lg w-full aspect-[16/10] object-cover border border-line mt-4"/>
                </Link>
              </TiltCard>
            </Stagger.Item>
          ))}
        </Stagger>
      </div>
    </>
  )
}
