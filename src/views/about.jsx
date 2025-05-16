import Navbar from "../components/navbar"
import AboutSection from "../components/aboutSection"
import TechStack from "../components/techStackSection"

export default function About() {
  return (
    <>
      <Navbar/>
      <AboutSection/>
      <TechStack/>
	  
      <div className="hidden md:block w-full px-10 mt-44 mb-24">
        <div className="text-3xl text-light font-bold text-center mb-8">
          <span className="text-primary">Activity Graph</span> - Last Year
        </div>
        <img src="https://ghchart.rshah.org/vardrz" className="w-full"/>
      </div>
    </>
  )
}
