import { Routes, Route } from "react-router-dom"

import Home from "../views/home"
import About from "../views/about"
import Projects from "../views/projects"
import Contact from "../views/contact"

export default function RoutesIndex() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
    )
}