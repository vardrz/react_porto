import {
  createHashRouter,
  RouterProvider,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom"
import { useEffect } from "react"

import Home from "./views/home"
import About from "./views/about"
import Projects from "./views/projects"
import Contact from "./views/contact"
import ProjectDetail from "./views/projectsDetail"
import NotFound from "./views/notFound"

const router = createHashRouter([
  { path: "*", Component: Root }
]);

export default function App() {
  return <RouterProvider router={router} />;
}

function ScrollTop(){ const {pathname}=useLocation(); useEffect(()=>{ window.scrollTo(0,0)},[pathname]); return null}
function Root() {
  return (
    <>
    <ScrollTop/>
    <Routes>
      <Route path="*" element={<Navigate to="/notfound" replace />} />
      <Route path="notfound" element={<NotFound />} />
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
    </>
  )
}