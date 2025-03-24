import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import style from "../../src/Styles/Auth.module.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';
import { SharedDataContext } from '../Contexts/SharedDataContext';
export default function UpdateVideos() {
    // VARIABLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const {  baseURL} = useContext(SharedDataContext);
    const { id, title } = useParams()
    let navagite = useNavigate();
    const [Isloading, setIsloading] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [image, setImage] = useState(null);
    const [updatedVideo, setupdatedVideo] = useState({ title: title, videoURL: "" });
    const validExtensions = ["image/png", "image/jpeg", "image/gif"];
    const formData = new FormData();
    // USEEFFECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        window.scroll(0, 0)
    }, [])
    // update item
    async function updateItem() {
        setIsloading(true)
        formData.append("image", image);
        formData.append("title", updatedVideo.title);
        formData.append("videoURL", updatedVideo.videoURL);
        try {
            await axios
                .put(`${baseURL}/lecture/update?lectureId=${id}`, formData, {
                    headers: {
                        token: `online__${Cookies.get("token")}`,
                    },
                })
                .then((res) => {
                    setIsloading(false)
                    if (res.data.message === "Done") {
                        navagite('/teacherAdmin/allVideos');
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
            setIsloading(false)
            console.log(error)
            if (error.response.data.Error === 'wrong  token') {
                Cookies.remove('token');
                navagite('/login')
            }
            if (error.response.data.Error === "In-valid extintions ") {
                toast.error(" امتداد الصورة غير صحيح", {
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
    // FUNCTION HANGLE OBJECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const handleChange = (e) => {
        const { name, value } = e.target;
        setupdatedVideo({
            ...updatedVideo,
            [name]: value,
        })
    };
    // FUNCTION HANDLE IMAGE >>>>>>>>>>>>>>>>>>>>>>>>>>>
    const handleImageChange = (e) => {
        const file = Array.from(e.target.files)[0];
        setImage(file);
    };
    const handleSubmit = (e) => {
        setIsSubmit(true)
        e.preventDefault();
        updateItem();
    }
    return <>
        <Helmet>
            <title>Update Video - Sky Online Acadimy</title>
        </Helmet>
        <div className="container py-5">
            <ToastContainer />
            <div className="text-center rounded-4  border-1 widthCustom mx-auto">
                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className=" mb-4">
                        <label className="py-3" htmlFor="image">برجاء اختيار صورة جديدة</label>
                        <input placeholder=" ادخل الصورة" type="file" className="w-100 p-2" name="image" onChange={handleImageChange} />
                        {isSubmit ? <>
                            {image ? !validExtensions.includes(image?.type) ? <p className="small fw-medium  py-2 text-end text-danger">هذا الامتداد غير صحيح</p> : "" : ""}
                        </> : ""}
                    </div>
                    {/* title */}
                    <div className=" mb-4">
                        <input
                            placeholder=" عنوان الفيديو"
                            autoComplete="off"
                            type="text"
                            className="w-100 p-2"
                            name="title"
                            onChange={handleChange}
                            value={updatedVideo.title}
                        />
                    </div>
                    {/* videoUrl */}
                    <div className=" mb-4">
                        <input
                            placeholder=" رابط الفيديو علي اليوتيوب"
                            type="text"
                            className="w-100 p-2"
                            name="videoURL"
                            value={updatedVideo.videoURL}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className={`w-100 p-2 border-0 rounded-2 ${style.btnOrange} my-3  w-100 `}> {Isloading ? <i className="fa-spin fa fa-spinner"></i> : "تعديل"}</button>
                </form>
            </div>
        </div>
    </>
}