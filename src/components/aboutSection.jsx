/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState } from "react";

export default function HeroSection() {
    const [avatarLoad, setAvatarLoad] = useState(true);

    return (
        <>
            <div className="w-full px-10 pt-32">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col md:flex-row items-center md:items-end">
                            {
                                avatarLoad ?
                                    <div className="flex items-center justify-center w-32 h-32 md:w-24 md:h-24 mb-5 md:mb-0 md:mr-6 rounded-full bg-dark2 animate-pulse">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16 text-light">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                                        </svg>
                                    </div> : ""
                            }
                            <img src="profile.png" className="w-32 mb-5 md:w-24 md:mb-0 md:mr-6" onLoad={() => setAvatarLoad(false)}/>
                            <span className="hero-text text-4xl hidden md:block lg:text-6xl xl:text-7xl text-light">focused on</span>
                        </div>
                        <span className="hero-text leading-snug lg:leading-tight text-5xl hidden md:block lg:text-6xl xl:text-7xl text-primary ml-3 mt-5">Web & Mobile Development</span>
                    </div>
                    <div className="w-full py-7 md:pl-10">
                        <p className="text-light text-center md:text-left leading-normal text-xl md:text-2xl">
                            Hi there! I'm <span className="font-bold">Farid Fatkhurrozak</span><br />
                            A web developer based in Pekalongan, Indonesia. <br />
                            I mostly work on the front-end using <TextLink>React</TextLink> & <TextLink>Flutter</TextLink>, and the back-end with <TextLink>Laravel</TextLink>.
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
                            <SocialIcon href="mailto:fatkhurrozakf@gmail.com" className="mr-5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                                </svg>
                            </SocialIcon>
                            <SocialIcon href="https://www.linkedin.com/in/vardrz">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 448 512"
                                >
                                    <path fill="currentColor" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
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