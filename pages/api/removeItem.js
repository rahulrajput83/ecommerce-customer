import MongoDBConnect from "@/Utils/MongoDB"
import JWTAuth from "@/Utils/JWTAuth"
import CartModel from "@/Model/Cart"


const handler = async (req, res) => {
    if (req.method !== 'PUT') {
        res.json({ message: 'Only PUT requests allowed.' })
    }
    try {
        await MongoDBConnect();
        const { id, } = req.body;
        await CartModel.deleteOne({ _id: id });
        res.json({ message: 'Success' })

    } catch (error) {
        res.json({ message: 'Error, please try again...', error: error })
    }
}


export default JWTAuth(handler);