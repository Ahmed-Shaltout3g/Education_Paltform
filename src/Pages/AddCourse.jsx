import { useContext, useEffect, useState } from "react";
import style from "../../src/Styles/Auth.module.css";
import Cookies from 'js-cookie';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function AddCourse() {
    // VARIABLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const { stage, grade, baseURL } = useContext(SharedDataContext);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [Isloading, setIsloading] = useState(false);
    const [subcategoryId, setsubcategoryId] = useState(null);
    const [subCategoryies, setsubCategoryies] = useState([]);
    const [isSubmit, setIsSubmit] = useState(false);
    const validExtensions = ["image/png", "image/jpeg", "image/gif"];
    const formData = new FormData();

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // FUNCTION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // FUNCTION HANDLE IMAGE >>
    const handleImageChange = (e) => {
        const file = Array.from(e.target.files)[0];
        setImage(file);
    };
    // USEEFFECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        const getAllsubCategoryies = async () => {
            const { data } = await axios.get(`${baseURL}/subcategory`);
            setsubCategoryies(data.Subcategories);
        };
        getAllsubCategoryies(); // Only call this once when the component mounts
    }, []);
    // HANDLE SUBMIT FORM >>
    const handleSubmit = (e) => {
        setIsSubmit(true);
        e.preventDefault();
        addItem();
    };
    // FUNCTION ADD COURSE
    async function addItem() {
        setIsloading(true);
        formData.append("image", image);
        formData.append("name", name);
        try {
            await axios.post(`${baseURL}/course/create?subCategoryId=${subcategoryId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "token": `online__${Cookies.get('token')}`
                }
            }).then((res) => {
                setIsloading(false);
                if (res.data.message === "course created successfuly") {
                    navigate('/admin/allCources');
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
            console.log(error)
            setIsloading(false);
            if (error.response.data.Error === 'wrong  token') {
                Cookies.remove('token');
                navigate('/login')
            }

        }
    }
    // RENDER HTML >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return <>
        <Helmet>
            <title>Add Course - Sky Online Acadimy</title>
        </Helmet>
        <div className="container py-5">
            <ToastContainer />
            <div className="text-center rounded-4  border-1 widthCustom mx-auto">
                <form encType='multibart/form-data' onSubmit={handleSubmit}>
                    <div className=" mb-4">
                        <input placeholder=" اضف صورة " type="file" className="w-100 p-2" name="image" onChange={handleImageChange} />
                        {isSubmit ? <>
                            {!image ? <p className="small fw-medium  py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                            {image ? !validExtensions.includes(image?.type) ? <p className="small fw-medium  py-2 text-end text-danger">هذا الامتداد غير صحيح</p> : "" : ""}
                        </> : ""}
                    </div>
                    <div className=" mb-4">
                        <input autoComplete="off" placeholder=" اضف  عنوانا للكورس " type="text" className="w-100 p-2" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                        {isSubmit ? name === "" ? <p className="small fw-medium  py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : "" : ""}
                    </div>
                    <div className="my-4">
                        <select className="w-100 p-2 text-muted" autoComplete="off" name="name" onChange={(e) => setsubcategoryId(e.target.value)}  >
                            <option value="">   الصف  الدراسي </option>
                            {subCategoryies?.map((subcategory, index) => <option key={index} value={subcategory._id}>{stage[subcategory.name]} {grade[subcategory.categoryId.name]}</option>)}
                        </select>
                        {isSubmit ? !subcategoryId ? <p className="small fw-medium  py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : "" : ""}
                    </div>
                    <button type="submit" className={`w-100 my-4 p-2 border-0 rounded-2 ${style.btnOrange} my-3  w-100 `}>{Isloading ? <i className="fa-spin fa fa-spinner"></i> : "اضف"}</button>
                </form>
            </div >
        </div >
    </>
}
