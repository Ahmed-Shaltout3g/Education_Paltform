import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import mr from "../../src/Assets/Images/SVG_Images/male-avatar-boy-face-man-user-6-svgrepo-com.svg"
import mrs from "../../src/Assets/Images/SVG_Images/female-avatar-girl-face-woman-user-3-svgrepo-com.svg"
import fakeImage from "../../src/Assets/Images/fakeImage.png";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function Swapper() {
    // VARIABLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const {  arr, baseURL } = useContext(SharedDataContext);
    const [allTeachers, setallTeachers] = useState([]);
    // USEEFFECT  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        async function getAllTeachers() {
            const { data } = await axios.get(`${baseURL}/auth/teachers?size=100`);
            setallTeachers(data.data)
        }
        getAllTeachers()
    }, [allTeachers.length])
    return <>
        {/* swiper */}
        <section className="my-5 text-center ">
            <div className="container">
                <div className="my-5">
                    <h3 className="mb-3 title">ﻧﺨﺒﺔ ﻣﻦ اﻓﻀﻞ المدرسين  </h3>
                    <p className="subTitle fw-light">
                        ﺗﻌﻠﻢ ﺑﺄﺣﺪث اﻟﻄﺮق ﻣﻦ ﺧﻠﺎل ﻣﻨﺼﺘﻨﺎ,ﻓﺄﻧﻨﺎن ﻧﻮﻓﺮ ﻟﻚ اﻟﻌﺪﻳﺪ ﻣﻦ اﻟﻜﻮرﺳﺎت
                        <br />
                        اﻟﺨﺎﺻﺔ ﺑجميع المراحل التعليمية , ﺑﺄﺣﺪث ﻃﺮق اﻟﻤﺘﺎﺑﻌﺔ واﻟﺘﻘﻴﻴﻢ..
                    </p>
                </div>
                <Swiper
                    modules={[Pagination, Navigation]}
                    slidesPerView={5}
                    spaceBetween={10}
                    breakpoints={{
                        // when window width is >= 640px
                        0: {
                            slidesPerView: 2,
                        },
                        576: {
                            slidesPerView: 3,
                        },
                        // when window width is >= 1024px
                        786: {
                            slidesPerView: 3,
                        },
                        992: {
                            slidesPerView: 4,
                        },
                        1200: {
                            slidesPerView: 5,
                        },
                    }}
                    navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }} >
                    {allTeachers?.length > 0 ? allTeachers.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className=" py-2 itemSlide">
                                <img src={item?.profileImage ? item?.profileImage?.secure_url : item.gender === "male" ? mr : mrs} className="  rounded-circle " style={{ width: '100px', height: '100px' }} alt={item.fullName} />
                                <h4 className="my-4 h6">أ/  {item.fullName}</h4>
                                <p className="my-4 small text-primary">
                                    <span className="bg-light text-black p-2 rounded">
                                        {item?.courseId?.name ? item?.courseId?.name : "لا يوجد"}
                                    </span>
                                </p>
                            </div>
                        </SwiperSlide>
                    )) : arr.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className=" py-2 itemSlide card-text placeholder-glow">
                                <img src={fakeImage} className="w-75   rounded-circle " alt="Loaing image" />
                                <h4 className="my-5 p-2 placeholder col-7"></h4>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    </>
}