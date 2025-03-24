import logo from "./../../src/Assets/Images/logo.png";
import style from "../../src/Styles/Header.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { WOW } from 'wowjs';
import 'animate.css/animate.min.css';
export default function Header() {
  const [role, setRole] = useState(null)
  useEffect(() => {
    if (Cookies.get('token'))
      setRole(jwtDecode(Cookies.get('token'))?.role)
  }, [Cookies.get('token')])
  useEffect(() => {
    const wow = new WOW({ live: false });
    wow.init();
  }, []);
  return (
    <>
      <header className="w-100 text-center d-flex  justify-content-center align-items-center">
        <div className={`${style.headerContent} my-4`}>
          <div >
            <img src={logo} className="w-25 wow animate__animated animate__bounceIn" alt="sky academy logo" />
            <h1 className="mb-3 ">   سكاي اونلاين اكاديمي </h1>
            <p className={`  w-md-50 mx-auto mb-5 subTitle`}>
              ﺗﻌﻠﻢ ﺑﺄﺣﺪث اﻟﻄﺮق ﻣﻦ ﺧﻠﺎل ﻣﻨﺼﺘﻨﺎ,ﻓإﻧﻨﺎ ﻧﻮﻓﺮ ﻟﻚ اﻟﻌﺪﻳﺪ ﻣﻦ اﻟﻜﻮرﺳﺎت
              <br />
              اﻟﺨﺎﺻﺔ ﺑﺎﻟﻤﺮﺣﻠﺔ الابتدائية و الإعدادية والثانوية, ﺑﺄﺣﺪث ﻃﺮق اﻟﻤﺘﺎﺑﻌﺔ واﻟﺘﻘﻴﻴﻢ.
            </p>
            {role === "User" ? <Link className={`nav-link text-white rounded-2 fitContent mx-auto my-2 text-center py-2 px-4 small ${style.btnOrange}`} to={'/cources'}>تصفح الكورسات </Link>
              : ""}
          </div>
        </div>
      </header>
    </>
  );
}
