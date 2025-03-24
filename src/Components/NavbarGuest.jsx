
import style from "../Styles/Nav.module.css"
import logo from "../../src/Assets/Images/logo.png"
import { Link } from "react-router-dom"
import { useState } from "react"
export default function NavbarGuest() {
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
                        <li className="nav-item">
                            <Link onClick={() => { setIsOpen(false) }} className={`nav-link ${style.btnOrange} text-white mx-1 px-2 rounded-3`} to={'/login'}>تسجيل الدخول</Link>
                        </li>
                        <li className="nav-item">
                            <Link onClick={() => { setIsOpen(false) }} className={`nav-link ${style.btnOutlinOrange}  mx-1 px-2 rounded-3`} to={'/register'}>حساب جديد</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </>
}

