import Cookies from "js-cookie";
import logo from "../../src/Assets/Images/logo.png"
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
export default function Footer() {
    return (
        <footer className="text-center text-lg-start bg-body-tertiary text-muted container">
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
                <div className="me-5 d-none d-lg-block">
                    <span>تواصل معنا عبر شبكات التواصل الاجتماعي:</span>
                </div>
                <div>
                    <Link title="Go to facebook" to={'https://www.facebook.com/'} className="me-4 text-reset">
                        <i className="fab fa-facebook-f"></i>
                    </Link>
                    <Link title="Go to x" to={'https://www.x.com/'} className="me-4 text-reset">
                        <i className="fab fa-twitter"></i>
                    </Link>
                    <Link title="Go to google" to={'https://www.google.com/'} className="me-4 text-reset">
                        <i className="fab fa-google"></i>
                    </Link>
                    <Link title="Go to instgram" to={'https://www.instgram.com/'} className="me-4 text-reset">
                        <i className="fab fa-instagram"></i>
                    </Link>
                    <Link title="Go to linkedin" to={'https://www.linkedin.com/'} className="me-4 text-reset">
                        <i className="fab fa-linkedin"></i>
                    </Link>
                    <Link title="Go to github" to={'https://www.github.com/'} className="me-4 text-reset">
                        <i className="fab fa-github"></i>
                    </Link>
                </div>
            </section>
            <section className="">
                <div className=" text-center text-md-start mt-5">
                    <div className="row mt-3">
                        <div className="col-md-3 col-lg-5 col-xl-3 mx-auto mb-4 text-center">
                            <img src={logo} alt="sky academy online" className=" w-25" />
                            <p>
                                ﺗﻌﻠﻢ ﺑﺄﺣﺪث اﻟﻄﺮق ﻣﻦ ﺧﻠﺎل ﻣﻨﺼﺘﻨﺎ,ﻓإﻧﻨﺎ ﻧﻮﻓﺮ ﻟﻚ اﻟﻌﺪﻳﺪ ﻣﻦ اﻟﻜﻮرﺳﺎت اﻟﺨﺎﺻﺔ ﺑﺎﻟﻤﺮﺣﻠﺔ الابتدائية و الإعدادية والثانوية, ﺑﺄﺣﺪث ﻃﺮق اﻟﻤﺘﺎﺑﻌﺔ واﻟﺘﻘﻴﻴﻢ.</p>
                        </div>
                        {Cookies.get('token') ? jwtDecode(Cookies.get('token'))?.role === "User" ? <div className="col-md-3 col-lg-3 col-xl-2 mx-auto mb-2">
                            <h3 className="text-uppercase fw-bold h5">
                                روابط مفيدة
                            </h3>
                            <ul className="navbar-nav me-auto mb-1 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link small   active" aria-current="page" to="/cources">  الدورات التعليمية</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link small " to={'/mycources'}> دوراتي </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link small " to={'/teachers'}> المعلمين </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link small " to={'/profile'}> الملف الشخصي</Link>
                                </li>
                            </ul>
                        </div> : '' : ""}
                        <div className="col-md-4 col-lg-4 col-xl-3 mx-auto mb-md-0 mb-4">
                            <h3 className="text-uppercase fw-bold mb-3 h5 ">تواصل معنا</h3>
                            <p><i className="fas fa-home me-3"></i> ابو يوسف العجمي</p>
                            <p>
                                <i className="fas fa-envelope me-4"></i>
                                info@example.com
                            </p>
                            <p><i className="fas fa-phone me-3"></i> + 01 234 567 88</p>
                            <p><i className="fas fa-print me-3"></i> + 01 234 567 89</p>
                        </div>
                    </div>
                </div>
            </section>
            <div className="text-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
                developed by 3A
            </div>
        </footer>
    );
};

