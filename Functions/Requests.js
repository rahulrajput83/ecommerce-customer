import { getToken } from "./getToken"
import axios from "axios";
const CryptoJS = require("crypto-js")


axios.interceptors.request.use(function (config) {
    config.headers.token = getToken();
    return config;
}, null, { synchronous: true });

export const getRequest = async (path) => {
    try {
        const response = await axios.get(path);
        if (response.data.message === 'Success') {
            let bytes = CryptoJS.AES.decrypt(response.data.value, process.env.JWT);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
        return response.data;
    } catch (error) {
        return { message: 'Error, please try again' }
    }
}

export const putRequest = async (path, field, data) => {
    try {
        const response = await axios.put(path, { field, data });
        return response.data;
    } catch (error) {
        return { message: 'Error, please try again' }
    }
}

export const postRequest = async (path, data) => {
    try {
        const response = await axios.post(path, { data });
        if (response.data.message === 'Success') {
            let bytes = CryptoJS.AES.decrypt(response.data.value, process.env.JWT);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
        return response.data;
    } catch (error) {
        return { message: error.response.data.message || 'Error, please try again', error: error }
    }
}
 
export const deleteRequest = async (path, id) => {
    try {
        const response = await axios.put(path, { id });
        return response
    } catch (error) {
        return { message: 'Error, please try again' }
    }
}