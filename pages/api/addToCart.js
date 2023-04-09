import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import JWTAuth from "@/Utils/JWTAuth"
import CartModel from "@/Model/Cart"


const handler = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(400).json({ message: 'Only POST requests allowed.' })
    }
    try {
        await MongoDBConnect();
        const productId = req.body.data.id;
        const { id } = req.user;
        const findProduct = await CartModel.findOne({ productId: productId, userId: id, paid: false });
        if (findProduct !== null && findProduct !== undefined && Object.keys(findProduct).length >= 1) {
            let ciphertext = await CryptoJS.AES.encrypt(JSON.stringify({ message: "Already" }), process.env.JWT).toString();
            res.json({ message: 'Success', value: ciphertext })
        }
        else {
            const newCart = new CartModel({
                product: req.body.data,
                productId: productId,
                userId: id,
                paid: false
            })
            await newCart.save()
            let ciphertext = await CryptoJS.AES.encrypt(JSON.stringify({ message: "Saved" }), process.env.JWT).toString();
            res.json({ message: 'Success', value: ciphertext })
        }

    } catch (error) {
        res.status(400).json({ message: 'Error, please try again...', error: error })
    }
}


export default JWTAuth(handler);