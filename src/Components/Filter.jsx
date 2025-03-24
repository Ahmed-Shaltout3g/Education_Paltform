import { useContext, useEffect, useState } from "react";
import style from "../../src/Styles/Filter.module.css"
import axios from "axios";
import { FilterContext } from "../Contexts/FilterContext";
import { SharedDataContext } from "../Contexts/SharedDataContext";
export default function Filter() {
    // VARIABLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const { setWordSearch, setStage, setGrade, setGradeName, setStageName } = useContext(FilterContext)
    const { stage, grade, baseURL } = useContext(SharedDataContext);
    const [isOpenStage, setIsOpenStage] = useState(false);
    const [supCategories, setsupCategories] = useState([]);

    // useEffect >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    useEffect(() => {
        async function getAllSubCategories() {
            const { data } = await axios.get(`${baseURL}/subcategory/`);
            setsupCategories(data.Subcategories)
        }
        getAllSubCategories();
    }, []);
    // RENDER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return <>
        <div>
            <input onChange={(e) => setWordSearch(e.target.value.toLocaleLowerCase())} type="text" className="w-100 p-3 bg-light" placeholder="ابحث عن دورة" />
            <div className="border border-1 border-muted my-3 rounded-2">
                <div onClick={() => setIsOpenStage(!isOpenStage)} className={`d-flex justify-content-between  pt-3 px-3 pb-2  align-items-center ${style.cursorPointer}`}>
                    <p className="text-black small pt-2">الصفوف</p>
                    <i className={`${style.link} fa-solid ${!isOpenStage ? 'fa-angle-down' : 'fa-angle-up'} bg-light p-2 rounded-circle `}></i>
                </div>
                {isOpenStage ? <div>
                    <hr className="text-muted" />
                    {supCategories?.length > 0 ? supCategories.map((item, index) => <div onClick={() => { setStage(item._id); setStageName(stage[item.name]); setGrade(item?.categoryId?._id); setGradeName(grade[item?.categoryId?.name]) }}  key={index} className={`d-flex pt-1 px-3 ${style.item}`}>
                        <i className="fa-solid fa-graduation-cap ms-2 py-1"></i>
                        <p className="text-muted "> {stage[item?.name]} {grade[item?.categoryId?.name]}  </p>
                    </div>) : <div className="text-center p-5"><i className="fa fa-spin fa-spinner"></i></div>}
                </div> : ""}
            </div>
        </div>
    </>
}