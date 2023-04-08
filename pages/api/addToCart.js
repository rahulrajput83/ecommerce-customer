import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import JWTAuth from "@/Utils/JWTAuth"
import CartModel from "@/Model/Cart"


const handler = async (req, res) => {
    if (req.method !== 'POST') {
        res.json({ message: 'Only POST requests allowed.' })
    }
    try {
        await MongoDBConnect();
        const productId = req.body.data.id;
        const { id } = req.user;
        const findProduct = await CartModel.findOne({ productId: productId, userId: id });
        if (findProduct !== null && findProduct !== undefined && Object.keys(findProduct).length >= 1) {
            res.json({ message: 'Already' })
        }
        else {
            const newCart = new CartModel({
                product: req.body.data,
                productId: productId,
                userId: id,
            })
            await newCart.save()
            res.json({ message: 'Saved' })
        }

    } catch (error) {
        res.json({ message: 'Error, please try again...', error: error })
    }
}


export default JWTAuth(handler);