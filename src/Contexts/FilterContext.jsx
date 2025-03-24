import axios from "axios";
import { createContext, useEffect, useState } from "react"
export let FilterContext = createContext(0)
export default function FilterContextProvide(props) {
    const [wordSearch, setWordSearch] = useState('');
    const [stageFilter, setStage] = useState('');
    const [gradeFilter, setGrade] = useState('');
    const [filterCourses, setFilterCourses] = useState([]);
    const [gradeFilterName, setGradeName] = useState('');
    const [stageName, setStageName] = useState('');
    const [error, setError] = useState('');
    const baseURL = 'https://education-platform-vert-two.vercel.app';
    async function search() {
        try {
            let queryParams = [];
            if (wordSearch) queryParams.push(`search=${wordSearch}`);
            if (stageFilter) queryParams.push(`subCategoryId=${stageFilter}`);
            if (gradeFilter) queryParams.push(`categoryId=${gradeFilter}`);
            const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
            const { data } = await axios.get(`${baseURL}/course${queryString}`);
            setFilterCourses(data.data);
        } catch (error) {
            setError(error.message);
        }
    }
    useEffect(() => {
        search();
    }, [gradeFilter, stageFilter, wordSearch])
    return <FilterContext.Provider value={{ wordSearch, setWordSearch, stageFilter, setStage, gradeFilter, setGrade, filterCourses, error, gradeFilterName, setGradeName, stageName, setStageName }}>
        {props.children}
    </FilterContext.Provider>
}