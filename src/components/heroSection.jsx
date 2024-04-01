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
            <div className="hidden w-full h-screen px-10 md:flex flex-col justify-center pt-10">
                <span className="hero-text text-8xl text-light">Farid Fatkhurrozak</span>
                {typing("hero-text text-5xl lg:text-6xl mt-2 text-primary")}
                <span className="mt-10 text-3xl text-light">❝ No Hugging, Only Debugging ❞ 🤸‍♂️</span>
            </div>

            {/* Mobile */}
            <div className="w-full h-screen px-8 flex flex-col justify-center md:hidden">
                <span className="hero-text text-7xl sm:text-8xl text-light">Farid</span>
                <span className="hero-text text-4xl sm:text-6xl text-light">Fatkhurrozak</span>
                {typing("mt-5 hero-text text-xl sm:text-2xl text-primary")}
                <span className="mt-10 text-base text-light">❝ No Hugging, Only Debugging ❞ 🤸‍♂️</span>
            </div>
        </>
    )
}