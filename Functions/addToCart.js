import { postRequest } from "./Requests"

export const addToCart = async (value) => {
    try {
        const data = await postRequest('/api/addToCart', value)
        return data;
    } catch (error) {
        { message: 'Error, please try again' }
    }
}