import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "../../src/Styles/Auth.module.css";
import logo from "../../src/Assets/Images/logo.png";
import "../Styles/index.css";
import axios from "axios";
import Joi from "joi";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function Register() {
    //Variables here >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..
    const { baseURL} = useContext(SharedDataContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "", repassword: "", gender: "", grade: "", stage: "", phoneNumber: "", parentsPhoneNumber: "" });
    const [error, setError] = useState([]);
    const [Isloading, setIsloading] = useState(false);
    const [inputType, setInputType] = useState('password');
    const [showPassword, setShowPassword] = useState(false);
    const [inputType2, setInputType2] = useState('password');
    const [showrePassword, setShowrePassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        setInputType(inputType === 'password' ? 'text' : 'password');
    };
    const togglerePasswordVisibility = () => {
        setShowrePassword(!showrePassword);
        setInputType2(inputType2 === 'password' ? 'text' : 'password');
    };
    // Function here >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..
    //function one >>
    const handleChange = (e) => {
        const _formData = { ...formData };
        _formData[e.target.name] = e.target.value;
        setFormData(_formData);
    };
    // function two >>
    const submitRegisterForm = (e) => {
        e.preventDefault();
        const validate = validationForm();
        validate.error ? setError(validate.error.details) : sendApi();
    };
    // function three >>
    const validationForm = () => {
        let schema = Joi.object({
            fullName: Joi.string().min(3).max(100).required(),
            email: Joi.string()
                .email({ tlds: { allow: ["com", "net", "org"] } })
                .required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{8,}$/),
            repassword: Joi.valid(Joi.ref("password")).required(),
            gender: Joi.string().required(),
            grade: Joi.string().required(),
            stage: Joi.string().required(),
            phoneNumber: Joi.string().regex(/^01[0125]\d{8}$/).required(),
            parentsPhoneNumber: Joi.string().regex(/^01[0125]\d{8}$/).required(),
        });
        return schema.validate(formData, { abortEarly: false });
    };
    // function four >>
    async function sendApi() {
        setIsloading(true)
        formData.phoneNumber = `+2${formData.phoneNumber}`
        formData.parentsPhoneNumber = `+2${formData.parentsPhoneNumber}`
        await axios.post(`${baseURL}/auth/signup`, formData)

            .then((response) => {
                console.log("respone ===>", response)
                setIsloading(false)
                if (response.data.message === "Sign up success please confirm email")
                    navigate('/login');
            }).catch((error) => {
                setIsloading(false)
                console.log(error)
                if (error.response.data.message === "Validation Error")
                    toast.error("مشكلة في انشاء الحساب  , اتبع التعليمات ", {
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
    }
    // useeffect 
    useEffect(() => {
        window.scroll(0, 0)
    }, [])
    return (
        <>
            <Helmet>
                <title>Register Page - Sky Online Acadimy</title>
            </Helmet>
            <ToastContainer />
            <div className="container py-5">
                <div className="text-center rounded-4  border-1 widthCustom mx-auto">
                    <Link to={"/"}>
                        <img src={logo} alt="sky academy logo" className="mb-2 w-25" />
                    </Link>
                    <form onSubmit={submitRegisterForm}>
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
                        <div className=" mb-4">
                            <input placeholder="البريد الالكتروني" type="email" className="w-100 p-2" id="email" name="email" value={formData.email} onChange={handleChange} />
                            {error?.map((err, index) =>
                                err.context.label === "email" ? <div key={index}>
                                    {err.type === "string.email" ? <p className="small fw-medium py-2 text-end text-danger"> البريد الإلكتروني غير صحيح</p> : ""}
                                    {!formData.email ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                                </div> : ""
                            )}
                        </div>
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
                        <div className=" mb-4">
                            <select className="w-100 p-2 text-muted" id="grade" name="grade" value={formData.grade} onChange={handleChange} >
                                <option value="">الصف </option>
                                <option value="first">الصف الاول </option>
                                <option value="second">الصف الثاني </option>
                                <option value="third">الصف الثالث </option>
                            </select>
                            {error?.map((err, index) =>
                                err.context.label === "grade" ? <div key={index}>
                                    {!formData.grade ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                                </div> : ""
                            )}
                        </div>

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
                        <div className=" mb-4">
                            <input placeholder="رقم الهاتف" type="text" className="w-100 p-2" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                            {error?.map((err, index) =>
                                err.context.label === "phoneNumber" ? <div key={index}>
                                    {!formData.phoneNumber ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                                </div> : ""
                            )}
                        </div>
                        <div className=" mb-4">
                            <input placeholder="رقم هاتف ولي الامر" type="text" className="w-100 p-2" id="parentsPhoneNumber" name="parentsPhoneNumber" value={formData.parentsPhoneNumber} onChange={handleChange} />
                            {error?.map((err, index) =>
                                err.context.label === "parentsPhoneNumber" ? <div key={index}>
                                    {!formData.parentsPhoneNumber ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                                </div> : ""
                            )}
                        </div>
                        <button type="submit" className={`w-100 my-4 p-2 border-0 rounded-2 ${style.btnOrange} my-3  w-100 `}>{Isloading ? <i className="fa-spin fa fa-spinner"></i> : "انشاء حساب"}</button>
                    </form>
                    <div className="d-flex align-items-center justify-content-center ">
                        <p className="my-2 fs-6 ms-1">
                            لديك حساب بالفعل؟
                        </p>
                        <Link className={` nav-link ${style.textOrange}`} to={'/login'}>سجل الدخول</Link>
                    </div>
                </div>
            </div>
        </>

    );
};