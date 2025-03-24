import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { SharedDataContext } from "../Contexts/SharedDataContext";

export default function Explore() {
    const { stage, grade, baseURL, arr } = useContext(SharedDataContext);
    const [subcategories, setsubcategories] = useState([]);
    useEffect(() => {
        async function getAll() {
            const { data } = await axios.get(`${baseURL}/subcategory`);
            setsubcategories(data.Subcategories);
        }
        getAll();
    }, [subcategories?.length])
    return <>
        <section className="my-5 py-5 text-center">
            <div className="container">
                <h3 className="mb-4 title">
                    اﺳﺘﻜﺸﻒ ﻣﻮاد اﻟﺼﻔﻮف اﻟﺘﻌﻠﻴﻤﻴﺔ اﻟﻤﻮﺟﻮدة ﺑﺎﻟﻤﻨﺼﺔ{" "}
                </h3>
                <p className="mb-5 subTitle fw-light ">
                    ﺗﻌﻠﻢ ﺑﺄﺣﺪث اﻟﻄﺮق ﻣﻦ ﺧﻠﺎل ﻣﻨﺼﺘﻨﺎ,ﻓﺄﻧﻨﺎ ﻧﻮﻓﺮ ﻟﻚ اﻟﻌﺪﻳﺪ ﻣﻦ اﻟﻜﻮرﺳﺎت
                    <br />
                    اﻟﺨﺎﺻﺔ ﺑﺎﻟﻤﺮﺣﻠﺔ اﻟﺜﺎﻧﻮﻳﺔ  , ﺑﺄﺣﺪث ﻃﺮق اﻟﻤﺘﺎﺑﻌﺔ واﻟﺘﻘﻴﻴﻢ.
                </p>
                <div className="row g-2 py-4">
                    {subcategories?.length > 0 ? subcategories.map((item, index) => (<div key={index} className="col-md-4 wow animate__animated animate__bounceI">
                        <div className=" border border-1 border-muted  p-3 rounded-2">
                            <h4 className="small">{stage[item.name]} {grade[item.categoryId?.name]} </h4>
                        </div>
                    </div>)) : arr.map((item, index) => (<div key={index} className="col-md-4 wow animate__animated animate__bounceI">
                        <div className="card-text placeholder-glow  border border-1 border-muted  p-3 rounded-2">
                            <h4 className="placeholder col-7  p-2"> </h4>
                        </div>
                    </div>))}
                </div>
            </div>
        </section>
    </>
}