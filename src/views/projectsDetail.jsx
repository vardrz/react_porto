import { Navigate, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

import Navbar from "../components/navbar";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProjectDetail(){
    const data = useLocation();

    return data.state == null
        ? <Navigate to="/notfound" state={{ from: 'projects' }} />
        : (
            <>
                <Navbar from="projects"/>
                <ProjectImages data={data.state}/>
                <div className="w-full px-6 md:px-10 max-w-6xl mx-auto py-12 text-base md:text-lg leading-relaxed text-light/80 whitespace-pre-wrap prose prose-invert max-w-none">
                    {data.state.fullDesc}
                </div>
            </>
        )
}

function ProjectImages(data){
    const images = data.data.images.split(',')
    const classWidthSlider = data.data.createBy != 'Flutter' ? 'md:w-3/4 rounded-lg border border-white/5' : 'h-96 md:h-[70vh] object-contain rounded-lg border border-white/5 bg-dark2/30'

    return (
        <div className="w-full px-6 md:px-10 max-w-6xl mx-auto pt-24">
            <div className="hero-text text-3xl md:text-4xl tracking-tight text-light mb-2">{data.data.title}</div>
            <div className="text-xs tracking-[0.2em] uppercase text-light/40 mb-6">{data.data.createBy} • {data.data.date} {data.data.link!='-' ? <a href={data.data.link} target="_blank" className="ml-2 underline hover:text-secondary">Live →</a> : null}</div>
            <img src={"/projects/"+images[0]} className='w-full aspect-[16/9] object-cover rounded-lg border border-white/5 mb-8' />
            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                pagination={{
                clickable: true,
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mySwiper"
            >
                {
                    images.map((item, index) => (
                        index != 0 ?
                        <SwiperSlide key={index}>
                            <div className="w-full inline-flex justify-center">
                                <img src={"/projects/" + item} className={classWidthSlider} />
                            </div>
                        </SwiperSlide>
                        : ''
                    ))
                }
            </Swiper>
        </div>
    )
}