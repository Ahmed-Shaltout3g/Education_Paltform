import { createContext } from "react";
export const SharedDataContext = createContext(null);
export default function SharedDataContextProvide(props) {
    const baseURL = `https://education-platform-vert-two.vercel.app`;
    const stage = { first: "الصف الاول", second: " الصف الثاني", third: "الصف الثالث", fourth: "الصف الرابع", fifth: "الصف الخامس", sixth: "الصف السادس" };
    const grade = { primary: "الابتدائي", preparatory: "الاعدادي ", secondary: "الثانوي" };
    const arr = [1, 2, 3, 4]
    return <SharedDataContext.Provider value={{ stage, grade, arr , baseURL}}>
        {props.children}
    </SharedDataContext.Provider>
}