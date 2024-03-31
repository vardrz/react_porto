import { SocialIcon } from 'react-social-icons'

export default function HeroSection() {
    function textLink(text){
        return (
            <span className="underline text-primary">
                {text}
            </span>
        )
    }
    
    return (
        <>
            <div className="w-full px-10 py-28 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col md:flex-row items-center md:items-end">
                            <img src="profile.png" className="w-32 mb-5 md:w-24 md:mb-0 md:mr-6" />
                            <span className="hero-text text-4xl md:text-4xl lg:text-6xl xl:text-7xl text-light">focused on</span>
                        </div>
                        <span className="hero-text text-4xl text-center md:text-left lg:text-6xl xl:text-7xl text-primary mt-2 md:ml-3 md:mt-5">Web & Mobile</span>
                        <span className="hero-text text-4xl text-center md:text-left lg:text-6xl xl:text-7xl text-primary mt-2 md:ml-3 md:mt-4">Development</span>
                    </div>
                    <div className="w-full py-10 md:py-7 md:pl-16 lg:pl-20">
                        <p className="text-light leading-normal text-2xl">
                            Having experience in {textLink('Laravel')}, {textLink('React')}, & {textLink('Flutter')}, familiar with RESTful API and web service and some experience in IOT project.
                        </p>
                        <div className="mt-6">
                            <SocialIcon
                                network='github'
                                href='http://github.com/vardrz'
                                bgColor='white'
                                fgColor='black'
                                className='mr-5'
                            />
                            <SocialIcon
                                network='email'
                                href='mailto:fatkhurrozakf@gmail.com'
                                bgColor='white'
                                fgColor='black'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}