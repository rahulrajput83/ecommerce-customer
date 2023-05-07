import MongoDBConnect from "@/Utils/MongoDB"
import JWTAuth from "@/Utils/JWTAuth"
import CartModel from "@/Model/Cart"


const handler = async (req, res) => {
    if (req.method !== 'PUT') {
        res.status(400).json({ message: 'Only PUT requests allowed.' })
    }
    try {
        await MongoDBConnect();
        const { id, } = req.body;
        await CartModel.deleteOne({ _id: id });
        res.json({ message: 'Success' })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error, please try again...', error: error })
    }
}


export default JWTAuth(handler);