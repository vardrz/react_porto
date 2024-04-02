import {
  createHashRouter,
  RouterProvider,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import Home from "./views/home"
import About from "./views/about"
import Projects from "./views/projects"
import Contact from "./views/contact"
import { useState } from "react"

const router = createHashRouter([
  { path: "*", Component: Root }
]);

export default function App() {
  return <RouterProvider router={router} />;
}

function Root() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/notfound" replace />} />
      <Route path="notfound" element={<NotFound />} />
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}

function NotFound(){
  const [goHome, setGoHome] = useState(false)

  function goToHome(){
    setGoHome(true)
  }

  return (
    <div className="w-full h-screen inline-flex items-center justify-center">
      <span className="hero-text text-primary text-5xl md:text-8xl absolute top-[45%] md:top-[40%]">WAYOO</span>
      <span className="hero-text text-light bg-dark text-md md:text-3xl absolute top-1/2">404 - Not Found</span>
      <button onClick={goToHome} className="bg-primary rounded-md px-5 py-3 absolute top-[65%] font-bold text-dark">Go Back</button>
      {
        goHome ? <Navigate to="/" replace/> : ''
      }
    </div>
  )
}