import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar"
import HeroSection from "../components/heroSection"

export default function Home() {
  const [projects,setProjects]=useState([]);
  useEffect(()=>{ try{setProjects(JSON.parse(localStorage.getItem("projects"))||[])}catch(e){ void e } fetch('https://script.google.com/macros/s/AKfycbznmENKsG0AzxvG1-1Z7iTbFA5FxwF9mTnp1sXajPqKYvgYOI43zNL-MZHLb3Zj5NEUSg/exec').then(r=>r.json()).then(j=>setProjects(j.slice(0,4))).catch(()=>{ /* ignore */ }) },[]);
  return (
    <>
      <Navbar/>
      <HeroSection/>
      <div className="w-full px-6 md:px-10 max-w-6xl mx-auto py-24">
        <div className="flex items-end justify-between mb-6"><span className="hero-text text-4xl tracking-tight text-light">Selected Work</span><Link to="/projects" className="text-sm text-light/60 hover:text-primary underline">View all →</Link></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((item,i)=><Link key={i} to={'/projects/'+item.slug} state={item} className="rounded-lg border border-white/5 p-6 hover:border-white/10 hover:bg-dark2/50 transition"><div className="text-xs tracking-widest text-light/40">0{i+1} — {item.createBy}</div><div className="hero-text text-xl font-semibold mt-2 text-light">{item.title}</div><div className="text-sm text-light/60 line-clamp-2 mt-2 whitespace-pre-wrap">{item.desc}</div><img src={"projects/"+item.images.split(',')[0]} loading="lazy" className="rounded-md w-full aspect-[16/10] object-cover border border-white/5 mt-4"/></Link>)}
        </div>
      </div>
    </>
  )
}
