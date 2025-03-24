import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function GetAllTeachers() {
    // VARIABLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const { stage, arr, baseURL } = useContext(SharedDataContext);
    const navigate = useNavigate();
    const [isLoading, setIsloading] = useState(false);
    const [allTeachers, setallTeachers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    // FUNCTIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // FUNCTION DELETE ITEM >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    async function deleteItem(id, emailTeacher) {
        setIsloading(true);
        try {
            await axios.delete(`${baseURL}/auth/deleteTeacher`, {
                headers: {
                    token: `online__${Cookies.get("token")}`,  // Send token in headers
                },
                params: {
                    teacherId: id,  // Send teacherId as query parameter
                },
                data: {
                    email: emailTeacher  // Send email in request body
                }
            }).then((res) => {
                setIsloading(false);  // Stop loading indicator after the request completes
                if (res.data.message === "Refresh token") {
                    toast.error("انتهت صلاحية الجلسة, حاول مرة اخري", {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    Cookies.set('token', res?.data?.refreshToken, { expires: 7 });
                } else {
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
                }
            })
        } catch (error) {
            if (error.response.data.Error === 'wrong  token') {
                Cookies.remove('token');
                navigate('/login')
            } else {
                toast.error('لديك مشكلة في الحذف ', {
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
            setIsloading(false);  // Stop loading in case of error
        }
    }
    // PAGENATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    function prePage() {
        setIsloading(true)
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setIsloading(false)
        }
    }
    function nextPage() {
        setIsloading(true)
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            setIsloading(false)
        }
    }
    // USEEFFECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        async function getAll(page) {
            const { data } = await axios.get(`${baseURL}/auth/teachers?page=${page}`);
            if (data && data.paginationInfo) {
                setallTeachers(data.data)
                setTotalPages(data.paginationInfo.totalPages || 1); // Default to 1 if undefined
            } else {
                setallTeachers([])
                setTotalPages(1);
            }
        }
        getAll(currentPage);
    }, [allTeachers]);

    // RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return <>
        <Helmet>
            <title>All Teachers - Sky Online Acadimy</title>
        </Helmet>
        <div className="container py-5">
            <ToastContainer />
            {isLoading ? <div className="text-light position-fixed start-50 top-50  p-4" style={{ transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.6)' }}>
                <i className="fa fa-spin fa-spinner fs-3"></i>
            </div> : ""}
            <div className="w-100  overflow-x-auto">
                <table className="table text-center  table-striped  table-hover table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">الاسم</th>
                            <th scope="col">الايميل</th>
                            <th scope="col">تابع الي</th>
                            <th scope="col">الرقم التليفون</th>
                            <th scope="col"> حذف </th>
                        </tr>
                    </thead>
                    <tbody>
                        {allTeachers?.length > 0 ? allTeachers?.map((item, index) => <tr key={index}>
                            <td className="col">{item.fullName}</td>
                            <td>{item.email}</td>
                            <td>{item.courseId?.name} - {stage[item.stage]}</td>
                            <td>{item.phoneNumber.replace("+2", "")}</td>
                            <td> <button className="btn btn-sm btn-danger ms-2" onClick={() => { deleteItem(item._id, item.email) }}>  حذف</button>
                            </td>
                        </tr>
                        ) : arr.map((item, index) => (
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
            {totalPages > 1 ? <div className=' p-2 text-center d-flex align-items-center justify-content-center'>
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