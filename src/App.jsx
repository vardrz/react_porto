import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom"
import { Suspense, lazy, useEffect } from "react"
import { HelmetProvider } from "react-helmet-async"
import { MotionConfig } from "framer-motion"

import { LangProvider } from "./context/LangContext"
import BackgroundFX from "./components/ui/BackgroundFX"
import AppErrorBoundary from "./components/AppErrorBoundary"

// Route-level code splitting: hanya halaman yang dibuka yang diunduh.
const Home = lazy(() => import("./views/home"))
const About = lazy(() => import("./views/about"))
const Projects = lazy(() => import("./views/projects"))
const Articles = lazy(() => import("./views/articles"))
const ArticleDetail = lazy(() => import("./views/articleDetail"))
const Contact = lazy(() => import("./views/contact"))
const ProjectDetail = lazy(() => import("./views/projectsDetail"))
const NotFound = lazy(() => import("./views/notFound"))

const router = createBrowserRouter([
  { path: "*", Component: Root }
]);

export default function App() {
  return (
    <HelmetProvider>
      <LangProvider>
        <MotionConfig reducedMotion="user">
          <RouterProvider router={router} />
        </MotionConfig>
      </LangProvider>
    </HelmetProvider>
  );
}

function ScrollTop(){ const {pathname}=useLocation(); useEffect(()=>{ window.scrollTo(0,0)},[pathname]); return null}

function RouteFallback() {
  return (
    <div className="w-full min-h-[60vh] max-w-6xl mx-auto px-6 md:px-10 pt-24">
      <div className="h-8 w-2/3 max-w-sm rounded-lg bg-dark2/50 animate-pulse" />
      <div className="mt-4 h-4 w-full max-w-md rounded-lg bg-dark2/40 animate-pulse" />
    </div>
  )
}

function Root() {
  return (
    <>
    <BackgroundFX/>
    <ScrollTop/>
    <AppErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="*" element={<Navigate to="/notfound" replace />} />
          <Route path="notfound" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </AppErrorBoundary>
    </>
  )
}
