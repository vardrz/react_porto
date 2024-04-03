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
                <div className="w-full px-10 md:px-28 py-16 text-xl md:text-3xl text-light whitespace-pre-wrap">
                    {data.state.fullDesc}
                </div>
            </>
        )
}

function ProjectImages(data){
    const images = data.data.images.split(',')
    const classWidthSlider = data.data.createBy != 'Flutter' ? 'md:w-3/4 rounded-md' : 'h-96 md:h-screen rounded-md'

    return (
        <div className="w-full px-10 pt-32">
            <div className='w-full inline-flex justify-center'>
                <img src={"/projects/"+images[0]} className='w-full md:w-1/2 rounded-lg mb-5' />
            </div>
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