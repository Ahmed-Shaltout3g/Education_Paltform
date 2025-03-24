import axios from "axios";
import Joi from "joi";
import React, { useContext } from "react";
import Cookies from "js-cookie";
import { useState } from "react";
import style from "../../src/Styles/Auth.module.css"
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function UpdatedSubCategory() {
  const { stage, baseURL } = useContext(SharedDataContext);
  const { name, id } = useParams()
  let navagite = useNavigate()
  const [Isloading, setIsloading] = useState(false);
  const [error, setError] = useState([]);
  const [updateSubCategory, setupdateSubCategory] = useState({ name: "" });
  // FUNCTION UPDATE SUBCATEGORY
  async function updateItem() {
    setIsloading(true)
    const validate = validationForm();
    if (validate.error) {
      setError(validate.error.details);
      setIsloading(false)
    }
    try {
      await axios
        .put(`${baseURL}/subcategory/update?subCategoryId=${id}`, updateSubCategory, {
          headers: {
            token: `online__${Cookies.get("token")}`,
          },
        })
        .then((res) => {
          setIsloading(false)
          if (res.status === 200) {
            navagite('/admin/allSubCategories')
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
      setIsloading(false)
      if (error?.response?.data?.Error === "new name is dublicated please enter anothe name ") {
        toast.error(" هذا الصف موجود بالفعل", {
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

      if (error.response.data.Error === 'wrong  token') {
        Cookies.remove('token');
        navagite('/login')
      }
    }
  }
  // FUNCTION HANDLE OBJECT >>>>>>>>>>>>>>>>>>>>>>>>>>>
  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setupdateSubCategory({ name: selectedValue });
  };
  // FUNCTION VALIDATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const validationForm = () => {
    let schema = Joi.object({
      name: Joi.string().required(),
    });
    return schema.validate(updateSubCategory, { abortEarly: false });
  };
  // FUNCTION HANDLE OBJECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const handleSubmit = (e) => {
    e.preventDefault();
    const validate = validationForm();
    if (validate.error) {
      setError(validate.error.details)
    } else {
      updateItem()
    }
  };

  // render 
  return <>
    <Helmet>
      <title>Update Stage - Sky Online Acadimy</title>
    </Helmet>
    <div className="container py-5">
      <ToastContainer />
      <div className=" rounded-4  border-1 widthCustom mx-auto">
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className=" mb-4">
            <label htmlFor="name" >{stage[name]}</label>
            <select className="w-100 p-2 text-muted" id="name" name="name" value={updateSubCategory.name ? updateSubCategory.name : ""} onChange={handleChange}  >
              <option value="">الصف الدراسي </option>
              {name !== "first" ? <option value="first">الصف الاول</option> : ''}
              {name !== "second" ? <option value="second">الصف الثاني</option> : ''}
              {name !== "third" ? <option value="third">الصف الثالث</option> : ''}
              {name !== "fourth" ? <option value="fourth">الصف الرابع</option> : ''}
              {name !== "fifth" ? <option value="fifth">الصف الخامس</option> : ''}
              {name !== "sixth" ? <option value="sixth">الصف السادس</option> : ''}
            </select>
            {error?.map((err, index) =>
              err.context.label === "name" ? <div key={index}>
                {!updateSubCategory.name ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
              </div> : ""
            )}
          </div>
          <button type="submit" className={`w-100 p-2 border-0 rounded-2 ${style.btnOrange} my-3  w-100 `}>    {Isloading ? <i className="fa fa-spin fa-spinner"></i> : "حفظ"}</button>
        </form>
      </div>
    </div>
  </>;
}
