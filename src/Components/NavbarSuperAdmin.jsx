import { Link, useNavigate } from "react-router-dom"
import logo from "../../src/Assets/Images/logo.png"
import style from "../../src/Styles/Nav.module.css"
import { useState } from "react"
import Cookies from "js-cookie"
export default function NavbarSuperAdmin() {
    const [isOpen, setIsOpen] = useState(false)
    let navigate = useNavigate();
    function logOut() {
        Cookies.remove('token');
        navigate('/login')
    }
    return <>
        <nav className="navbar navbar-expand-lg  navbar-light  py-2 bg-white">
            <div className="container">
                <Link className={`navbar-brand   ${style.widthLogo}`} to={'/'}>
                    <img src={logo} alt="sky academy logo" className={`w-100`} />
                </Link>
                <button onClick={() => setIsOpen(!isOpen)} className={`bg-transparent border-0 text-black ${style.menu}`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="dropdown mx-2">
                            <button className="border-0 bg-transparent pt-1 dropdown-toggle fw-bold" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                المدرسين
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item text-end" to="/admin/allTeachers">كل المعلميين</Link></li>
                                <li><Link className="dropdown-item text-end" to="/admin/addTeacher">اضف مدرس</Link></li>
                            </ul>
                        </li>
                        <li className="dropdown mx-2">
                            <button className="border-0 bg-transparent pt-1 dropdown-toggle fw-bold" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                المراحل
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item text-end" to="/admin/allCategories">كل المراحل</Link></li>
                                <li><Link className="dropdown-item text-end" to="/admin/addCategory">اضف مرحلة</Link></li>
                            </ul>
                        </li>
                        <li className="dropdown mx-2">
                            <button className="border-0 bg-transparent pt-1 dropdown-toggle fw-bold" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                الصفوف
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item text-end" to="/admin/allSubCategories">كل الصفوف</Link></li>
                                <li><Link className="dropdown-item text-end" to="/admin/addSubCategory">اضف صف</Link></li>
                            </ul>
                        </li>
                        <li className="dropdown mx-2">
                            <button className="border-0 bg-transparent pt-1 dropdown-toggle fw-bold" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                الكورسات
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item text-end" to="/admin/allCources">كل الكورسات</Link></li>
                                <li><Link className="dropdown-item text-end" to="/admin/addCourse">اضف كورس</Link></li>
                            </ul>
                        </li>
                        <li className="dropdown mx-2">
                            <button className="border-0 bg-transparent pt-1 dropdown-toggle fw-bold" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                الاكواد
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item text-end" to="/admin/allCodes">كل الاكواد</Link></li>
                                <li><Link className="dropdown-item text-end" to="/admin/generateCode">انشاء اكواد </Link></li>
                            </ul>
                        </li>
                        <li className="dropdown mx-2 pt-1">
                            <span onClick={logOut}>خروج</span>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </>
}