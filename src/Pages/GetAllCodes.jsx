import axios from "axios";
import { useEffect, useState, useRef, useContext } from "react";
import Cookies from "js-cookie";
import style from "../../src/Styles/Auth.module.css";
import { useReactToPrint } from "react-to-print";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function GetAllCodes() {
  // VARIABLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const {  baseURL} = useContext(SharedDataContext);
  const [codes, setcodes] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const printRef = useRef(); // the section you want to print.
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  async function deleteItem(id) {
    setIsloading(true);
    try {
      await axios
        .delete(`${baseURL}/codes/delete?codeId=${id}`, {
          headers: {
            token: `online__${Cookies.get("token")}`,
          },
        }).then((res) => {
          setIsloading(false)
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

        })
    } catch (error) {
      setIsloading(false)
      if (error.response.data.Error === 'wrong  token') {
        Cookies.remove('token');
        navigate('/login')
      } else {
        toast.error('لديك مشكلة في الحذف ', {
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
  async function getAll(page) {
    const { data } = await axios.get(`${baseURL}/codes?page=${page}`);
    if (data && data.paginationInfo) {
      setcodes(data.data);
      setTotalPages(data.paginationInfo.totalPages || 1); // Default to 1 if undefined
    } else {
      setcodes([]);
      setTotalPages(1);
    }
  }
  const handlePrint = useReactToPrint({ content: () => printRef.current, });

  function prePage() {
    setIsloading(true)
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setIsloading(false)
    }
  }
  function nextPage() {
    setIsloading(true)
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setIsloading(false)
    }
  }
  useEffect(() => {
    getAll(currentPage);
    setIsloading(false)
  }, [codes]);

  return (
    <>
      <Helmet>
        <title>Codes - Sky Online Acadimy</title>
      </Helmet>
      <ToastContainer />
      <div className="container py-5">
        {isLoading ? <div className="text-white position-fixed start-50 top-50  p-4" style={{ transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <i className="fa fa-spin fa-spinner h3"></i>
        </div> : ""}
        <div className=" text-start">
          {codes?.length > 0 ? <button onClick={handlePrint} className={` px-4 py-2 border-0 rounded-2 ${style.btnOrange} my-3  `}>طباعة </button> : ""}
        </div>
        <div ref={printRef}>
          {codes?.length > 0 ? codes?.map((item, index) => (
            <div key={index} className=" row  border border-1 border-muted p-2 rounded-2"    >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>{item.codeAssignedToCourse[0].courseId?.name}</h3>
                <div>
                  <button
                    onClick={() => {
                      deleteItem(item._id);
                    }}
                    className={` px-4 text-white  py-2 border-0 rounded-2 bg-danger my-3 mx-2 `}
                  >
                    حذف
                  </button>
                </div>
              </div>
              {item.codes.map((codes, indx) => (
                <div key={indx} className=" col-md-3 col-lg-2 col-sm-4 w-25 text-center border border-1 border-muted p-2    "    >
                  <p>{codes}</p>
                </div>
              ))}
            </div>
          )) :
            <div className="text-center ">
              <h3>لا يوجد اكواد مضافة حتي الان</h3>
            </div>
          }
        </div>
        {/* pagination */}
        {totalPages > 1 ? <div className=' p-2 tet-center d-flex justify-content-center align-items-center'>
          <button onClick={prePage} className='btn btn-primary mx-2' disabled={currentPage === 1} >
            السابق
          </button>
          <div className='mx-2'>
            الصفحة {currentPage}
          </div>
          <button onClick={nextPage} className='btn btn-primary mx-2' disabled={currentPage === totalPages}>
            التالي
          </button>
        </div> : ""}
      </div>
    </>
  );
}
