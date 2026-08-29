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
                2000,
                'I develop IoT Device💡',
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
                <span className="hero-text text-7xl md:text-8xl tracking-tight leading-none text-light">Farid Fatkhurrozak</span>
                {typing("hero-text text-4xl lg:text-5xl mt-3 tracking-tight text-primary")}
                <span className="mt-8 text-lg text-light/60 max-w-3xl">❝ No Hugging, Only Debugging ❞ 🤸‍♂️</span>
            </div>

            {/* Mobile */}
            <div className="w-full min-h-[85vh] px-6 flex flex-col justify-center md:hidden max-w-6xl mx-auto">
                <span className="hero-text text-6xl sm:text-7xl tracking-tight leading-none text-light">Farid</span>
                <span className="hero-text text-3xl sm:text-5xl tracking-tight leading-none text-light">Fatkhurrozak</span>
                {typing("mt-5 hero-text text-xl sm:text-2xl tracking-tight text-primary")}
                <span className="mt-8 text-base text-light/60">❝ No Hugging, Only Debugging ❞ 🤸‍♂️</span>
            </div>
        </>
    )
}