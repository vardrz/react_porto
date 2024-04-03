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
        fetch('https://script.google.com/macros/s/AKfycbznmENKsG0AzxvG1-1Z7iTbFA5FxwF9mTnp1sXajPqKYvgYOI43zNL-MZHLb3Zj5NEUSg/exec')
        .then(response => response.json())
        .then(json => setProjects(json))
        .catch(error => console.error(error));
    });

    return (
        <div className="w-full pt-32 px-10 text-light">
            <div className="hero-text text-5xl sm:text-7xl mb-16">Featured Projects</div>

            {
                projects != null
                    ? projects.map((item, index) => (
                        <div key={index} className="w-full flex flex-col-reverse  md:flex-row pb-16">
                            <div className="flex flex-col md:w-3/4 justify-center">
                                <Link to={'/projects/' + item.slug} state={item} className="hero-text text-3xl sm:text-4xl text-primary">{item.title}</Link>

                                <div className="flex mt-3">
                                    <div className="text-light w-fit mr-10 flex flex-row items-center">
                                        <img src={"tech-icons/" + item.createBy + ".svg"} className="w-5 h-5" />
                                        <span className="text-lg ml-1">{item.createBy}</span>
                                    </div>
                                    {
                                        item.link != '-'
                                            ? (
                                                <a href={item.link} target="_blank" className="text-light w-fit flex flex-row items-center hover:text-secondary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                        <path d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z" />
                                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-lg ml-1 underline">Link</span>
                                                </a>
                                            )
                                            : ''
                                    }
                                </div>

                                <div className="text-md mt-3 whitespace-pre-wrap">{item.desc}</div>
                                <div className="text-sm text-primary mt-2">{item.date}</div>
                            </div>
                            <Link to={'/projects/' + item.slug} state={item} className="inline-flex justify-center">
                                <img src={"projects/" + item.images.split(',')[0]} className="rounded-xl w-full h-fit mb-5 md:mb-0 mt-3 md:mt-5 md:w-4/5" />
                            </Link>
                        </div>
                    ))
                    : (
                        <div className="w-full flex flex-col-reverse mb-16 md:flex-row md:items-center">
                            <div className="md:w-2/4">
                                <div className="bg-dark2 animate-pulse rounded-md w-3/5 h-7"></div>
                                <div className="bg-dark2 animate-pulse rounded-md mt-7 full h-5"></div>
                                <div className="bg-dark2 animate-pulse rounded-md mt-4 full h-5"></div>
                                <div className="bg-dark2 animate-pulse rounded-md mt-4 full h-5"></div>
                            </div>
                            <div className="md:w-2/4 mb-10 md:mb-0 md:px-10">
                                <div className="bg-dark2 animate-pulse rounded-md w-full p-12 inline-flex justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-dark w-16 md:w-24">
                                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )
            }
        </div>
    )
}