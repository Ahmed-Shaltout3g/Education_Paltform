import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect, useContext } from "react";
import style from "../../src/Styles/Auth.module.css"
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function UpdateCourse() {
    // VARIABLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const {  baseURL} = useContext(SharedDataContext);
    const { id, nameCourse } = useParams()
    let navagite = useNavigate()
    const formData = new FormData();
    const [Isloading, setIsloading] = useState(false);
    const [image, setImage] = useState(null);
    const [name, setName] = useState(nameCourse);
    const [isSubmit, setIsSubmit] = useState(false);
    const validExtensions = ["image/png", "image/jpeg", "image/gif"];
    // UPDATE COURSE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    async function updateItem() {
        setIsloading(true);
        // HANDLE FORM DATA >>
        formData.append("image", image);
        formData.append("name", name);
        try {
            await axios
                .put(`${baseURL}/course/update?courseId=${id}`, formData, {
                    headers: {
                        token: `online__${Cookies.get("token")}`,
                    },
                })
                .then((res) => {
                    setIsloading(false);
                    if (res.status === 200) {
                        navagite('/admin/allCources')
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
        }
    }
    // HANDLE IMAGE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const handleImageChange = (e) => {
        const file = Array.from(e.target.files)[0];
        setImage(file);
    };
    // SUBMIT FORM >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const handleSubmit = (e) => {
        setIsSubmit(true)
        e.preventDefault();
        updateItem();
    };
    // useeffect 
    useEffect(() => {
        window.scroll(0, 0)
    }, [])
    // RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return <>
        <Helmet>
            <title>Update Course - Sky Online Acadimy</title>
        </Helmet>
        <div className="container py-5">
            {/* ERRORS */}
            <ToastContainer />
            <div className=" rounded-4  border-1 widthCustom mx-auto">
                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className=" mb-4 text-end">
                        <label className="py-3" htmlFor="image">برجاء اختيار صورة جديدة</label>
                        <input placeholder=" اضف صورة " id="image" type="file" className="w-100 p-2" name="image" onChange={handleImageChange} />
                        {isSubmit ? <>
                            {!image ? <p className="small fw-medium  py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                            {image ? !validExtensions.includes(image?.type) ? <p className="small fw-medium  py-2 text-end text-danger">هذا الامتداد غير صحيح</p> : "" : ""}
                        </> : ""}
                    </div>
                    <div className=" mb-4">
                        <label className="mb-2" htmlFor="name">{nameCourse}</label>
                        <input autoComplete="off" placeholder=" اضف  عنوانا للكورس " type="text" className="w-100 p-2" name="name" value={formData.get('name')} onChange={(e) => setName(e.target.value)} />
                        {isSubmit ? !formData.get('name') ? <p className="small fw-medium  py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : "" : ""}
                    </div>
                    <button type="submit" className={`w-100 p-2 border-0 rounded-2 ${style.btnOrange} my-3  w-100 `}>    {Isloading ? <i className="fa fa-spin fa-spinner"></i> : "حفظ"}</button>
                </form>
            </div>
        </div>
    </>;
}
