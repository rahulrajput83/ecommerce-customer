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
            console.log(response)
            let data = response.data.value
            let bytes = CryptoJS.AES.decrypt(data, process.env.JWT);
            console.log('hello', bytes)
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
        return response.data;
    } catch (error) {
        console.log(error)
        return { message: error }
    }
}