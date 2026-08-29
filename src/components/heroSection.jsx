import { TypeAnimation } from 'react-type-animation';

export default function HeroSection() {
    function typing(thisClass){
        return (
            <TypeAnimation
                sequence={[
                1000,
                'I develop Web App💻',
                2000,
                'I develop Mobile App📱',
                1000,
                ]}
                speed={50}
                className={thisClass}
                repeat={Infinity}
            />
        )
    }

    return (
        <>
            {/* Desktop */}
            <div className="hidden w-full min-h-[85vh] px-6 md:px-10 max-w-6xl mx-auto md:flex flex-col justify-center pt-16">
                <span className="inline-flex w-fit px-3 py-1 rounded-full border border-primary/20 text-primary text-xs tracking-[0.2em] uppercase mb-6">Available for new projects</span>
                <span className="hero-text text-7xl md:text-8xl tracking-tight leading-[0.9] text-light">Farid Fatkhurrozak</span>
                {typing("hero-text text-4xl lg:text-5xl mt-3 tracking-tight leading-none text-primary")}
                <span className="mt-4 text-sm tracking-wide text-light/40">3+ YEARS • 20+ PROJECTS • PEKALONGAN, ID</span>
                <span className="mt-8 text-lg leading-relaxed text-light/60 max-w-2xl">Web & Mobile developer — React, Flutter, Go. Focused on clean, fast, maintainable products.</span>
                <div className="mt-8 flex gap-3">
                    <a href="#/projects" className="px-6 py-3 rounded-lg bg-primary text-dark text-sm font-medium tracking-wide hover:bg-primary/90 transition">View Projects</a>
                    <a href="#/contact" className="px-6 py-3 rounded-lg border border-secondary/20 text-light text-sm tracking-wide hover:border-primary/30 hover:bg-dark2/40 transition">Contact</a>
                </div>
            </div>

            {/* Mobile */}
            <div className="w-full min-h-[85vh] px-6 flex flex-col justify-center items-center text-center md:hidden max-w-6xl mx-auto pt-16">
                <span className="inline-flex w-fit px-3 py-1 rounded-full border border-primary/20 text-primary text-[11px] tracking-[0.2em] uppercase mb-4">Available for new projects</span>
                <span className="hero-text text-6xl tracking-tight leading-[0.9] text-light">Farid</span>
                <span className="hero-text text-3xl tracking-tight leading-none text-light">Fatkhurrozak</span>
                {typing("mt-4 hero-text text-xl tracking-tight text-primary text-center")}
                <span className="mt-4 text-xs tracking-wide text-light/40 text-center">3+ YEARS • 20+ PROJECTS</span>
                <div className="mt-6 flex gap-3 justify-center">
                    <a href="#/projects" className="px-5 py-2.5 rounded-lg bg-primary text-dark text-sm font-medium">View Projects</a>
                    <a href="#/contact" className="px-5 py-2.5 rounded-lg border border-secondary/20 text-light text-sm">Contact</a>
                </div>
            </div>
        </>
    )
}
