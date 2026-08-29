import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";

export default function Projects(){
    return (
        <>
            <Navbar/>
            <ProjectSection/>
        </>
    )
}


function ProjectSection(){
    const [projects, setProjects] = useState(null);

    useEffect(() => {
        // mengisi data projects dengan data yang ada di localstorage jika sudah ada
        setProjects(JSON.parse(localStorage.getItem("projects")));

        // load data dari api dan mengupdate data projects (data localstorage-nya juga)
        fetch('https://script.google.com/macros/s/AKfycbznmENKsG0AzxvG1-1Z7iTbFA5FxwF9mTnp1sXajPqKYvgYOI43zNL-MZHLb3Zj5NEUSg/exec')
        .then(response => response.json())
        .then(json => {
            setProjects(json)
            localStorage.setItem("projects", JSON.stringify(json))
        })
        .catch(error => console.error(error));
    }, []);

    return (
        <div className="w-full py-24 px-6 md:px-10 max-w-6xl mx-auto text-light">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
                <div className="hero-text text-5xl sm:text-6xl tracking-tight leading-none">Projects</div>
                <span className="text-xs tracking-[0.2em] uppercase text-light/40">{projects?.length ?? 0} Featured Projects</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {
                projects != null
                    ? projects.map((item, index) => (
                        <div key={index} className="rounded-lg border border-dark2 overflow-hidden hover:border-secondary/20 hover:bg-dark2/50 transition duration-200">
                            <div className="p-6">
                                <div className="text-xs tracking-[0.2em] uppercase text-light/40">0{index+1} — {item.createBy.toUpperCase()} • {item.date}</div>
                                <Link to={'/projects/' + item.slug} state={item} className="hero-text text-2xl font-semibold tracking-tight text-light hover:text-primary/80 transition mt-2 block">{item.title}</Link>
                                <div className="text-[15px] leading-relaxed text-light/70 mt-3 line-clamp-2 whitespace-pre-wrap">{item.desc}</div>
                                <div className="flex items-center gap-4 mt-3">
                                    <span className="inline-flex items-center text-xs text-light/50"><img src={"tech-icons/" + item.createBy + ".svg"} className="w-4 h-4 mr-1"/>{item.createBy}</span>
                                    {item.link!='-' ? <a href={item.link} target="_blank" className="text-xs text-light/50 hover:text-secondary underline">Live →</a> : null}
                                </div>
                            </div>
                            <Link to={'/projects/' + item.slug} state={item} className="block px-6 pb-6">
                                <img src={"projects/" + item.images.split(',')[0]} loading="lazy" className="rounded-md w-full aspect-[16/10] object-cover border border-dark2" />
                            </Link>
                        </div>
                    ))
                    : (
                        <>
                        <div className="rounded-lg border border-dark2 p-6 animate-pulse"><div className="bg-dark2/50 rounded-lg w-3/5 h-6"></div><div className="bg-dark2/50 rounded-lg mt-4 h-4"></div><div className="bg-dark2/50 rounded-lg mt-2 h-4"></div><div className="bg-dark2/50 rounded-lg mt-6 h-40"></div></div>
                        <div className="rounded-lg border border-dark2 p-6 animate-pulse"><div className="bg-dark2/50 rounded-lg w-3/5 h-6"></div><div className="bg-dark2/50 rounded-lg mt-4 h-4"></div><div className="bg-dark2/50 rounded-lg mt-2 h-4"></div><div className="bg-dark2/50 rounded-lg mt-6 h-40"></div></div>
                        </>
                    )
            }
            </div>
        </div>
    )
}
