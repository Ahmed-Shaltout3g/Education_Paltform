import axios from 'axios';
import React, { useState, useContext } from 'react'
import Cookies from 'js-cookie';
import style from "../../src/Styles/Auth.module.css"
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { SharedDataContext } from '../Contexts/SharedDataContext';
export default function UpdateAssignment() {
    // VARIABLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const {  baseURL} = useContext(SharedDataContext);
    const { id } = useParams()
    let navagite = useNavigate();
    const formData = new FormData();
    const [Isloading, setIsloading] = useState(false);
    const [files, setfiles] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [assign, setassign] = useState({ title: "", desc: "", });
    const validExtensions = ["application/pdf"];
    // UPDATE ASSIGNMENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    async function updateItem() {
        setIsloading(true)
        formData.append("application", files);
        formData.append("title", assign.title);
        formData.append("description", assign.desc);
        try {
            await axios.patch(`${baseURL}/assignment/update?assignmentId=${id}`, formData, {
                headers: {
                    token: `online__${Cookies.get("token")}`,
                },
            })
                .then((res) => {
                    setIsloading(false);
                    if (res.data.message === "Assignment updated successfully") {
                        navagite('/teacherAdmin/AllAssignment')
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
                });
        } catch (error) {
            setIsloading(false);
            if (error.response.data.Error === 'wrong  token') {
                Cookies.remove('token');
                navagite('/login')
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

        }
    }
    // HANDLE IMAGE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const handleFileChange = (e) => {
        const file = Array.from(e.target.files)[0];
        setfiles(file);
    };
    // SUBMIT FORM >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const handleSubmit = (e) => {
        setIsSubmit(true)
        e.preventDefault();
        updateItem();
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setassign({
            ...assign,
            [name]: value,
        })
    };

    // RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return <>
        <Helmet>
            <title>Update Assignment - Sky Online Acadimy</title>
        </Helmet>
        {/* ERRORS */}
        <ToastContainer />
        <div className="container py-5">
            <div className="text-center rounded-4  border-1 widthCustom mx-auto">
                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className=" mb-4 text-end">
                        {/* pdf */}
                        <div className=" mb-4">
                            <label className="py-3" htmlFor="filePdf">برجاء اختيار ملف جديدة</label>
                            <input placeholder=" ادخل ملف" id='filePdf' type="file" className="w-100 p-2" name="filePdf" onChange={handleFileChange} />
                            {isSubmit ? <>
                                {files ? !validExtensions.includes(files?.type) ? <p className="small fw-medium  py-2 text-end text-danger">هذا الامتداد غير صحيح</p> : "" : ""}
                            </> : ""}
                        </div>
                        {/* title */}
                        <div className=" mb-4">
                            <input placeholder=" عنوان " value={assign.title} autoComplete="off" type="text" className="w-100 p-2 text-black" name="title" onChange={handleChange} />
                        </div>
                        {/* desc */}
                        <div className=" mb-4">
                            <textarea className="w-100 p-2" placeholder='وصف الواجب' name="desc" value={assign.desc} onChange={handleChange}></textarea>
                        </div>
                    </div>
                    <button type="submit" className={`w-100 p-2 border-0 rounded-2 ${style.btnOrange} my-3  w-100 `}>    {Isloading ? <i className="fa fa-spin fa-spinner"></i> : "حفظ"}</button>
                </form>
            </div>
        </div>
    </>
}
