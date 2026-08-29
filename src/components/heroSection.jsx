import { TypeAnimation } from 'react-type-animation';
import { useLang } from "../context/LangContext";

export default function HeroSection() {
    const { t } = useLang();
    function typing(thisClass){
        return (
            <TypeAnimation
                sequence={[
                1000,
                t("hero.typing1"),
                2000,
                t("hero.typing2"),
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
                <span className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full border border-primary/20 text-primary text-xs tracking-[0.2em] uppercase mb-6"><span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>{t("hero.badge")}</span>
                <span className="hero-text text-7xl md:text-8xl tracking-tight leading-[0.9] text-light">Farid Fatkhurrozak</span>
                {typing("hero-text text-4xl lg:text-5xl mt-3 tracking-tight leading-none text-primary")}
                <span className="mt-4 text-sm tracking-wide text-light/40">{t("hero.stats")}</span>
                <span className="mt-8 text-lg leading-relaxed text-light/60 max-w-2xl">{t("hero.subtitle")}</span>
                <div className="mt-8 flex gap-3">
                    <a href="#/projects" className="px-6 py-3 rounded-lg bg-primary text-dark text-sm font-medium tracking-wide hover:bg-primary/90 transition">{t("hero.ctaProjects")}</a>
                    <a href="#/contact" className="px-6 py-3 rounded-lg border border-secondary/20 text-light text-sm tracking-wide hover:border-primary/30 hover:bg-dark2/40 transition">{t("hero.ctaContact")}</a>
                </div>
            </div>

            {/* Mobile */}
            <div className="w-full min-h-[85vh] px-6 flex flex-col justify-center items-center text-center md:hidden max-w-6xl mx-auto pt-16">
                <span className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full border border-primary/20 text-primary text-[11px] tracking-[0.2em] uppercase mb-4"><span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>{t("hero.badge")}</span>
                <span className="hero-text text-8xl md:text-6xl text-light" style={{ letterSpacing: '3px' }}>FARID</span>
                <span className="hero-text text-3xl text-light" style={{ letterSpacing: '3px' }}>FATKHURROZAK</span>
                {typing("mt-4 hero-text text-xl tracking-tight text-primary text-center")}
                <span className="mt-4 text-xs tracking-wide text-light/40 text-center">{t("hero.statsMobile")}</span>
                <div className="mt-6 flex gap-3 justify-center">
                    <a href="#/projects" className="px-5 py-2.5 rounded-lg bg-primary text-dark text-sm font-medium">{t("hero.ctaProjects")}</a>
                    <a href="#/contact" className="px-5 py-2.5 rounded-lg border border-secondary/20 text-light text-sm">{t("hero.ctaContact")}</a>
                </div>
            </div>
        </>
    )
}
