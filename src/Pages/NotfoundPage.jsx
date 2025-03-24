import { Link } from "react-router-dom";
import style from "../../src/Styles/Teacher.module.css"
import { Helmet } from "react-helmet";
export default function NotfoundPage() {

    return <>
        <Helmet>
            <title>404 - Notfound - Sky Online Acadimy</title>
        </Helmet>
        <section className="d-flex justify-content-center vh-100 align-items-center">
            <div className=" text-center">
                <h1>404</h1>
                <h2 className="h1 my-3">صفحة غير موجودة</h2>
                <p className="h5 text-muted my-2">
                    ناسف لك , هذه الصفحة غير متاحة في الموقع
                </p>
                <div className="d-flex justify-content-center">
                    <Link className={` nav-link  fitContent my-2 py-2 px-4 ${style.btnOrange} rounded-2 text-white`} to={'/'}> عودة</Link>
                </div>
            </div>
        </section>
    </>
}