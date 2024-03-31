export default function HeroSection() {
    return (
        <>
            {/* Desktop */}
            <div className="hidden w-full h-screen px-10 md:flex flex-col justify-center">
                <span className="hero-text text-8xl text-light">Farid Fatkhurrozak</span>
                <span className="hero-text text-5xl lg:text-6xl text-primary">Software Developer👨‍💻</span>
                <span className="mt-10 text-3xl text-light">❝ No Hugging, Only Debugging ❞ 🤸‍♂️</span>
            </div>

            {/* Mobile */}
            <div className="w-full h-screen px-10 flex flex-col justify-center md:hidden">
                <span className="hero-text text-7xl sm:text-8xl text-light">Farid</span>
                <span className="hero-text text-4xl sm:text-6xl text-light">Fatkhurrozak</span>
                <span className="mt-5 hero-text text-xl sm:text-2xl text-primary">Software Developer👨‍💻</span>
                <span className="mt-10 text-base text-light">❝ No Hugging, Only Debugging ❞ 🤸‍♂️</span>
            </div>
        </>
    )
}