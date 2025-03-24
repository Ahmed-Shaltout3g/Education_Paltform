import { useParams } from "react-router-dom"
import mr from "../../src/Assets/Images/SVG_Images/male-avatar-boy-face-man-user-6-svgrepo-com.svg"
import mrs from "../../src/Assets/Images/SVG_Images/female-avatar-girl-face-woman-user-3-svgrepo-com.svg"
import fakeImage from "../../src/Assets/Images/fakeImage.png"
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { SharedDataContext } from "../Contexts/SharedDataContext";
import moment from "moment";
export default function TeacherDetails() {
    // VARIABLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const {baseURL } = useContext(SharedDataContext);
    const arr  = [1]
    const { id } = useParams();
    const [teacherDetails, setteacherDetails] = useState([]);
    const [Courses, setCourses] = useState([]);
    // FUNCTION GET TEACHER BY ID >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    async function getteacherDetailsById() {
        const { data } = await axios.get(`${baseURL}/auth/teachers?_id=${id}`);
        setteacherDetails(data.data)
    }
    async function getAllCourses() {
        try {
            const { data } = await axios.get(`${baseURL}/course`);
            setCourses(data.data);
        } catch (error) {
            toast.error(" هناك مشكلة  ", {
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
    // USEEFFECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        getteacherDetailsById();
        getAllCourses()
    }, [teacherDetails?.length, Courses?.length])
    useEffect(() => {
        window.scroll(0, 0)
    }, [])
    // RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return <>
        <Helmet>
            <title>Teacher Details - Sky Online Acadimy</title>
        </Helmet>
        <div className="container py-5">
            <ToastContainer />
            <div className="row g-3">
                {teacherDetails?.length > 0 ? teacherDetails.map((item, index) => <div key={index} className="col-sm-12 col-md-6 col-lg-4">
                    <div className="text-center rounded-5 border-1 border border-muted p-5">
                        <img src={item?.profileImage ? item?.profileImage?.secure_url : item.gender === "male" ? mr : mrs} className="w-25  rounded-circle " alt={item.fullName} />
                        <h3 className="mt-4"> {item.fullName} </h3>
                        <p className="text-muted fs-6">
                            روابط التواصل
                        </p>
                        <div >
                            <table className="text-end">
                                <tbody >
                                    <tr>
                                        <td> <i className="fa-brands fa-whatsapp fs-5 mx-2"> </i>: {item.phoneNumber.replace("+2", "")}</td>
                                    </tr>
                                    <tr>
                                        <td> <i className="fa-solid fa-envelope fs-5 mx-2"></i>: {item.email}</td>
                                    </tr>
                                    <tr>
                                        <td> <i className="fa-solid fa-phone fs-5 mx-2"></i>: {item.phoneNumber.replace("+2", "")}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>) : arr.map((index) => <div key={index} className="col-sm-12 col-md-6 col-lg-4">
                    <div className="text-center rounded-5 border-1 border border-muted p-5">
                        <img src={fakeImage} alt="mr image" className="w-50" />
                        <p className=" placeholder col-8  my-4" >  </p>
                        <p className="text-muted fs-6 placeholder col-8">
                        </p>
                        <div className="text-end my-4" >
                            <p className="text-muted fs-6 placeholder col-8">  </p>
                            <p className="text-muted fs-6 placeholder col-8">  </p>
                            <p className="text-muted fs-6 placeholder col-8">  </p>
                        </div>
                    </div>
                </div>)}
                {Courses?.length > 0 ? Courses.filter((item) => item?.teacher?.id === id).map((item, index) => <div key={index} className="col-sm-12 col-md-6 col-lg-4 text-center">
                    <div className='border-1 border border-muted rounded-3'>
                        <img src={item?.photo?.secure_url} className="w-100 " alt={item?.name} />
                        <div className="p-3">
                            <p className="text-muted my-2"> {item?.name}  </p>
                            <p className="text-muted my-2"> {item?.lectures?.length | 0} المحاضرة </p>
                        </div>
                    </div>
                </div>) : arr.map((index) => <div key={index} className="col-sm-12 col-md-6 col-lg-4  mt-5 text-center">
                    <div className='border-1 border border-muted rounded-3'>

                        <img src={fakeImage} alt="teacher image" className='w-100' />

                        <div className="p-3">
                            <p className="text-muted fs-6 placeholder col-8">  </p>
                        </div>
                    </div>
                </div>)}

            </div>

        </div >
    </>
}