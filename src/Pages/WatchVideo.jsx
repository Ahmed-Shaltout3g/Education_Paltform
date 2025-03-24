import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import style from "../../src/Styles/Auth.module.css";
import fakeImage from "../../src/Assets/Images/fakeImage.png";
import { ToastContainer, toast } from 'react-toastify';
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function WatchVideo() {
  // VARIABLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const { stage, grade, baseURL } = useContext(SharedDataContext);
  const [lectures, setlectures] = useState([]);
  const [tasks, settasks] = useState([]);
  const { id } = useParams();
  const decryptVideoURL = (encryptedURL) => {
    const bytes = CryptoJS.AES.decrypt(encryptedURL, "Gl?11£5R8:5z£-%");
    return bytes.toString(CryptoJS.enc.Utf8);
  };
  // FUNCTION GET LECTURE BY ID >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  async function getLectureById() {
    try {
      const { data } = await axios.get(`${baseURL}/lecture?_id=${id}`);
      setlectures(data.data);
    } catch (error) {
      toast.error(" لديك مشكلة في الخادم", {
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
  async function getAssignment() {
    try {
      const { data } = await axios.get(`${baseURL}/assignment?lectureId=${id}`);
      settasks(data.data);
    } catch (error) {
      toast.error(" لديك مشكلة في الخادم", {
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
  // USEEFFECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  useEffect(() => {
    getLectureById();
    getAssignment();
  }, [lectures?.length, tasks?.length]);
  useEffect(() => {
    window.scroll(0, 0)
  }, [])
  return (
    <>
      <Helmet>
        <title>Watch - Sky Online Acadimy</title>
      </Helmet>
      <ToastContainer />
      <div className="container py-5">
        {lectures?.length > 0 ? (
          lectures.map((item, index) => {
            const decryptedURL = decryptVideoURL(item.videoURL);
            return (
              <div key={index}>
                <iframe
                  width="100%"
                  height="400"
                  src={`${decryptedURL}?modestbranding=1&rel=0&showinfo=0&disabledkb=1`}
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
                <div className="my-2">
                  <h2 className="my-3"> {item?.title}</h2>
                  <div className="mt-3 mb-1 fs-5">
                    <span>{item?.courseId.name} -</span>
                    <span>
                      {" "}
                      {stage[item?.subCategoryId?.name]}{" "}
                      {grade[item?.categoryId?.name]}{" "}
                    </span>
                  </div>
                  <p className="fs-5">استاذ/ {item?.teacher?.fullName}</p>
                  <button
                    className={` my-2 py-2 px-4 border-0 rounded-2 ${style.btnOrange}  `}
                  >
                    <Link
                      to={tasks[0]?.pdf?.secure_url}
                      className=" text-white"
                      download={`${tasks[0]?.title}.pdf`}
                    >
                      تحميل الواجب{" "}
                    </Link>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div  >
            <img src={fakeImage} className="w-100 " alt="loading fake image" />
            <div className="my-4">
              <span className="placeholder col-6 "></span>
              <div className="mt-3 mb-1 fs-5">
                <span className="placeholder col-7"></span>
              </div>
              <span className="placeholder col-4 "></span>
              <br />
              <button
                type="submit"
                className={` my-4 px-5 py-2 border-0 rounded-2 ${style.btnOrange}  `}
              >
                <span className="w-100 p-3 text-white "> </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
