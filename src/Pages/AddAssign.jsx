import React, { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import style from "../../src/Styles/Auth.module.css"
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';
import { SharedDataContext } from '../Contexts/SharedDataContext';
export default function AddAssign() {
    // VARIABLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const { baseURL } = useContext(SharedDataContext);
    const formData = new FormData();
    let navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const [assign, setassign] = useState({ title: "", desc: "", });
    const [AllLectures, setAllLectures] = useState([]);
    const [Isloading, setIsloading] = useState(false);
    const [files, setfiles] = useState(null);
    const [lectureId, setlectureId] = useState(null);
    const validExtensions = ["application/pdf"];
    // USEEFFECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        async function getAllLecture() {
            const { data } = await axios.get(`${baseURL}/lecture?size=1000`);
            setAllLectures(data.data);
        }
        getAllLecture()
    }, [AllLectures])

    // FUNCTION HANDLE IMAGE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const handleImageChange = (e) => {
        const file = Array.from(e.target.files)[0];
        setfiles(file)
    };
    // FUNCION HANDLE OBJECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const handleChange = (e) => {
        const { name, value } = e.target;
        setassign({
            ...assign,
            [name]: value,
        })
    };
    // FUNCTION ADD ASSIGNMENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>
    async function addAssignment() {
        setIsloading(true)
        formData.append("application", files);
        formData.append("title", assign.title);
        formData.append("description", assign.desc);
        try {
            await axios.post(`${baseURL}/assignment/create?lectureId=${lectureId}`, formData, {
                headers: {
                    "token": `online__${Cookies.get('token')}`
                }
            }).then((res) => {
                setIsloading(false)
                if (res.data.message === " created successfuly") {
                    navigate('/teacherAdmin/AllAssignment')
                }
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
                }
            })
        } catch (error) {
            setIsloading(false)
            if (error.response.data.Error === 'wrong  token') {
                Cookies.remove('token');
                navigate('/login')
            }
            if (error.response.data.Error === "In-valid extintions ") {
                toast.error(" امتداد الملف غير صحيح", {
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
            if (error.response.data.message === "Validation Error") {
                toast.error("اتبع التعلميات", {
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

            if (error.response.data.Error === "invalid course id ") {
                toast.error("لا يمكن اضافة ملف لهذا المحاضرة", {
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
    }
    // FUNCTION SUBMIT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const handleSubmit = (e) => {
        setIsSubmit(true)
        e.preventDefault();
        addAssignment()
    };
    // RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return <>
        <Helmet>
            <title>Add Assignment - Sky Online Acadimy</title>
        </Helmet>
        <div className="container py-5">
            <ToastContainer />
            <div className="text-center rounded-4  border-1 widthCustom mx-auto">
                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                    {/* pdf */}
                    <div className=" mb-4">
                        <input placeholder=" ادخل ملف" type="file" className="w-100 p-2" name="filePdf" onChange={handleImageChange} />
                        {isSubmit ? <>
                            {!files ? <p className="small fw-medium  py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                            {files ? !validExtensions.includes(files?.type) ? <p className="small fw-medium  py-2 text-end text-danger">هذا الامتداد غير صحيح</p> : "" : ""}
                        </> : ""}
                    </div>
                    {/* title */}
                    <div className=" mb-4">
                        <input placeholder=" عنوان " value={assign.title} autoComplete="off" type="text" className="w-100 p-2 text-black" name="title" onChange={handleChange} />
                        {isSubmit ? assign.title === "" ? <p className="small fw-medium  py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : "" : ""}
                    </div>
                    {/* desc */}
                    <div className=" mb-4">
                        <textarea className="w-100 p-2" placeholder='وصف الواجب' name="desc" value={assign.desc} onChange={handleChange}></textarea>
                    </div>
                    {/* to know id => lecture  not send value to api but sending lectureId*/}
                    <div className="my-4">
                        <select className="w-100 p-2 text-muted" autoComplete="off" onChange={(e) => setlectureId(e.target.value)}  >
                            <option value="">  المحاضرات </option>
                            {AllLectures?.map((lecture, index) => <option key={index} value={lecture.id}>{lecture.title}</option>)}
                        </select>
                        {isSubmit ? !lectureId ? <p className="small fw-medium  py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : "" : ""}
                    </div>
                    <button type="submit" className={`w-100 p-2 border-0 rounded-2 ${style.btnOrange} my-3  w-100 `}> {Isloading ? <i className="fa-spin fa fa-spinner"></i> : " اضف ملف "}</button>
                </form>
            </div>
        </div>
    </>
}