import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/index.css";
import style from "../../src/Styles/Auth.module.css";
import logo from "../../src/Assets/Images/logo.png";
import axios from "axios";
import Joi from "joi";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function LoginPage() {
  //Variables here >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..
  const {  baseURL} = useContext(SharedDataContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState([]);
  const [Isloading, setIsloading] = useState(false);
  const [inputType, setInputType] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setInputType(inputType === 'password' ? 'text' : 'password');
  };
  // Function here >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..
  //function one >>
  const handleChange = (e) => {
    const _formData = { ...formData };
    _formData[e.target.name] = e.target.value;
    setFormData(_formData);
  };
  // function two >>
  const submitLoginForm = (e) => {
    e.preventDefault();
    const validate = validationForm();
    validate.error ? setError(validate.error.details) : sendApi();
  };
  // function three >>
  const validationForm = () => {
    let schema = Joi.object({ email: Joi.string().email({ tlds: { allow: ["com", "net", "org"] } }).required(), password: Joi.string().regex(/^[a-zA-Z0-9]{8,}$/) });
    return schema.validate(formData, { abortEarly: false });
  };
  // function four >>
  async function sendApi() {
    setIsloading(true);
    try {
      const response = await axios.post(`${baseURL}/auth/signin`, formData);
      if (response.data.message === "login success") {
        setIsloading(false);
        const { token } = response.data;
        Cookies.set('token', token, { expires: 7 });
        const decodedToken = jwtDecode(token);
        const { role } = decodedToken;
        if (token) {
          switch (role) {
            case 'Teacher':
              navigate('/teacherAdmin');
              break;
            case 'Admin':
              navigate('/admin');
              break;
            default:
              navigate('/cources');
          }
        }
      }
    } catch (error) {
      setIsloading(false);
      if (error.response.data.message === "Validation Error")
        toast.error("مشكلة في تسجيل الدخول , اتبع التعليمات ", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      if (error.response.data.Error === "In-valid email or password")
        toast.error("البريد الالكتروني او كلمة المرور غير صحيحة , اعد المحاولة", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
    } finally {
      setIsloading(false);
    }
  }
  // useeffect 
  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Login Page - Sky Online Acadimy</title>
      </Helmet>
      <ToastContainer />
      <div className="d-flex  justify-content-center  container  py-5">
        <div className="rounded-4  border-1  widthCustom text-center">
          <Link to={"/"}>
            <img src={logo} alt="sky academy logo" className="mb-2 w-25" />
          </Link>
          <form onSubmit={submitLoginForm}>
            <div className=" mb-4">
              <input placeholder="البريد الالكتروني" type="email" className="w-100 p-2" id="email" name="email" value={formData.email} onChange={handleChange} />
              {error?.map((err, index) =>
                err.context.label === "email" ? <div key={index}>
                  {err.type === "string.email" ? <p className="small fw-medium py-2 text-end text-danger"> البريد الإلكتروني غير صحيح</p> : ""}
                  {!formData.email ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                </div> : ""
              )}
            </div>
            <div className=" mb-4">

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
            <div className="d-flex justify-content-between my-3">
              <div className="form-check mb-3 ">
                <input
                  className=" border"
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label text-muted me-1"
                  htmlFor="rememberMe"
                >
                  تذكرني
                </label>
              </div>
              <Link className="nav-link text-muted" to={"/reset-password"}>
                نسيت كلمة المرور؟
              </Link>
            </div>
            <button type="submit" className={`w-100 p-2 border-0 rounded-2 ${style.btnOrange} w-100`}>{Isloading == true ? <i className="fa-solid fa-spinner fa-spin"></i> : "تسجيل الدخول"}</button>
          </form>
          <div className="d-flex align-items-center mt-3 justify-content-center">
            <p className="my-2 fs-6 me-1 ms-1">ليس لديك حساب؟ </p>
            <Link className={`nav-link ${style.textOrange} `} to={"/register"}>حساب جديد</Link>
          </div>
        </div>
      </div>
    </>

  );
}
