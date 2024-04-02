/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

export default function HeroSection() {    
    return (
        <>
            <div className="w-full px-10 pt-32">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col md:flex-row items-center md:items-end">
                            <img src="profile.png" className="w-32 mb-5 md:w-24 md:mb-0 md:mr-6" />
                            <span className="hero-text text-4xl hidden md:block lg:text-6xl xl:text-7xl text-light">focused on</span>
                        </div>
                        <span className="hero-text leading-snug lg:leading-tight text-5xl hidden md:block lg:text-6xl xl:text-7xl text-primary ml-3 mt-5">Web & Mobile Development</span>
                    </div>
                    <div className="w-full py-7 md:pl-10">
                        <p className="text-light text-center md:text-left leading-normal text-xl md:text-2xl">
                            Hi I'm <span className="font-extrabold">Farid Fatkhurrozak</span>. <br />
                            A software engineer based in Pekalongan, Indonesia. <br />
                            My work largely revolves on the front-end with <TextLink>React</TextLink> & <TextLink>Flutter</TextLink>, back-end with <TextLink>Laravel</TextLink>.
                        </p>
                        <div className="w-full mt-8 inline-flex flex-row justify-center md:justify-start">
                            <SocialIcon href="http://github.com/vardrz" className="mr-5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </SocialIcon>
                            <SocialIcon href="mailto:fatkhurrozakf@gmail.com">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                            </svg>
                            </SocialIcon>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function SocialIcon({ children, href, className }){
    return (
        <a href={href} className={("w-12 h-12 rounded-full bg-light inline-flex justify-center items-center ") + className}>
            {children}
        </a>
    )
}

function TextLink({children}){
    return (
        <span className="underline text-primary">
            {children}
        </span>
    )
}