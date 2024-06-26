import MongoDBConnect from "@/Utils/MongoDB"
import JWTAuth from "@/Utils/JWTAuth"
import CartModel from "@/Model/Cart"


const handler = async (req, res) => {
    if (req.method !== 'PUT') {
        res.status(400).json({ message: 'Only PUT requests allowed.' })
    }
    try {
        await MongoDBConnect();
        const { field, data } = req.body;
        const { id, currentQuantity } = data;
        let quantity = currentQuantity;
        if (field === 'minus') {
            if (currentQuantity > 1) {
                quantity--;
            }
        }
        else {
            quantity++
        }
        await CartModel.updateOne({ _id: id }, { $set: { 'product.quantity': quantity } });
        res.json({ message: 'Success', value: 'Success' })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error, please try again...', error: error })
    }
}


export default JWTAuth(handler);