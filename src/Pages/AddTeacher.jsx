import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import style from "../../src/Styles/Auth.module.css";
import "../Styles/index.css";
import axios from "axios";
import Joi from "joi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function AddTeacher() {
    //Variables here >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..
    const { baseURL } = useContext(SharedDataContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "", repassword: "", stage: "", phoneNumber: "", gender: "", subjecTeacher: "" });
    const [error, setError] = useState([]);
    const [Isloading, setIsloading] = useState(false);
    const [inputType, setInputType] = useState('password');
    const [showPassword, setShowPassword] = useState(false);
    const [inputType2, setInputType2] = useState('password');
    const [showrePassword, setShowrePassword] = useState(false);
    const [Courses, setCourses] = useState([]);
    const [CoursesId, setCoursesId] = useState("");
    // FUNCTION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // FUNCTION SHOW AND HIDDEN PASSWORD
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        setInputType(inputType === 'password' ? 'text' : 'password');
    };
    const togglerePasswordVisibility = () => {
        setShowrePassword(!showrePassword);
        setInputType2(inputType2 === 'password' ? 'text' : 'password');
    };
    // ==============================================================
    // USEEFFECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        async function getAll() {
            const { data } = await axios.get(`${baseURL}/course`);
            setCourses(data.data)
        }
        getAll();
    }, [Courses?.length]);
    //function HANDLE OBJECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const handleChange = (e) => {
        const _formData = { ...formData };
        _formData[e.target.name] = e.target.value;
        setFormData(_formData);
    };
    // function SUBMIT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const submitRegisterForm = (e) => {
        e.preventDefault();
        const validate = validationForm();
        validate.error ? setError(validate.error.details) : addTeacher();
        setIsloading(false);
        addTeacher();
    };
    // function VALIDATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const validationForm = () => {
        let schema = Joi.object({
            fullName: Joi.string().min(3).max(100).required(),
            email: Joi.string()
                .email({ tlds: { allow: ["com", "net", "org"] } })
                .required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{8,}$/),
            repassword: Joi.valid(Joi.ref("password")).required(),
            stage: Joi.string().required(),
            gender: Joi.string().required(),
            subjecTeacher: Joi.string().required(),
            phoneNumber: Joi.string().regex(/^\01(0125)[0-9]{8}$/).required(),
        });
        return schema.validate(formData, { abortEarly: false });
    };
    // function ADD TEACHER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    async function addTeacher() {
        setIsloading(true)
        formData.phoneNumber = `+2${formData.phoneNumber}`
        try {
            await axios.post(`${baseURL}/auth/addTeacher?courseId=${CoursesId}`, formData, {
                headers: {
                    "token": `online__${Cookies.get('token')}`
                }
            }).then((response) => {
                if (response.data.message === "Done,please try to Login") {
                    navigate('/admin/allTeachers')
                }
                if (response.data.message === "Refresh token") {
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
                    Cookies.set('token', response?.data?.refreshToken, { expires: 7 });
                }
            })
        } catch (error) {
            if (error.response.data.Error === 'wrong  token') {
                Cookies.remove('token');
                navigate('/login')
            } else {
                toast.error(" هناك مشكلة في اضافة المدرس", {
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
        setIsloading(false)
    }
    // RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return (
        <>
            <Helmet>
                <title>Add Teacher Account - Sky Online Acadimy</title>
            </Helmet>
            <div className="container py-5">
                <ToastContainer />
                <div className="text-center rounded-4  border-1 widthCustom mx-auto">
                    <form onSubmit={submitRegisterForm}>
                        {/* full name  */}
                        <div className=" mb-4">
                            <input placeholder=" الاسم بالكامل" type="text" className="w-100 p-2" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
                            {error?.map((err, index) =>
                                err.context.label === "fullName" ? <div key={index}>
                                    {err.type === "string.min" ? <p className="small fw-medium py-2 text-end text-danger">يجب أن لا يقل عدد الحروف عن 3</p> : ""}
                                    {err.type === "string.max" ? <p className="small fw-medium py-2 text-end text-danger">يجب الا يزيد عدد الحروف عن  100 حرف</p> : ""}
                                    {!formData.fullName ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                                </div> : ""
                            )}
                        </div>
                        {/* email */}
                        <div className=" mb-4">
                            <input placeholder="البريد الالكتروني" type="email" className="w-100 p-2" id="email" name="email" value={formData.email} onChange={handleChange} />
                            {error?.map((err, index) =>
                                err.context.label === "email" ? <div key={index}>
                                    {err.type === "string.email" ? <p className="small fw-medium py-2 text-end text-danger"> البريد الإلكتروني غير صحيح</p> : ""}
                                    {!formData.email ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                                </div> : ""
                            )}
                        </div>
                        {/* password */}
                        <div className=" mb-4 ">
                            <div className="position-relative">
                                {inputType !== "password" ?
                                    <i onClick={togglePasswordVisibility} className={`fa-solid fa-eye position-absolute  px-4  top-50 translate-middle ${style.eyePostion}`}></i> :
                                    <i onClick={togglePasswordVisibility} className={`fa-solid fa-eye-slash position-absolute  px-4  top-50 translate-middle ${style.eyePostion}`}></i>
                                }
                                <input placeholder="ادخل كلمة المرور" type={inputType} className="w-100 p-2 " id="password" name="password" value={formData.password} onChange={handleChange} />
                            </div>
                            {error?.map((err, index) =>
                                err.context.label === "password" ? <div key={index}>
                                    {err.type === "string.pattern.base" ? <p className="small fw-medium py-2 text-end text-danger">    يجب ان تحتوي كلمة  المرور علي 8 احروف او ارقام</p> : ""}
                                    {!formData.password ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                                </div> : ""
                            )}
                        </div>
                        {/* repassword */}
                        <div className=" mb-4">
                            <div className="position-relative">
                                {inputType2 !== "password" ?
                                    <i onClick={togglerePasswordVisibility} className={`fa-solid fa-eye position-absolute  px-4  top-50 translate-middle ${style.eyePostion}`}></i> :
                                    <i onClick={togglerePasswordVisibility} className={`fa-solid fa-eye-slash position-absolute  px-4  top-50 translate-middle ${style.eyePostion}`}></i>
                                }
                                <input placeholder="تأكيد كلمة المرور " type={inputType2} className="w-100 p-2" id="repassword" name="repassword" value={formData.repassword} onChange={handleChange} />
                            </div>
                            {error?.map((err, index) =>
                                err.context.label === "repassword" ? <div key={index}>
                                    {formData.password !== formData.repassword ? <p className="small fw-medium py-2 text-end text-danger">    كلمتا المرور غير متطابقتين</p> : ""}
                                </div> : ""
                            )}
                        </div>
                        {/*stage  */}
                        <div className=" mb-4">
                            <select className="w-100 p-2 text-muted" id="stage" name="stage" value={formData.stage} onChange={handleChange}  >
                                <option value="">المرحلة </option>
                                <option value="primary">الابتدائية</option>
                                <option value="preparatory">الاعدادية </option>
                                <option value="secondary">الثانوية </option>
                            </select>
                            {error?.map((err, index) =>
                                err.context.label === "stage" ? <div key={index}>
                                    {!formData.stage ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                                </div> : ""
                            )}
                        </div>
                        {/* gender */}
                        <div className=" mb-4">
                            <select className="w-100 p-2 text-muted" id="gender" name="gender" value={formData.gender} onChange={handleChange} >
                                <option value="">النوع</option>
                                <option value="male">ذكر</option>
                                <option value="female">انثي</option>
                            </select>
                            {error?.map((err, index) =>
                                err.context.label === "gender" ? <div key={index}>
                                    {!formData.gender ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                                </div> : ""
                            )}
                        </div>
                        {/* to know course Id */}
                        <div className=" mb-4">
                            <select className="w-100 p-2 text-muted" autoComplete="off" onChange={(e) => { setCoursesId(e.target.value) }}  >
                                <option value="">المادة </option>
                                {Courses?.map((course, index) =>
                                    <option key={index} value={course.id} >{course.name} </option>
                                )}
                            </select>
                            {error?.map((err, index) =>
                                err.context.label === "stage" ? <div key={index}>
                                    {!formData.stage ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                                </div> : ""
                            )}
                        </div>
                        {/* subjecTeacher */}
                        <div className=" mb-4">
                            <textarea className="w-100 p-2" id="subjecTeacher" name="subjecTeacher" placeholder="معلومات عن المدرس" value={formData.subjecTeacher} onChange={handleChange}></textarea>
                            {error?.map((err, index) =>
                                err.context.label === "subjecTeacher" ? <div key={index}>
                                    {!formData.subjecTeacher ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                                </div> : ""
                            )}
                        </div>
                        {/* phone number */}
                        <div className=" mb-4">
                            <input placeholder="رقم الهاتف" type="text" className="w-100 p-2" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                            {error?.map((err, index) =>
                                err.context.label === "phoneNumber" ? <div key={index}>
                                    {!formData.phoneNumber ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                                </div> : ""
                            )}
                        </div>
                        <button type="submit" className={`w-100 my-4 p-2 border-0 rounded-2 ${style.btnOrange} my-3  w-100 `}>{Isloading ? <i className="fa-spin fa fa-spinner"></i> : "انشاء حساب"}</button>
                    </form>
                </div>
            </div>
        </>
    );
};