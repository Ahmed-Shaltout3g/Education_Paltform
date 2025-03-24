import { useContext, useState } from "react";
import style from "../../src/Styles/Auth.module.css"
import Cookies from 'js-cookie';
import axios from "axios";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function AddCategory() {
    // VARIABLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const {  baseURL} = useContext(SharedDataContext);
    let navigate = useNavigate()
    const [error, setError] = useState([]);
    const [dataAdded, setdataAdded] = useState({ name: "", });
    const [Isloading, setIsloading] = useState(false);
    // FUNCTIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // FUNCTION HANDLE OBJECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const handleChange = (e) => {
        const { name, value } = e.target;
        setdataAdded({
            ...dataAdded,
            [name]: value,
        });
    };
    // FUNCTION VALIDATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const validationForm = () => {
        let schema = Joi.object({
            name: Joi.string().required(),
        });
        return schema.validate(dataAdded, { abortEarly: false });
    };
    // FUNCTION SUBMIT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const handleSubmit = (e) => {
        e.preventDefault();
        const validate = validationForm();
        validate?.error ? setError(validate?.error?.details) : addItem();
    };
    // FUNCTION ADD CATEGORY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    async function addItem() {
        setIsloading(true)
        try {
            await axios.post(`${baseURL}/category/create`, dataAdded, {
                headers: {
                    "token": `online__${Cookies.get('token')}`
                }
            }).then((res) => {
                setIsloading(false)
                if (res.data.message === "category created successfuly") {
                    navigate('/admin/allCategories')
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
            })
        } catch (error) {
            setIsloading(false)
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
            if (error.response.data.Error === 'wrong  token') {
                Cookies.remove('token');
                navigate('/login')
            }
        }
    }
    // RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return <>
        <Helmet>
            <title>Add Grade - Sky Online Acadimy</title>
        </Helmet>
        <div className="container py-5">
            <ToastContainer />
            <div className="text-center rounded-4  border-1 widthCustom mx-auto">
                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className=" mb-4">
                        <select className="w-100 p-2 text-muted" autoComplete="off" id="name" name="name" value={dataAdded.name} onChange={handleChange}  >
                            <option value="">المرحلة </option>
                            <option value="primary">الابتدائية</option>
                            <option value="preparatory">الاعدادية </option>
                            <option value="secondary">الثانوية </option>
                        </select>
                        {error?.map((err, index) =>
                            err.context.label === "name" ? <div key={index}>
                                {!dataAdded.name ? <p className="small fw-medium py-2 text-end text-danger">لا يمكن ارسال هذا الحقل  فارغا</p> : ""}
                            </div> : ""
                        )}
                    </div>
                    <button type="submit" className={`w-100 p-2 border-0 rounded-2 ${style.btnOrange} my-3  w-100 `}>    {Isloading ? <i className="fa-spin fa fa-spinner"></i> : "اضف"}</button>
                </form>
            </div>
        </div>
    </>
}
