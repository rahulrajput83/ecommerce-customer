import { postRequest } from "./Requests"

export const addToCart = async (item) => {
    try {
        const value = {...item, quantity: 1}
        const data = await postRequest('/api/addToCart', value)
        return data;
    } catch (error) {
        return { message: 'Error, please try again', error: error }
    }
}