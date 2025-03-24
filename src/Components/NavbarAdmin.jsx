import { Link } from "react-router-dom"
import logo from "../../src/Assets/Images/logo.png"
import style from "../../src/Styles/Nav.module.css"
import { useState } from "react"
export default function NavbarAdmin() {
    const [isOpen, setIsOpen] = useState(false)

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
                        <li className="dropdown mx-2 ">
                            <button className="border-0 bg-transparent pt-1 dropdown-toggle fw-bold" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                الفيديوهات
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item text-end" to="/teacherAdmin/allVideos">كل الفيديوهات</Link></li>
                                <li><Link className="dropdown-item text-end" to="/teacherAdmin/addVideo">اضف فيديو</Link></li>
                            </ul>
                        </li>
                        <li className="dropdown mx-2">
                            <button className="border-0 bg-transparent pt-1 dropdown-toggle fw-bold" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                الواجبات
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item text-end" to="/teacherAdmin/addAssign">اضف واجب</Link></li>
                                <li><Link className="dropdown-item text-end" to="/teacherAdmin/AllAssignment">كل الواجبات</Link></li>
                            </ul>
                        </li>
                        <li className="dropdown mx-2 pt-1 " >
                            <Link style={{ color: "black" }} to={"/profile"}>الملف الشخصي</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </>
}