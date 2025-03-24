import React, { useState, useEffect, useContext } from 'react';
import "../Styles/index.css"
import logo from "../../src/Assets/Images/logo.png"
import { Link } from 'react-router-dom';
import style from "../../src/Styles/Auth.module.css"
import axios from 'axios';
import Joi from 'joi';
import { ToastContainer, toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { SharedDataContext } from '../Contexts/SharedDataContext';
export default function ResetPassword() {
    // VARIABLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const {  baseURL} = useContext(SharedDataContext);
    const [formData, setFormData] = useState({ email: '' });
    const [resetPassUrl, setresetPassUrl] = useState("");
    const [newPasswordForm, setNewPasswordForm] = useState({ newPassword: '' });
    const [isLoading, setIsloading] = useState(false)
    const [error, setError] = useState([])
    const [error2, setError2] = useState([])
    const [appear, setAppear] = useState(true)
    const [inputType, setInputType] = useState('password');
    const [showPassword, setShowPassword] = useState(false);
    // FUCNTION TOGGEL PASSWORD VISIABILITY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        setInputType(inputType === 'password' ? 'text' : 'password');
    };
    // **************************************************************
    //function HANDLE OBJECT TO RESET PASSWORD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 
    const handleChange = (e) => {
        const _formData = { ...formData };
        _formData[e.target.name] = e.target.value;
        setFormData(_formData);
    };
    //function RESET PASSWORD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const resetPasswordForm = (e) => {
        e.preventDefault();
        const validate = validationForm();
        validate.error ? setError(validate.error.details) : sendApi();
    };
    //function VALIDATION FOR  RESET PASSWORD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const validationForm = () => {
        let schema = Joi.object({ email: Joi.string().email({ tlds: { allow: ["com", "net", "org"] } }) });
        return schema.validate(formData, { abortEarly: false });
    };
    //function FORGET  PASSWORD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    async function sendApi() {
        setIsloading(true)
        await axios.post(`${baseURL}/auth/forget`, formData)
            .then((response) => {
                if (response.data.message === "Please check your email") {
                    setAppear(false)
                    setresetPassUrl(response.data.restPasswordURL);
                }
            }).catch(() => {
                toast.error("هناك مشكلة في الخادم", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })
        setIsloading(false)
    }
    //function HANGLE OBJECT FOR NEW PASSWORD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 
    const handleChangeNewPassword = (e) => {
        const _newPasswordForm = { ...newPasswordForm };
        _newPasswordForm[e.target.name] = e.target.value;
        setNewPasswordForm(_newPasswordForm);
    };
    //function SEND API TO NEW PASSWORD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const sendApiForNewPassword = (e) => {
        setIsloading(true)
        e.preventDefault();
        const validate = validationForm2();
        validate?.error ? setError2(validate.error.details) : sendApi2()
    };
    //function VALIDATION FOR NEW PASSWORD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const validationForm2 = () => {
        let schema = Joi.object({ newPassword: Joi.string().regex(/^[a-zA-Z0-9]{4,}$/) });
        return schema.validate(newPasswordForm, { abortEarly: false });
    };
    //function SEND API FOR NEW PASSWORD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    async function sendApi2() {
        try {
            await axios.post(`${resetPassUrl}`, newPasswordForm)
        } catch (error) {
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
        }
    }
    // useeffect 
    useEffect(() => {
        window.scroll(0, 0)
    }, [])
    //RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    return <>
        <Helmet>
            <title>Reset Password - Sky Online Acadimy</title>
        </Helmet>
        {/* ERRORS */}
        <ToastContainer />
        <div className="container d-flex justify-content-center py-5">
            <div className="rounded-4 border-1 widthCustom text-center ">
                <Link to={'/'}>
                    <img src={logo} alt="sky academy logo" className="mb-2 w-25" />
                </Link>
                {appear ? <form onSubmit={resetPasswordForm}>
                    <div className=" mb-4">
                        <input placeholder="البريد الالكتروني" type="email" className="w-100 p-2" id="email" name="email" value={formData.email} onChange={handleChange} />
                        {error?.map((err, index) =>
                            err.context.label === "email" ? <div key={index}>
                                {err.type === "string.email" ? <p className="small fw-medium py-2 text-end text-danger"> البريد الإلكتروني غير صحيح</p> : ""}
                                {!formData.email ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                            </div> : ""
                        )}
                    </div>
                    <button type="submit" className={`w-100 my-4 p-2 border-0 rounded-2 ${style.btnOrange} w-100`}> {isLoading ? <i className='fa fa-spin fa-spinner'></i> : "ارسل الايميل "}  </button>
                </form> : <form onSubmit={sendApiForNewPassword}>
                    <div className=" mb-4">
                        <div className="position-relative">
                            {inputType !== "password" ?
                                <i onClick={togglePasswordVisibility} className={`fa-solid fa-eye position-absolute  px-4  top-50 translate-middle ${style.eyePostion}`}></i> :
                                <i onClick={togglePasswordVisibility} className={`fa-solid fa-eye-slash position-absolute  px-4  top-50 translate-middle ${style.eyePostion}`}></i>
                            }
                            <input placeholder=" ادخل كلمة المرور الجديدة" type={inputType} className="w-100 p-2" id="newPassword" name="newPassword" value={newPasswordForm.newPassword} onChange={handleChangeNewPassword} />
                        </div>
                        {error2?.map((err, index) =>
                            err.context.label === "email" ? <div key={index}>
                                {err.type === "string.pattern.base" ? <p className="small fw-medium py-2 text-end text-danger">    يجب ان تحتوي كلمة  المرور علي 8 احروف او ارقام</p> : ""}
                                {!newPasswordForm.newPassword ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                            </div> : ""
                        )}
                    </div>
                    <button type="submit" className={`w-100 my-4 p-2 border-0 rounded-2 ${style.btnOrange} w-100`}> {isLoading ? <i className='fa fa-spin fa-spinner'></i> : "تحديث كلمة المرور"}</button>
                </form>}
                <Link to={'/login'} className={`mt-5 nav-link d-flex fitContent rounded-2 mx-auto px-4 bg-light justify-content-center  align-items-center ${style.goBackButton} py-0`}>
                    <span className='  nav-link  fs-6 m-3'>الرجوع للخلف</span>
                    <i className="fa-solid fa-arrow-left fs-6"></i>
                </Link>
            </div>
        </div>
    </>
};

