import { useContext, useEffect, useState } from "react";
import style from "../../src/Styles/Auth.module.css"
import axios from "axios";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function AddVideo() {
    // VARIABLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const { stage, grade, baseURL } = useContext(SharedDataContext);
    let navigate = useNavigate();
    const [courseId, setcourseId] = useState(null);
    const [video, setvideo] = useState({ title: "", videoURL: "", });
    const [image, setImage] = useState(null);
    const [Isloading, setIsloading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [isSubmit, setIsSubmit] = useState(false);
    const validExtensions = ["image/png", "image/jpeg", "image/gif"];
    const formData = new FormData();
    // USEEFFECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        async function getAllCourses() {
            const { data } = await axios.get(`${baseURL}/course`);
            setCourses(data.data);
        }
        getAllCourses()
    }, [courses])

    // FUNCTION HANDLE IMAGE >>>>>>>>>>>>>>>>>>>>>>>>>>>
    const handleImageChange = (e) => {
        const file = Array.from(e.target.files)[0];
        setImage(file);
    };
    // FUNCTION HANDLE OBJECT >>>>>>>>>>>>>>>>>>>>>>>>>
    const handleChange = (e) => {
        const { name, value } = e.target;
        setvideo({
            ...video,
            [name]: value,
        })
    };
    // FUNCTION ADD VIDEO >>>>>>>>>>>>>>>>>>>>>>>>>>>>
    async function addItem() {
        setIsloading(true)
        formData.append("image", image);
        formData.append("title", video.title);
        formData.append("videoURL", video.videoURL);
        try {
            await axios.post(`${baseURL}/lecture/create?courseId=${courseId}`, formData, {
                headers: {
                    "token": `online__${Cookies.get('token')}`
                }
            }).then((res) => {
                setIsloading(false)
                if (res.data.message === " created successfuly") {
                    navigate('/teacherAdmin/allVideos')
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
    // FUNCTION SUBMIT FORM >>>>>>>>>>>>>>>>>>>>>>>
    const handleSubmit = (e) => {
        setIsSubmit(true)
        e.preventDefault();
        addItem()
    };
    // RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return <>
        <Helmet>
            <title>Add Video - Sky Online Acadimy</title>
        </Helmet>
        <div className="container py-5">
            <ToastContainer />
            <div className="text-center rounded-4  border-1 widthCustom mx-auto">
                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className=" mb-4">
                        <input placeholder=" ادخل الصورة" type="file" className="w-100 p-2" name="images" onChange={handleImageChange} />
                        {isSubmit ? <>
                            {!image ? <p className="small fw-medium  py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                            {image ? !validExtensions.includes(image?.type) ? <p className="small fw-medium  py-2 text-end text-danger">هذا الامتداد غير صحيح</p> : "" : ""}
                        </> : ""}
                    </div>
                    <div className=" mb-4">
                        <input placeholder=" عنوان الفيديو" autoComplete="off" type="text" className="w-100 p-2 text-black" name="title" onChange={handleChange} value={video.title} />
                        {isSubmit ? video.title === "" ? <p className="small fw-medium  py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : "" : ""}
                    </div>
                    {/* videoUrl */}
                    <div className=" mb-4">
                        <input placeholder=" رابط الفيديو علي اليوتيوب" type="text" className="w-100 p-2" name="videoURL" value={video.videoURL} onChange={handleChange} />
                        {isSubmit ? video.videoURL === "" ? <p className="small fw-medium  py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : "" : ""}
                    </div>
                    {/* to know id => course  not send value to api but sending courseId*/}
                    <div className="my-4">
                        <select className="w-100 p-2 text-muted" autoComplete="off" onChange={(e) => setcourseId(e.target.value)}  >
                            <option value="">  الكورسات</option>
                            {courses?.map((category, index) => <option key={index} value={category.id}>{category?.name} - {stage[category.subCategoryId?.name]} {grade[category.categoryId?.name]}</option>)}
                        </select>
                        {isSubmit ? !courseId ? <p className="small fw-medium  py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : "" : ""}
                    </div>
                    <button type="submit" className={`w-100 p-2 border-0 rounded-2 ${style.btnOrange} my-3  w-100 `}> {Isloading ? <i className="fa-spin fa fa-spinner"></i> : "اضف"}</button>
                </form>
            </div>
        </div>
    </>
}
