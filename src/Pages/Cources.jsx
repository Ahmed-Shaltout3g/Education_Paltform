import Filter from './../Components/Filter';
import fakeImage from "../../src/Assets/Images/fakeImage.png"
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FilterContext } from '../Contexts/FilterContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';
import { SharedDataContext } from '../Contexts/SharedDataContext';
export default function Cources() {
    // VARIABLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const { stage, grade, arr , baseURL} = useContext(SharedDataContext);
    const [courses, setCourses] = useState([]);
    const [dispalyCourses, setDisplayCourses] = useState([]);
    const { stageName, gradeFilterName, setStage, setGrade, filterCourses, setGradeName, setStageName, setWordSearch } = useContext(FilterContext);
    const [isLoading, setIsloading] = useState(false);
    const [totalPages, setTotalPages] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    // FUNCTION GET ALL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    async function getAll(Page) {
        try {
            const { data } = await axios.get(`${baseURL}/course?page=${Page}`);
            setCourses(data.data);
            setTotalPages(data.paginationInfo.totalPages)
        } catch (error) {
            toast.error(" هناك مشكلة  ", {
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
    // FUNCTION PAGINATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    function prePage() {
        setIsloading(true)
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            getAll(currentPage - 1)
            setIsloading(false)
        }
    }
    function nextPage() {
        setIsloading(true)
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            getAll(currentPage + 1)
            setIsloading(false)
        }
    }
    // USEEFFECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        getAll(currentPage);
        setDisplayCourses(courses);
    }, [courses?.length])
    useEffect(() => {
        setDisplayCourses(filterCourses?.length > 0 ? filterCourses : courses)
    }, [filterCourses])
    // FUNCTION RESET FILTER >>>>>>>>>>>>>>>>>>>>>>>>>
    function resetFilter() {
        setGrade('');
        setStage('');
        setWordSearch('');
        setGradeName('');
        setStageName('');
    }
    // RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return <>
        <Helmet>
            <title>Courses - Sky Online Acadimy</title>
        </Helmet>
        <ToastContainer />
        <section className="py-5 container ">
            {isLoading ? <div className=" position-fixed start-50 text-light top-50  p-3" style={{ transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: "999999" }}>
                <i className="fa fa-spin fa-spinner h3"></i>
            </div> : ""}
            <div className="row g-3 ">
                <div className="col-lg-3">
                    <Filter />
                </div>
                <div className="col-lg-9  ">
                    {gradeFilterName || stageName ? <div className="d-flex w-100 mb-4 align-items-center">
                        {stageName ? <div className=" ">
                            <div className="d-flex bg-light mx-3 justify-content-between py-2  px-2 small align-items-center">
                                <span className="mx-4">{stageName} {gradeFilterName}</span>
                                <i onClick={() => { setStage(''); setStageName('') }} className='fa-solid fa-x '></i>
                            </div>
                        </div> : ''}

                    </div> : ""}
                    <div className="row g-3 mt-1">
                        {dispalyCourses?.length > 0 ? dispalyCourses?.map((item, index) => <div key={index} className="col-6 col-sm-6 col-md-4">
                            <div className='border-1 border border-muted rounded-3'>
                                <Link to={`/cources/${item._id}`}>
                                    <img src={item.photo.secure_url} alt="teacher image" className='w-100' />
                                </Link>
                                <div className="p-3">
                                    <p className="text-muted my-2">{stage[item.subCategoryId?.name]} {grade[item.categoryId?.name]} </p>
                                    <Link className='nav-link text-black' to={`/cources/${item._id}`}>
                                        <h3 className='h5 mb-3'>{item?.name} </h3>
                                    </Link>
                                    <div className="d-flex align-items-start mt-2">
                                        <i className="fa-solid fa-play ms-1 pt-1 text-danger small"></i>
                                        <p className='text-muted small'>{item?.lectures?.length} محاضرات</p>
                                    </div>
                                </div>
                            </div>
                        </div>) : arr.map((item, index) => <div key={index} className="col-6 col-sm-6 col-md-4">
                            <div className="card" aria-hidden="true">
                                <img src={fakeImage} className="card-img-top w-100" alt="..." />
                                <div className="card-body">
                                    <h5 className="card-title placeholder-glow">
                                        <span className="placeholder col-6"></span>
                                    </h5>
                                    <p className="card-text placeholder-glow">
                                        <span className="placeholder col-7"></span>
                                        <span className="placeholder col-4"></span>
                                        <span className="placeholder col-4"></span>
                                        <span className="placeholder col-6"></span>
                                        <span className="placeholder col-8"></span>
                                    </p>
                                </div>
                            </div>
                        </div>)
                        }
                    </div>
                </div>
                {/* pagination */}
                {totalPages > 1 ? <div className=' p-2 text-center d-flex justify-content-center align-items-center'>
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
        </section>
    </>
}