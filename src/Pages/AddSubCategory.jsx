import { useContext, useEffect, useState } from "react";
import style from "../../src/Styles/Auth.module.css"
import Cookies from 'js-cookie';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function AddSubCategory() {
  // VARIABLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const { grade, baseURL } = useContext(SharedDataContext);
  const [categoryId, setCategoryId] = useState(null)
  const [categories, setcategories] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [dataAdded, setdataAdded] = useState({ name: "" });
  const [Isloading, setIsloading] = useState(false);
  const navigate = useNavigate()
  // USEEFFECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  useEffect(() => {
    async function getAllCategories() {
      const { data } = await axios.get(`${baseURL}/category`);
      setcategories(data.categories);
    }
    getAllCategories(); // Only call this once when the component mounts
  }, []);
  // USEEFFECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // FUNCTION HANDLE OBJECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const handleChange = (e) => {
    const { name, value } = e.target;
    setdataAdded({
      ...dataAdded,
      [name]: value,
    });
  };
  // FUNCTION SUBMIT FORM >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    addItem();
  };
  // FUNCTION ADD SUB CATEGORY >>>>>>>>>>>>>>>>>>>>>>>>>>
  async function addItem() {
    setIsloading(true);
    try {
      await axios.post(`${baseURL}/subcategory/create?categoryId=${categoryId}`, dataAdded, {
        headers: {
          "token": `online__${Cookies.get('token')}`
        }
      }).then((res) => {
        setIsloading(false)
        if (res.data.message === "sub-category created successfuly")
          navigate('/admin/allSubCategories')
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
      if (error?.response?.data?.Error === "subCategory name is duplicated! please enter Another name") {
        toast.error("هذا الصف  مضاف بالفعل", {
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
  return <>
    <Helmet>
      <title>Add Stage - Sky Online Acadimy</title>
    </Helmet>
    <div className="container py-5">
      <ToastContainer />
      <div className="text-center rounded-4  border-1 widthCustom mx-auto">
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className=" mb-4">
            <select className="w-100 p-2 text-muted" autoComplete="off" name="name" value={dataAdded.name} onChange={handleChange}  >
              <option value="">الصف الدراسي </option>
              <option value="first">الصف الاول</option>
              <option value="second">الصف الثاني </option>
              <option value="third">الصف الثالث </option>
              <option value="fourth">الصف الرابع </option>
              <option value="fifth">الصف الخامس </option>
              <option value="sixth">الصف السادس </option>
            </select>
            {isSubmit ? dataAdded.name === "" ? <p className="small fw-medium  py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : "" : ""}
          </div>
          <div className="my-4">
            <select className="w-100 p-2 text-muted" autoComplete="off" onChange={(e) => setCategoryId(e.target.value)}  >
              <option value="">  المرحلة الدراسية </option>
              {categories?.length > 0 ? categories.map((category, index) => <option key={index} value={category.id}>{grade[category.name]}</option>) : <option className=" p-5 ">انتظر التحميل...</option>}
            </select>
            {isSubmit ? !categoryId ? <p className="small fw-medium  py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : "" : ""}
          </div>
          <button type="submit" className={`w-100 p-2 border-0 rounded-2 ${style.btnOrange} my-3  w-100 `}>    {Isloading ? <i className="fa fa-spin fa-spinner"></i> : "اضف"}</button>
        </form>
      </div>
    </div>
  </>
}
