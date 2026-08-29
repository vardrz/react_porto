import Navbar from "../components/navbar"
import AboutSection from "../components/aboutSection"
import TechStack from "../components/techStackSection"

export default function About() {
  return (
    <>
      <Navbar/>
      <AboutSection/>
      <TechStack/>
      <div className="hidden md:block w-full px-6 md:px-10 max-w-6xl mx-auto mt-32 mb-24 rounded-lg border border-dark2 bg-dark2/30 p-6">
        <div className="text-2xl tracking-tight text-light font-bold text-center mb-8">
          <span className="text-primary">Activity Graph</span> - Last Year
        </div>
        <img src="https://ghchart.rshah.org/vardrz" className="w-full rounded-md"/>
      </div>
    </>
  )
}
