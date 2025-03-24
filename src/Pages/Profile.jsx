import avatar from "../Assets/Images/default-avatar.png";
import Styles from "../Styles/Profile.module.css";
import style from "../../src/Styles/Auth.module.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import fakeImage from "../../src/Assets/Images/fakeImage.png";
import Joi from "joi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function Profile() {
  // VARIABLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const { stage, grade , baseURL} =useContext(SharedDataContext);
  const navagite = useNavigate();
  const [userDetails, setuserDetails] = useState([]);
  const [role, setrole] = useState("");
  const [id, setId] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const formData = new FormData();
  const [image, setImage] = useState(null);
  const [Isloading, setIsloading] = useState(false);
  const validExtensions = ["image/png", "image/jpeg", "image/gif"];
  const [addImageForm, setAddImageForm] = useState(false);
  const [updaetForm, setUpdateForm] = useState(false);
  const [updateObject, setUpdateObject] = useState({ fullName: "", grade: "", stage: "", phoneNumber: "", });
  const [error, setError] = useState([]);
  const [passwordFrom, setPasswordForm] = useState(false);
  const [inputType, setInputType] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [inputType2, setInputType2] = useState("password");
  const [showrePassword, setShowrePassword] = useState(false);
  const [updatePassObject, setUpdatePassObject] = useState({ oldPass: "", newPass: "", });
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // **************************************************************************************
  // FUNCTIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // FUNCITON LOGOUT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  function logOut() {
    Cookies.remove("token");
    navagite("/login");
  }
  // FUNTION GET USER (STUDENT & TEACHER) BY ID >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  async function getAllUserById(role, id) {
    try {
      const { data } = await axios.get(`${baseURL}/auth/teachers?role=${role}&_id=${id}`);
      setuserDetails(data.data);
    } catch (error) {
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
    }
  }
  // USEEFFECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  useEffect(() => {
    let user;
    if (Cookies.get("token")) {
      user = jwtDecode(Cookies.get("token"));
      getAllUserById(user?.role, user._id);
      setId(user._id);
      setrole(user.role);
    }
  }, [userDetails]);
  useEffect(() => {
    window.scroll(0, 0)
  }, [])
  // FUNCTION HANDLE SUBMIT TO ADD AND UPDATE PROFILE IMAGE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const handleSubmit = (e) => {
    setIsSubmit(true);
    e.preventDefault();
    addImage();
  };
  // FUNCTION HANDLE IMAGE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const handleImageChange = (e) => {
    const file = Array.from(e.target.files)[0];
    setImage(file);
  };
  // FUNCTION ADD & UPDATE IMAGE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  async function addImage() {
    setIsloading(true);
    formData.append("image", image);
    try {
      await axios
        .patch(`${baseURL}/auth/profile`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: `online__${Cookies.get("token")}`,
          },
        })
        .then((res) => {
          setIsloading(false);
          if (res.data.message === "Done ") {
            setAddImageForm(false);
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
            Cookies.set("token", res?.data?.refreshToken, { expires: 7 });
          }
        });
    } catch (error) {
      setIsloading(false);
      setAddImageForm(true);
      if (error.response.data.Error === "wrong  token") {
        Cookies.remove("token");
        navagite("/login");
      }
      if (error.response.data.Error === "In-valid extintions ") {
        toast.error("png jpeg gif ادخال الصورة بهذا الامتداد", {
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
  //function HANDLE OBJECT TO UPDATE USER INFO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const handleChange = (e) => {
    const _updateObject = { ...updateObject };
    _updateObject[e.target.name] = e.target.value;
    setUpdateObject(_updateObject);
  };
  // function UPDATE USER INFO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const update = (e) => {
    e.preventDefault();
    setIsSubmit(true)
    const validate = validationForm();
    validate.error ? setError(validate.error.details) : sendApi();
  };
  // function VALIDATION TO UPDATE USER INFO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const validationForm = () => {
    let schema = Joi.object({
      fullName: Joi.string().min(3).max(100),
      grade: Joi.string(),
      stage: Joi.string(),
      phoneNumber: Joi.string().regex(/^\01(0125)[0-9]{8}$/),
    });
    return schema.validate(formData, { abortEarly: false });
  };
  // function SEND DATA TO API FOR UPDATE USER INFO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  async function sendApi() {
    setIsloading(true);
    formData.phoneNumber = `+2${formData.phoneNumber}`;
    await axios.patch(`https://education-platform-vert-two.vercel.app/auth/update?userId=${id}`, updateObject)
      .then((res) => {
        setIsloading(false);
        if (res.data.message === "User updated successfully") {
          setUpdateForm(false);
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
          Cookies.set("token", res?.data?.refreshToken, { expires: 7 });
        }
      })
      .catch((error) => {
        setIsloading(false);
        setUpdateForm(true);
        console.log(error)
        if (error.response.data.Error === "wrong  token") {
          Cookies.remove("token");
          navagite("/login");
        }
      });
  }
  // FUNCTIONS TO SHOW AND HIDE PASSWORD ************************************************
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setInputType(inputType === "password" ? "text" : "password");
  };
  const togglerePasswordVisibility = () => {
    setShowrePassword(!showrePassword);
    setInputType2(inputType2 === "password" ? "text" : "password");
  };
  // ***********************************************************************************
  // FUNCTION TO handle OBJECT PASSWORD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const handlepassForm = (e) => {
    const _updateObject = { ...updatePassObject };
    _updateObject[e.target.name] = e.target.value;
    setUpdatePassObject(_updateObject);
  };
  // function SUBMIT FORM TO UPDATE PASSWORD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const updatePasssword = (e) => {
    e.preventDefault();
    const validate = validationFormPassword();
    validate.error ? setError(validate.error.details) : updateAPI();
  };
  // function VALIDATION FOR UPDATE PASSWORD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const validationFormPassword = () => {
    let schema = Joi.object({
      oldPass: Joi.string()
        .regex(/^[a-zA-Z0-9]{8,}$/)
        .required(),
      newPass: Joi.string()
        .regex(/^[a-zA-Z0-9]{8,}$/)
        .required(),
    });
    return schema.validate(updatePassObject, { abortEarly: false });
  };
  // function UPDATE PASSWORD AND CALL API >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  async function updateAPI() {
    setIsloading(true);
    try {
      await axios.patch(`${baseURL}/auth/changePass`, updatePassObject, {
        headers: {
          token: `online__${Cookies.get("token")}`,
        },
      })
        .then((res) => {
          setIsloading(false);
          if (res.data.message === "Done, please try to login ") {
            setPasswordForm(false);
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
            Cookies.set("token", res?.data?.refreshToken, { expires: 7 });
          }
        });
    } catch (error) {
      setIsloading(false);
      setPasswordForm(true);
      if (error.response.data.Error === "wrong  token") {
        Cookies.remove("token");
        navagite("/login");
      } else {
        toast.error(" هناك مشكلة في التحديث", {
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
  // RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  return <>
    <Helmet>
      <title>profile - Sky Online Acadimy</title>
    </Helmet>
    {/* ERRORS */}
    <ToastContainer />
    {/* ADD & UPDATE imaeg profile */}
    {addImageForm ? (
      <div className="container py-5 px-3">
        <div className="text-center rounded-4  border-1 widthCustom mx-auto ">
          <h3 className="text-end mb-4">اضافة صورة</h3>
          <form encType="multibart/form-data" onSubmit={handleSubmit}>
            <div className=" mb-4">
              <input placeholder=" اضف صورة " type="file" className="w-100 p-2 small" name="image" onChange={handleImageChange} />


              {isSubmit ? <>
                {!image ? <p className="small fw-medium  py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                {image ? !validExtensions.includes(image?.type) ? <p className="small fw-medium  py-2 text-end text-danger">هذا الامتداد غير صحيح</p> : "" : ""}
              </> : ""}
            </div>
            <div className="w-100  d-flex align-items-center">
              <button type="submit" className={`w-50 my-4 p-2 border-0 rounded-2 ${style.btnOrange} `}> {Isloading ? <i className="fa-spin fa fa-spinner"></i> : "اضف"}    </button>
              <span onClick={() => setAddImageForm(false)} className="text-danger me-4">تجاهل  </span>

            </div>
          </form>
        </div>
      </div>
    ) : ("")}
    {/* UPDATE USER INFO */}
    {updaetForm ? (
      <div className="container py-5 px-3">
        <div className=" rounded-4  border-1 widthCustom mx-auto ">
          <h3 className="text-end mb-4"> تعديل الملف الشخصي</h3>
          <form onSubmit={update}>
            <div className=" mb-4">
              <label className="w-100 small text-end" htmlFor="fullName">
                {userDetails[0]?.fullName}
              </label>
              <input placeholder="عدل الاسم " type="text" className="w-100 p-2 small" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
              {error?.map((err, index) =>
                err.context.label === "fullName" ? (
                  <div key={index}>
                    {err.type === "string.min" ? (
                      <p className="small fw-medium py-2 text-end text-danger">  يجب أن لا يقل عدد الحروف عن 3          </p>) : ("")}
                    {err.type === "string.max" ? (
                      <p className="small fw-medium py-2 text-end text-danger">
                        يجب الا يزيد عدد الحروف عن 100 حرف
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
            <div className=" mb-4">
              <label className="w-100 small text-end" htmlFor="grade">
                {stage[userDetails[0]?.grade]}
              </label>
              <select
                className="w-100 p-2 text-muted small"
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
              >
                <option value="">الصف </option>
                <option value="first">الصف الاول </option>
                <option value="second">الصف الثاني </option>
                <option value="third">الصف الثالث </option>
              </select>
            </div>
            <div className=" mb-4">
              <label className="w-100 small text-end" htmlFor="stage">
                {grade[userDetails[0]?.stage]}
              </label>
              <select
                className="w-100 p-2 text-muted small"
                id="stage"
                name="stage"
                value={formData.stage}
                onChange={handleChange}
              >
                <option value="">المرحلة </option>
                <option value="primary">الابتدائية</option>
                <option value="preparatory">الاعدادية </option>
                <option value="secondary">الثانوية </option>
              </select>
            </div>
            <div className=" mb-4">
              <label className="w-100 small text-end" htmlFor="phoneNumber">
                {userDetails[0]?.phoneNumber.replace("+2", "")}
              </label>
              <input
                placeholder="رقم الهاتف"
                type="text"
                className="w-100 p-2 small"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <button type="submit" className={`w-50 my-4 p-2 border-0 rounded-2 ${style.btnOrange}  `}      >
                {Isloading ? <i className="fa-spin fa fa-spinner"></i> : " حفظ"}
              </button>
              <span onClick={() => setUpdateForm(false)} className="text-danger me-4">تجاهل  </span>
            </div>
          </form>
        </div>
      </div>
    ) : ("")}
    {/* UPDATE PASSWORD */}
    {passwordFrom ? (
      <div className="container py-5 px-3">
        <div className="text-center rounded-4  border-1 widthCustom mx-auto ">
          <h3 className="text-end mb-4"> تغيير كلمة المرور</h3>
          <form onSubmit={updatePasssword}>
            <div className=" mb-4 ">
              <div className="position-relative">
                {inputType !== "password" ? (
                  <i
                    onClick={togglePasswordVisibility}
                    className={`fa-solid fa-eye position-absolute  px-4  top-50 translate-middle ${style.eyePostion}`}
                  ></i>
                ) : (
                  <i
                    onClick={togglePasswordVisibility}
                    className={`fa-solid fa-eye-slash position-absolute  px-4  top-50 translate-middle ${style.eyePostion}`}
                  ></i>
                )}
                <input
                  placeholder="    كلمة المرور الحالية"
                  type={inputType}
                  className="w-100 p-2 "
                  id="oldPass"
                  name="oldPass"
                  value={updatePassObject.oldPass}
                  onChange={handlepassForm}
                />
              </div>
              {error?.map((err, index) =>
                err.context.label === "password" ? (
                  <div key={index}>
                    {err.type === "string.pattern.base" ? (
                      <p className="small fw-medium py-2 text-end text-danger">
                        {" "}
                        يجب ان تحتوي كلمة المرور علي 8 احروف او ارقام
                      </p>
                    ) : (
                      ""
                    )}
                    {!updatePassObject.password ? (
                      <p className="small fw-medium py-2 text-end text-danger">
                        لا يمكن ارسال هذا الحقل فارغا
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
            <div className=" mb-4">
              <div className="position-relative">
                {inputType2 !== "password" ? (
                  <i
                    onClick={togglerePasswordVisibility}
                    className={`fa-solid fa-eye position-absolute  px-4  top-50 translate-middle ${style.eyePostion}`}
                  ></i>
                ) : (
                  <i
                    onClick={togglerePasswordVisibility}
                    className={`fa-solid fa-eye-slash position-absolute  px-4  top-50 translate-middle ${style.eyePostion}`}
                  ></i>
                )}
                <input
                  placeholder=" كلمة المرور الجديدة"
                  type={inputType2}
                  className="w-100 p-2"
                  id="newPass"
                  name="newPass"
                  value={updatePassObject.newPass}
                  onChange={handlepassForm}
                />
              </div>
              {error?.map((err, index) =>
                err.context.label === "password" ? (
                  <div key={index}>
                    {err.type === "string.pattern.base" ? (
                      <p className="small fw-medium py-2 text-end text-danger">
                        {" "}
                        يجب ان تحتوي كلمة المرور علي 8 احروف او ارقام
                      </p>
                    ) : (
                      ""
                    )}
                    {!updatePassObject.password ? (
                      <p className="small fw-medium py-2 text-end text-danger">
                        لا يمكن ارسال هذا الحقل فارغا
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
            <div className="w-100 d-flex align-items-center">
              <button
                type="submit"
                className={`w-50 my-4 p-2 border-0 rounded-2 ${style.btnOrange}  `}
              >
                {Isloading ? <i className="fa-spin fa fa-spinner"></i> : " حفظ"}
              </button>
              <span onClick={() => setPasswordForm(false)} className="text-danger me-4">تجاهل  </span>
            </div>
          </form>
        </div>
      </div>
    ) : ("")}
    {/* PROFILE */}
    {!addImageForm && !updaetForm && !passwordFrom ? (
      <div className="container py-5">
        <div className="d-flex align-items-center justify-content-between  ">
          <h3 className="h4">الملف الشخصي </h3>
          <div className="d-flex align-items-center w-50 justify-content-end  text-start">
            <img
              src={
                userDetails[0]?.profileImage?.secure_url
                  ? userDetails[0]?.profileImage.secure_url
                  : avatar
              }
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              className={`${Styles.defaultImg}  rounded-circle mx-2`}
              alt="default image "
            />
            <ul
              className="dropdown-menu p-1 small text-end"
              aria-labelledby="dropdownMenuButton1"
            >
              <li className="p-2">
                <span onClick={() => setUpdateForm(true)} className="w-100">
                  تعديل الملف الشخصي{" "}
                </span>
              </li>
              <li className="p-2">
                <div
                  onClick={logOut}
                  className="dropdown-item d-flex justify-content-between align-items-center"
                >
                  <span>تسجيل الخروج </span>
                  <i className="fa-solid fa-right-from-bracket fs-6 mx-2 "></i>
                </div>
              </li>
            </ul>
          </div>
        </div>
        {Array.isArray(userDetails) && userDetails.length > 0 ? (
          <div className="p-3">
            <div className="row border my-4 border-1 p-2 border-muted  align-items-center">
              <div className="col-2  position-relative">
                <img
                  onClick={() =>
                    userDetails[0]?.profileImage?.secure_url
                      ? ""
                      : setAddImageForm(true)
                  }
                  src={
                    userDetails[0]?.profileImage?.secure_url
                      ? userDetails[0]?.profileImage.secure_url
                      : avatar
                  }
                  className={` w-100 `}
                  alt="default image"
                />
                {userDetails[0]?.profileImage?.secure_url ? (
                  <i
                    onClick={() => {
                      setAddImageForm(true);
                    }}
                    style={{ left: "75%", bottom: "5%" }}
                    className="fa-solid fa-pen position-absolute p-2 rounded-circle bg-white   small "
                  ></i>
                ) : (
                  ""
                )}
              </div>
              <div className="col-10 ">
                <div>
                  <h3 className="h4"> {userDetails[0].fullName}</h3>
                </div>
              </div>
            </div>

            <div className="p-3 border-1 border border-muted">
              <div className="d-flex">
                <i className="fa-solid fa-user fs-5 ms-5"></i>
                <div>
                  <p className="text-muted h5">
                    {" "}
                    {role === "User" ? "اسم الطالب" : "اسم المدرس"}
                  </p>
                  <p>{userDetails[0].fullName}</p>
                </div>
              </div>
            </div>
            {role === "User" ? (
              <div className="p-3 border-1 border border-muted">
                <div className="d-flex">
                  <i className="fa-solid fa-graduation-cap fs-5 ms-5"></i>
                  <div className="">
                    <p className="text-muted h5"> الصف الدراسي</p>
                    <p>
                      {stage[userDetails[0].grade]}{" "}
                      {grade[userDetails[0].stage]}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="p-3 border-1 border border-muted">
              <div className="d-flex">
                <i className="fa-solid fa-envelope fs-5 ms-5"></i>
                <div className="">
                  <p className="text-muted h5"> البريد الإلكتروني </p>
                  <p>{userDetails[0].email} </p>
                </div>
              </div>
            </div>
            <div className="p-3 border-1 border border-muted">
              <div className="d-flex">
                <i className="fa-solid fa-phone fs-5 ms-5"></i>
                <div className="">
                  <p className="text-muted h5">رقم الهاتف </p>
                  <p>{userDetails[0].phoneNumber.replace("+2", "")}</p>
                </div>
              </div>
            </div>
            <div className="p-3 border-1 border border-muted">
              <div className="d-flex">
                <i className="fa-solid fa-lock fs-5 ms-5"></i>
                <div className="">
                  <p className="text-muted h5">تغيير كلمة المرور </p>
                  <p>******************</p>
                  <button
                    onClick={() => setPasswordForm(true)}
                    className={` my-1 p-2 border-0 rounded-2 ${style.btnOrange}   w-100 `}
                  >
                    {Isloading ? (
                      <i className="fa-spin fa fa-spinner"></i>
                    ) : (
                      " تغيير"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3">
            <div className="row border my-4 border-1 p-2 border-muted  align-items-center">
              <div className="col-2 ">
                <img
                  src={fakeImage}
                  className={` w-100 `}
                  alt="loading image"
                />
              </div>
              <div className="col-10 ">
                <div className="text-card-top placeholder-glow">
                  <h3 className="h4 placeholder col-4"> </h3>
                </div>
              </div>
            </div>
            <div className="p-3 border-1 border border-muted text-card-top placeholder-glow">
              <div className="d-flex">
                <i className="fa-solid fa-user fs-5 ms-5"></i>
                <div>
                  <p className="text-muted h5">
                    {role === "User" ? "اسم الطالب" : " اسم المدرس"}{" "}
                  </p>
                  <p className="placeholder col-12 "></p>
                </div>
              </div>
            </div>
            {role === "User" ? (
              <div className="p-3 border-1 border border-muted text-card-top placeholder-glow">
                <div className="d-flex">
                  <i className="fa-solid fa-graduation-cap fs-5 ms-5"></i>
                  <div className="">
                    <p className="text-muted h5"> الصف الدراسي</p>
                    <p className="placeholder col-12 "></p>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="p-3 border-1 border border-muted text-card-top placeholder-glow">
              <div className="d-flex">
                <i className="fa-solid fa-envelope fs-5 ms-5"></i>
                <div className="">
                  <p className="text-muted h5"> البريد الإلكتروني </p>
                  <p className="placeholder col-12 "></p>
                </div>
              </div>
            </div>
            <div className="p-3 border-1 border border-muted text-card-top placeholder-glow">
              <div className="d-flex">
                <i className="fa-solid fa-lock fs-5 ms-5"></i>
                <div className="">
                  <p className="text-muted h5"> تغيير كلمة المرور </p>
                  <p className="placeholder col-12 "></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    ) : ("")}
  </>
}
