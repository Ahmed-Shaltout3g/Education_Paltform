import feature1 from "./../../src/Assets/Images/feature-1.a3c9fc1.svg";
import feature2 from "./../../src/Assets/Images/feature-2.3cb2b9c.svg";
import feature3 from "./../../src/Assets/Images/feature-3.89f5be4.svg";
import feature4 from "./../../src/Assets/Images/feature-4.200709f.svg";
import feature5 from "./../../src/Assets/Images/feature-5.173caa5.svg";
import feature6 from "./../../src/Assets/Images/feature-6.d23de85.svg";
import { WOW } from 'wowjs';
import style from "../../src/Styles/Header.module.css";
import 'animate.css/animate.min.css';
import { useEffect } from "react";
export default function WhyChooseUs() {
    useEffect(() => {
        const wow = new WOW({ live: false });
        wow.init();
    }, []);
    return <>
        <section className="text-center my-5 py-5">
            <div className="container">
                <h3 className="mb-3 title">ﺗﻤﺘﻊ ﺑﺄﻓﻀﻞ اﻟﻄﺮق اﻟﺘﻌﻠﻴﻤﻴﺔ ﻣﻦ ﺧﻠﺎل اﻟﻤﻨﺼﺔ</h3>
                <p className=" mb-5 mt-4 subTitle fw-light">
                    ﺗﻌﻠﻢ ﺑﺄﺣﺪث اﻟﻄﺮق ﻣﻦ ﺧﻠﺎل ﻣﻨﺼﺘﻨﺎ,ﻓﺄﻧﻨﺎ ﻧﻮﻓﺮ ﻟﻚ اﻟﻌﺪﻳﺪ ﻣﻦ اﻟﻜﻮرﺳﺎت
                    <br />
                    اﻟﺨﺎﺻﺔ بجميع المراحل  , ﺑﺄﺣﺪث ﻃﺮق اﻟﻤﺘﺎﺑﻌﺔ واﻟﺘﻘﻴﻴﻢ.
                </p>
                <div className="row g-3 py-4">
                    <div className="col-md-4   wow animate__animated animate__bounceIn"  >
                        <div className={` ${style.caption} rounded-4 border border-1 border-muted py-2`}>
                            <h4 className="my-4 title">ﻛﻮرﺳﺎت ﻣﻤﻴﺰة </h4>
                            <img src={feature1} className={` py-3 ${style.feature}  `} alt="" />
                            <p className="p-2 subTitle text-muted ">
                                نعمل جاهدين على توفير كافة المواد على المنصة ومن أكثر من مدرس
                                لتتمكنوا من حضور الدرس مع المدرس المفضل لديكم
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4  wow animate__animated animate__bounceIn"  >
                        <div className={` ${style.caption} rounded-4 border border-1 border-muted py-2`}>
                            <h4 className="my-4 title ">ﻓﻴﺪﻳﻮﻫﺎت ﻋﺎﻟﻴﺔ اﻟﺠﻮدة
                            </h4>
                            <img src={feature2} className={` py-3 ${style.feature} `} alt="" />
                            <p className="p-2 subTitle text-muted ">
                                نعمل على إنتاج محتوى عالي الجودة في استديوهاتنا المتخصصة لأجل
                                ضمان عملية تعليمية مريحة خالية من الشوائب
                            </p>
                            <br />
                        </div>
                    </div>
                    <div className="col-md-4  wow animate__animated animate__bounceIn"  >
                        <div className={` ${style.caption} rounded-4 border border-1 border-muted py-2`}>
                            <h4 className="my-4 title ">اﺧﺘﺒﺎرات و واﺟﺒﺎت                </h4>
                            <img src={feature3} className={` py-3 ${style.feature}`} alt="" />
                            <p className="p-2 subTitle text-muted">
                                يتم تصميم الأسئلة والواجبات بعناية لضمان المستوى التعليمي لأبنائنا من الطلاب
                            </p>
                            <br />
                            <br />
                        </div>
                    </div>
                    <div className="col-md-4  wow animate__animated animate__bounceIn"  >
                        <div className={` ${style.caption} rounded-4 border border-1 border-muted py-2`}>
                            <h4 className="my-4 title ">ﺑﻨﻚ اﺳﺄﻟﺔ
                            </h4>
                            <img src={feature4} className={` py-3 ${style.feature}`} alt="" />
                            <p className="p-2 subTitle text-muted">
                                لن تحتاج إلى أي من الكتب الخارجية, لاننا نقوم بتحديث بنك الاسئلة الخاص بنا دوريا بالتعاون مع نخبة من أكبر مدرسين المواد في الجمهورية
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4  wow animate__animated animate__bounceIn"  >
                        <div className={` ${style.caption} rounded-4 border border-1 border-muted py-2`}>
                            <h4 className="my-4 title ">ﺗﻘﻴﻴﻢ ﻣﺴﺘﻤﺮ
                            </h4>
                            <img src={feature5} className={` py-3 ${style.feature}`} alt="" />
                            <p className="p-2 subTitle text-muted mt-4">
                                هدفنا طمانتكم ولذلك يقوم فريق كامل من المساعدين بمتابعة مستوى أبنائنا مع أولياء الأمور
                            </p>
                            <br />
                            <br />
                        </div>
                    </div>
                    <div className="col-md-4  wow animate__animated animate__bounceIn"  >
                        <div className={` ${style.caption} rounded-4 border border-1 border-muted py-2`}>
                            <h4 className="my-4 title ">تفاعلات                </h4>
                            <img src={feature6} className={` py-3 ${style.feature}`} alt="" />
                            <p className="p-2 subTitle text-muted">
                                ابنائنا الطلبة, يهمنا رايكم ولذلك يمكنكم ارسال ارائكم واستفساراتكم على أي جزء خاص في المنصة سواء كان على الواجبات والامتحانات أو حتى عن المنصة
                            </p>
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
}