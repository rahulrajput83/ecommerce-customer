import { postRequest } from "./Requests"

export const addToCart = async (item) => {
    try {
        const value = {...item, quantity: 1}
        const data = await postRequest('/api/addToCart', value)
        
        return data;
    } catch (error) {
        if(error.message) {
            return { message: error.message }
        }
        return { message: 'Error, please try again', error: error }
    }
}