import axios from "axios";
import React, { useContext } from "react";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import style from "../../src/Styles/Auth.module.css"
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function UpdatedCategory() {
  // VARIABLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const { grade, baseURL } = useContext(SharedDataContext);
  const { id, name } = useParams()
  const navagite = useNavigate()
  const [Isloading, setIsloading] = useState(false);
  const [updateCategory, setupdateCategory] = useState({ name: "" });
  const [isSubmit, setIsSubmit] = useState(false);
  // FUNCTION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // FUNCTION UPDATE CATEGORY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  async function updateItem() {
    setIsloading(true);
    try {
      await axios
        .put(`${baseURL}/category/update?categoryId=${id}`, updateCategory, {
          headers: {
            token: `online__${Cookies.get("token")}`,
          },
        })
        .then((res) => {
          setIsloading(false);
          if (res.status === 200) {
            navagite('/admin/allCategories')
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
      if (error?.response?.data?.Error === 'wrong  token') {
        Cookies.remove('token');
        navagite('/login')
      }
      if (error?.response?.data?.Error === "category name is duplicated")
        toast.error("    هذه المرحلة مضافة بالفعل ", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      if (error?.response?.data?.Error === "new name same old name please enter anothe name ") {
        toast.error(" يجب ان تقوم بتعديل المرحلة الي مرحلة جديدة", {
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
  // FUNCTION HANDLE OBJECT >>>>>>>>>>>>>>>>>>>
  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setupdateCategory({ name: selectedValue });
  };
  // FUNCTION SUBMIT FORM >>>>>>>>>>>>>>>>>>>>>>>>>>>
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    updateItem();
  };
  // useeffect 
  useEffect(() => {
    window.scroll(0, 0)
  }, [])
  // RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  return <>
    <Helmet>
      <title>Update Grade - Sky Online Acadimy</title>
    </Helmet>
    <div className="container py-5">
      <ToastContainer />
      <div className=" rounded-4  border-1 widthCustom mx-auto">
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className=" mb-4">
            <label htmlFor="name" >{grade[name]}</label>
            <select className="w-100 p-2 text-muted my-2" id="name" name="name" value={updateCategory.name ? updateCategory.name : ''} onChange={handleChange}  >
              <option value="">المرحلة</option>
              {name !== "primary" ? <option value="primary">الابتدائية</option> : ''}
              {name !== "preparatory" ? <option value="preparatory">الاعدادية</option> : ''}
              {name !== "secondary" ? <option value="secondary">الثانوية</option> : ''}
            </select>
            {isSubmit ? updateCategory.name === "" ? <p className="small fw-medium  py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : "" : ""}
          </div>
          <button type="submit" className={`w-100 p-2 border-0 rounded-2 ${style.btnOrange} my-3  w-100 `}>    {Isloading ? <i className="fa-spin fa fa-spinner"></i> : "حفظ"}</button>
        </form>
      </div>
    </div>
  </>;
}
