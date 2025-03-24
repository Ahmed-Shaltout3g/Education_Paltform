import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Cookies from "js-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SharedDataContext } from '../Contexts/SharedDataContext';
export default function AllAssignment() {
    // VARIABLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const { arr, baseURL } = useContext(SharedDataContext);
    const [tasks, settasks] = useState([]);
    let navagite = useNavigate();
    const [isLoading, setIsloading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // FUNCTION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // pagination >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    function nextPage() {
        setIsloading(true)
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            setIsloading(false)
        }
    }
    function prePage() {
        setIsloading(true)
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setIsloading(false)
        }
    }
    // DELETE COURSE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    async function deleteItem(id) {
        setIsloading(true);
        try {
            await axios
                .delete(`${baseURL}/assignment/delete?assignmentId=${id}`, {
                    headers: {
                        token: `online__${Cookies.get("token")}`,
                    },
                })
                .then(() => {
                    setIsloading(false)
                    toast.success('قد تم الحذف  ', {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                });
        } catch (error) {
            setIsloading(false)
            if (error?.response?.data?.Error === 'wrong  token') {
                Cookies.remove('token');
                navagite('/login')
            }

        }
    }
    // USE EFFECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        // GET ALL COURSES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        async function getAllAssignment(page) {
            const { data } = await axios.get(`${baseURL}/assignment?page=${page}`);
            if (data && data.paginationInfo) {
                settasks(data.data)
                setTotalPages(data.paginationInfo.totalPages || 1); // Default to 1 if undefined
            } else {
                settasks([])
                setTotalPages(1);
            }
        }
        getAllAssignment(currentPage)
    }, [tasks]);

    // RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return <>
        <Helmet>
            <title>All Assignment - Sky Online Acadimy</title>
        </Helmet>
        <div className="container py-5">
            <ToastContainer />
            {isLoading ? <div className="text-white position-fixed start-50 top-50  p-4" style={{ transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.6)' }}>
                <i className="fa fa-spin fa-spinner h3"></i>
            </div> : ""}
            <div className='w-100 overflow-x-scroll'>
                <table className="table table-striped text-center   table-hover table-bordered">
                    <thead>
                        <tr>
                            <th className="py-3" scope="col">
                                اسم الملف
                            </th>
                            <th className="py-3" scope="col">
                                عنوان الكورس
                            </th>
                            <th className="py-3" scope="col">
                                اسم المحاضرة
                            </th>
                            <th className="py-3" scope="col">
                                تم إنشاؤه بواسطة
                            </th>
                            <th className="py-3" scope="col">
                                المعاملات{" "}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks?.length > 0
                            ? tasks.map((item, index) => (
                                <tr key={index}>
                                    <td className="col-2">{item?.title} </td>
                                    <td className="pt-3" >{item.courseId?.name}</td>
                                    <td className="pt-3" >{item.lectureId?.title}</td>
                                    <td className="pt-3">{item.createdBy?.fullName}</td>
                                    <td className="pt-3   ">
                                        <div className=" d-flex align-items-center  justify-content-center ">
                                            <button
                                                className="btn btn-sm btn-danger   ms-2"
                                                onClick={() => { deleteItem(item._id) }}
                                            >
                                                حذف
                                            </button>
                                            <Link
                                                className="btn btn-primary btn-sm"
                                                to={`/teacherAdmin/UpdateAssignment/${item._id}`}
                                            >
                                                تعديل
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            : arr.map((item, index) => (
                                <tr key={index}>
                                    <th className="placeholder-glow   p-4"></th>
                                    <td className="placeholder-glow   p-4"></td>
                                    <td className="placeholder-glow   p-4"></td>
                                    <td className="placeholder-glow   p-4"></td>
                                    <td className="placeholder-glow   p-4"></td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {/* pagination */}
            {totalPages > 1 ? <div className=' p-2 text-center d-flex justify-content-center'>
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
