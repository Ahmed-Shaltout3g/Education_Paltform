import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function GetAllCategories() {
  // VARIABLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const { grade, arr, baseURL } = useContext(SharedDataContext);
  const [categories, setcategories] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const navigate = useNavigate();
  // USEEFFECT 
  useEffect(() => {
    async function getAll() {
      const { data } = await axios.get(`${baseURL}/category`);
      setcategories(data.categories);
    }
    getAll();
  }, [categories]);

  // FUNCTION DELETE CATEGORY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  async function deleteItem(id) {
    setIsloading(true)
    try {
      await axios
        .delete(`${baseURL}/category/delete?categoryId=${id}`, {
          headers: {
            token: `online__${Cookies.get("token")}`,
          },
        }).then((res) => {
          setIsloading(false);
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
          } else {
            toast.success('قد تم الحذف  ', {
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
        });
    } catch (error) {
      setIsloading(false);
      if (error?.response?.data?.Error === 'wrong  token') {
        Cookies.remove('token');
        navigate('/login')
      } else {
        toast.error('  يوجد مشكلة في الحذف ', {
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
  // RENGER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  return (
    <>
      <Helmet>
        <title>All Grades - Sky Online Acadimy</title>
      </Helmet>
      <ToastContainer />
      {isLoading ? <div className="text-white position-fixed start-50 top-50  p-4" style={{ transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <i className="fa fa-spin fa-spinner h3"></i>
      </div> : ""}
      <div className="container py-5 overflow-x-auto">
        <table className="table table-striped text-center  table-hover table-bordered">
          <thead>
            <tr>
              <th className="py-3" scope="col">
                #
              </th>
              <th className="py-3" scope="col">
                المرحله
              </th>
              <th className="py-3" scope="col">
                تاريخ الانشاء
              </th>
              <th className="py-3" scope="col">
                المعاملات{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {categories?.length > 0
              ? categories?.map((item, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{grade[item?.name]}</td>
                  <td>{moment(item?.createdAt).format('YYYY/MM/DD')}</td>
                  <td className="d-flex justify-content-center justify-content-center">
                    <button className="btn btn-sm btn-danger ms-2" onClick={() => { deleteItem(item?.id); }} >حذف</button>
                    <div>
                      <Link className="btn btn-primary btn-sm" to={`/admin/updatecategory/${item?.name}/${item?.id}`}>تعديل</Link>
                    </div>
                  </td>
                </tr>
              ))
              : arr.map((index) => (
                <tr key={index}>
                  <th className="placeholder-glow   p-4"></th>
                  <td className="placeholder-glow   p-4"></td>
                  <td className="placeholder-glow   p-4"></td>
                  <td className="placeholder-glow   p-4"></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
