import { TypeAnimation } from 'react-type-animation';
import { useLang } from "../context/LangContext";
import HeroVisual from "./hero/HeroVisual";
import Reveal from "./motion/Reveal";
import MagneticButton from "./motion/MagneticButton";
import Counter from "./motion/Counter";

export default function HeroSection() {
    const { t, lang } = useLang();

    return (
        <div className="w-full min-h-[85vh] max-w-6xl mx-auto px-6 md:px-10 pt-24 pb-10 flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16">

                {/* visual: atas di mobile, kanan di desktop */}
                <div className="order-first lg:order-last">
                    <HeroVisual />
                </div>

                {/* teks */}
                <div className="flex flex-col">
                    <Reveal>
                        <span className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full border border-primary/20 text-primary text-xs tracking-[0.2em] uppercase">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            {t("hero.badge")}
                        </span>
                    </Reveal>

                    <Reveal delay={0.08}>
                        <h1 className="hero-text mt-5 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[0.9] text-light">
                            Farid Fatkhurrozak
                        </h1>
                    </Reveal>

                    <Reveal delay={0.16}>
                        <div className="hero-text text-2xl sm:text-3xl lg:text-4xl mt-3 tracking-tight leading-none text-primary">
                            <TypeAnimation
                                key={lang}
                                sequence={[1000, t("hero.typing1"), 2000, t("hero.typing2"), 1000]}
                                speed={50}
                                repeat={Infinity}
                            />
                        </div>
                    </Reveal>

                    <Reveal delay={0.24}>
                        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs sm:text-sm tracking-wide text-light/40 uppercase">
                            <Counter to={Number(t("hero.statsYears"))} suffix={t("hero.statsYearsSuffix")} />
                            <span className="text-primary/40">•</span>
                            <Counter to={Number(t("hero.statsProjects"))} suffix={t("hero.statsProjectsSuffix")} />
                            <span className="text-primary/40">•</span>
                            <span>{t("hero.statsLocation")}</span>
                        </div>
                    </Reveal>

                    <Reveal delay={0.32}>
                        <p className="mt-8 text-base sm:text-lg leading-relaxed text-light/60 max-w-2xl">
                            {t("hero.subtitle")}
                        </p>
                    </Reveal>

                    <Reveal delay={0.4}>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <MagneticButton
                                href="/projects"
                                className="px-6 py-3 rounded-lg bg-primary text-dark text-sm font-medium tracking-wide hover:bg-primary/90 transition-colors"
                            >
                                {t("hero.ctaProjects")}
                            </MagneticButton>
                            <a
                                href="/contact"
                                className="px-6 py-3 rounded-lg border border-secondary/30 text-light text-sm tracking-wide hover:border-primary/40 hover:bg-dark2/40 transition-colors"
                            >
                                {t("hero.ctaContact")}
                            </a>
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    )
}
