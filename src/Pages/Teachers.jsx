import { Link } from "react-router-dom";
import mr from "../../src/Assets/Images/SVG_Images/male-avatar-boy-face-man-user-6-svgrepo-com.svg";
import mrs from "../../src/Assets/Images/SVG_Images/female-avatar-girl-face-woman-user-3-svgrepo-com.svg";
import fakeImage from "../../src/Assets/Images/fakeImage.png"
import style from "../../src/Styles/Teacher.module.css";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function Teachers() {
    // VARIABLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const {arr , baseURL}= useContext(SharedDataContext);
    const [isLoading, setIsloading] = useState(false);
    const [allTeachers, setallTeachers] = useState([]);
    const [totalPages, setTotalPages] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    // FUNCTION GET ALL TEACHERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // PAGENATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    function prePage() {
        setIsloading(true)
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            getAll(currentPage - 1);
            setIsloading(false)
        }
    }
    function nextPage() {
        setIsloading(true)
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            getAll(currentPage + 1);
            setIsloading(false)
        }
    }
    async function getAll(page) {
        try {

            const { data } = await axios.get(`${baseURL}/auth/teachers?page=${page}`);
            if (data && data.paginationInfo) {
                setallTeachers(data.data)
                setTotalPages(data.paginationInfo.totalPages || 1); // Default to 1 if undefined
            } else {
                setallTeachers([])
                setTotalPages(1);
            }
        } catch (error) {
            toast.error(" يوجد مشكلة لديك", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }

    }
    // USEEFFECT  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        getAll(currentPage);
    }, [allTeachers?.length]);
    useEffect(() => {
        window.scroll(0, 0)
    }, [])
    // RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return <>
        <Helmet>
            <title>Teacher - Sky Online Acadimy</title>
        </Helmet>
        <div className="container py-5">
            <ToastContainer />
            {allTeachers.filter(item => item.role === 'Teacher').length === 0 && <p>لا يوجد مدرسين</p>}
            {isLoading ? <div className=" position-fixed start-50 text-light top-50  p-3" style={{ transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.6)' }}>
                <i className="fa fa-spin fa-spinner h3"></i>
            </div> : ""}
            <div className="row g-2">
                {allTeachers?.length > 0 ? allTeachers.filter(item => item.role === 'Teacher').map((item, index) => <div key={index} className="col-md-4 col-lg-3">
                    <div className="border border-1 border-muted py-4 px-3 text-center">
                        {/* if not image in api  */}
                        <img src={item?.profileImage ? item?.profileImage?.secure_url : item.gender === "male" ? mr : mrs} style={{ width: "100px", height: " 100px" }} className="  rounded-circle " alt={item.fullName} />
                        <p className="text-muted fw-bold my-3"> {item.fullName} </p>
                        <Link to={`/teacher/${item._id} `} className={`w-100 rounded-2 py-2 text-white ${style.btnOrange} border-0 small nav-link`}>ملف المعلم</Link>
                    </div>
                </div>) : arr.map((item, index) => <div key={index} className="col-md-4 col-lg-3 ">
                    <div className="border border-1 border-muted py-4 px-3 text-center ">
                        <img src={fakeImage} alt="fakeImage" className="w-25 rounded-circle " />
                        <div className="card-body">
                            <h5 className="card-title placeholder-glow my-3">
                                <span className="placeholder col-6"></span>
                            </h5>
                        </div>
                        <Link to={""} className={`w-100 rounded-2 py-3 placeholder  text-white ${style.btnOrange} border-0 small nav-link `}> </Link>
                    </div>
                </div>)}
            </div>

            {/* pagination */}
            {totalPages > 1 ? <div className=' p-2 my-5 text-center align-items-center d-flex justify-content-center'>
                <button onClick={prePage} className='btn btn-primary mx-2' disabled={currentPage === 1} >
                    السابق
                </button>
                <div className='mx-2'>
                    الصفحة {currentPage}
                </div>
                <button onClick={nextPage} className='btn btn-primary mx-2' disabled={currentPage === totalPages}>
                    التالي
                </button>
            </div> : ""}
        </div>
    </>
}


