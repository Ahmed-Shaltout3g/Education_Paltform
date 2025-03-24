import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react"
export let MyCoursesContext = createContext(0)
export default function MyCoursesProvide(props) {
    const [myCourse, setmyCourse] = useState([])
    const [numberOfCourses, setNumberOfCourses] = useState(localStorage.getItem('numberOfCourses'))
    const baseURL = `https://education-platform-vert-two.vercel.app`;
    const [errorFromJoin, setErrorFromJoin] = useState('');
    useEffect(() => {
        localStorage.setItem("numberOfCourses", numberOfCourses)
    }, [numberOfCourses])

    async function getAllcoursesByUser() {
        let user;
        if (Cookies.get('token'))
            user = jwtDecode(Cookies.get('token'))
        try {
            const { data } = await axios.get(`${baseURL}/join/?userId=${user?._id}`);
            console.log(`${baseURL}/join/?userId=${user?._id}`)
            setmyCourse(data.data[0].courses);
            let count = 0;
            for (let i = 0; i < myCourse.length; i++) {
                if (myCourse[i].isPaid && myCourse[i].coursesIds !== null)
                    count++;
            }
            setNumberOfCourses(count);
            localStorage.setItem('numberOfCourses', count)
        } catch (error) {
            setErrorFromJoin(error.message)
        }
    }
    return <MyCoursesContext.Provider value={{ myCourse, getAllcoursesByUser, numberOfCourses, errorFromJoin }}>
        {props.children}
    </MyCoursesContext.Provider>
}