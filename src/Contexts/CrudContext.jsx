import axios from "axios";
import { createContext } from "react";
import Cookies from "js-cookie";
export const CrudContext = createContext(null);
export default function CrudContextProvide(props) {
    const baseUrl = `https://education-platform-vert-two.vercel.app`;
    async function getAll(endPoint) {
        const { data } = await axios.get(`${baseUrl}/${endPoint}`)
        return data;
    }
    async function addItem(endPoint, id, formData) {
        const response = await axios.post(`${baseUrl}/${endPoint}${id}`, formData, {
            headers: {
                "token": `online__${Cookies.get('token')}`
            }
        })
        return response;

    }
    async function updateItem(endPoint, id, formData) {
        const response = await axios.put(`${baseUrl}/${endPoint}${id}`, formData, {
            headers: {
                "token": `online__${Cookies.get('token')}`
            }
        })
        return response;

    }
    async function getById(endPoint, id) {
        const { data } = await axios.get(`${baseUrl}/${endPoint}${id}`);
        return data;
    }
    async function deleteItem(endPoint, id) {
        await axios.delete(`${baseUrl}/${endPoint}${id}`, {
            headers: {
                token: `online__${Cookies.get("token")}`,
            },
        })
    }
    return <CrudContext.Provider value={{ getAll, getById, addItem, updateItem, deleteItem, baseUrl }}>
        {props.children}
    </CrudContext.Provider>
}