import { Link, useNavigate, useParams } from "react-router-dom";
import style from "../../src/Styles/CourseDetails.module.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import fakeImage from "../../src/Assets/Images/fakeImage.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function CourceDetails() {
  // VARIABLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const { stage, grade, baseURL } = useContext(SharedDataContext);
  let navigate = useNavigate();
  const [course, setCourse] = useState([]);
  const { id } = useParams();
  const [errorForm, seterrorForm] = useState("");
  const [dataAdded, setDataAdded] = useState({ code: "" });
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  // USEEFFECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  useEffect(() => {
    async function getCourseById() {
      const { data } = await axios.get(`${baseURL}/course?_id=${id}`);
      setCourse(data.data);
    }
    getCourseById();
  }, [course?.length]);
  // FUCNTION JOIN COURSE  >>>>>>>>>>>>>>>>>>>>>>>>>>>>
  async function joinCourse(e) {
    e.preventDefault();
    setIsloading(true);
    setIsSubmit(true);
    try {
      await axios
        .post(`${baseURL}/join/joincourse?courseId=${id}`, dataAdded, {
          headers: {
            token: `online__${Cookies.get("token")}`,
          },
        })
        .then((res) => {
          if (res.data.message === "Done") navigate("/mycources");
        });
    } catch (error) {
      console.log(error);
      setIsloading(false);
      seterrorForm(error.message);
      if (error.response.data.Error === "Invalid or expired code") {
        toast.error(" الكود غير صحيح  ", {
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
  // FUNCTION HANDLE OBJECT >>>>>>>>>>>>>>>>>>>>>>>>>
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataAdded({
      ...dataAdded,
      [name]: value,
    });
  };
  // RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  return (
    <>
      <Helmet>
        <title>Course Details - Sky Online Acadimy</title>
      </Helmet>
      <section className="container py-5 ">
        <ToastContainer />
        <div className="row ">

          {course?.length > 0 ? (
            <>
              <div className="col-sm-12 col-md-4 ">
                <div>
                  <img
                    src={course[0].photo.secure_url}
                    alt={course[0]?.name}
                    className="w-100 rounded-3"
                  />
                </div>
              </div>
              <div className="col-sm-12  col-md-8 ">
                <div>
                  <h3 className=" mb-3"> {course[0]?.name} </h3>
                  <div className="d-flex align-items-start mt-2">
                    <i className="fa-solid fa-play ms-1 pt-1 text-danger "></i>
                    <p className="text-muted ">
                      {course[0]?.lectures?.length} محاضرات
                    </p>
                  </div>
                  <div className="d-flex">
                    <p className="bg-light fitContent p-2 ms-3">
                      {" "}
                      {stage[course[0].subCategoryId?.name]}{" "}
                      {grade[course[0].categoryId?.name]}{" "}
                    </p>
                  </div>
                  <Link
                    to={"/teacher"}
                    className="bg-light fitContent p-2 nav-link "
                  >
                    {" "}
                    {course[0].teacher.fullName}{" "}
                  </Link>
                  {openForm ? (
                    <div className=" py-2">
                      <div className="text-center rounded-4  border-1 d-flex justify-content-start">
                        <form encType="multipart/form-data" onSubmit={joinCourse}>
                          <div className=" my-4 ">
                            <input
                              className="p-2  w-100"
                              type="text"
                              placeholder="ادخل كود الانضمام"
                              name="code"
                              value={dataAdded.code}
                              onChange={handleChange}
                            />
                            {isSubmit ? (
                              !dataAdded.code ? (
                                <p className="small fw-medium py-2 text-end text-danger">
                                  لا يمكن ارسال هذا الحقل فارغا
                                </p>
                              ) : (
                                ""
                              )
                            ) : (
                              ""
                            )}
                          </div>
                          <button
                            className={` text-white py-2 px-3 small border-0 rounded-2 ${style.btnOrange} my-2 btn-sm   `}
                          >
                            {" "}
                            {isLoading ? (
                              <i className="fa-spin fa fa-spinner"></i>
                            ) : (
                              "انضمام"
                            )}
                          </button>
                          {errorForm ? (
                            <p className="text-danger my-4 text-center small">
                              لديك مشكلة في الانضمام
                            </p>
                          ) : (
                            ""
                          )}
                        </form>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setOpenForm(true)}
                      className={`my-4 border-0  py-2 px-5 text-white ${style.btnOrange} rounded-3`}
                    >
                      انضم الان
                    </button>
                  )}
                </div>
              </div>
            </>

          ) : (
            <>
              <div className="col-sm-12 col-md-4">
                <div>
                  <img
                    src={fakeImage}
                    alt="loading image"
                    className="w-100 rounded-3"
                  />
                </div>
              </div>
              <div className="col-sm-12 col-md-8 p-3 ">
                <div className="text-card-top placeholder-glow">
                  <h3 className=" mb-3 placeholder col-6"> </h3>
                  <div className="d-flex align-items-start mt-2">
                    <p className="text-muted placeholder col-3"></p>
                  </div>
                  <h3 className=" mb-3 placeholder col-4"> </h3>
                  <h3 className=" mb-3 placeholder col-3"> </h3>
                  <div className="w-100">
                    <button
                      className={`${style.btnOrange} py-4 my-4 px-5 rounded-3 border-0   col-2`}
                    ></button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
