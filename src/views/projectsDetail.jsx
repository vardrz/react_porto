/* eslint-disable react-hooks/rules-of-hooks */
import { Navigate, useLocation } from "react-router-dom";

export default function ProjectDetail(){
    const data = useLocation();

    return data.state == null
        ? <Navigate to="/notfound" state={{ from: 'projects' }} />
        : (
            <>
                <div className="text-lg text-light">
                    {data.state.title}
                </div>
            </>
        )
}