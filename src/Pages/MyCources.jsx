import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { MyCoursesContext } from '../Contexts/MyCoursesContext';
import fakeImage from "../../src/Assets/Images/fakeImage.png"
import { Helmet } from 'react-helmet';
import { SharedDataContext } from '../Contexts/SharedDataContext';
export default function MyCources() {
    const {  arr } = useContext(SharedDataContext);
    const { myCourse, getAllcoursesByUser, errorFromJoin, numberOfCourses } = useContext(MyCoursesContext)
    useEffect(() => {
        getAllcoursesByUser()
        localStorage.setItem('numberOfCourses', numberOfCourses)
    }, [myCourse?.length])
    
    return <>
        <Helmet>
            <title>My Courses - Sky Online Acadimy</title>
        </Helmet>
        <section className="py-5 container ">
            {numberOfCourses === 0 && <p className='py-4'>لا يوجد كورسات مضافة حتي الان</p>}
            <div className="row g-3 ">
                {errorFromJoin ? <p className='py-2 text-danger'>لديك مشكلة</p> : ""}
                {myCourse?.length > 0 ? myCourse?.filter(course => course?.isPaid && course?.coursesIds !== null).map((course, index) => course.coursesIds === null ? "" : <div key={index} className="col-6 col-sm-6 col-md-4 col-lg-3">
                    <div className='border-1 border border-muted rounded-3'>
                        <Link to={`/lectures/${course.coursesIds.id}`}>
                            <div >
                                <img src={course?.coursesIds?.photo?.secure_url} alt={course?.coursesIds?.name} className='w-100' />
                            </div>
                        </Link>
                        <div className='my-3'>
                            <p className='px-4 text-mutedm h4'>{course?.coursesIds?.name}</p>
                            <p className='px-4 text-muted '>{course?.coursesIds?.teacher.fullName}</p>
                        </div>
                    </div>
                </div>) : arr.map((item, index) => <div key={index} className="col-6 col-sm-6 col-md-4 col-lg-3">
                    <div className="card" aria-hidden="true">
                        <img src={fakeImage} className="card-img-top w-100" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title placeholder-glow">
                                <span className="placeholder col-6"></span>
                            </h5>
                            <p className="card-text placeholder-glow">
                                <span className="placeholder col-7"></span>
                                <span className="placeholder col-4"></span>
                            </p>
                        </div>
                    </div>
                </div>)}
            </div>
        </section>
    </>
}