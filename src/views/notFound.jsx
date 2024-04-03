import { Navigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function NotFound() {
  const [goHome, setGoHome] = useState(false);
  const from = useLocation().state;
  console.log(from);

  function goToHome() {
    setGoHome(true);
  }

  return (
    <div className="w-full h-screen inline-flex items-center justify-center">
      <span className="hero-text text-primary text-5xl md:text-8xl absolute top-[45%] md:top-[40%]">WAYOO</span>
      <span className="hero-text text-light bg-dark text-md md:text-3xl absolute top-1/2">404 - Not Found</span>
      <button onClick={goToHome} className="bg-primary rounded-md px-5 py-3 absolute top-[65%] font-bold text-dark">Go Back</button>
      {goHome ? <Navigate to={from == null ? "/" : "/projects"} replace /> : ''}
    </div>
  );
}
