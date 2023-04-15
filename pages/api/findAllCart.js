import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import JWTAuth from "@/Utils/JWTAuth"
import CartModel from "@/Model/Cart"


const handler = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(400).json({ message: 'Only GET requests allowed.' })
    }
    try {
        await MongoDBConnect();
        const { id } = req.user;
        const findProduct = await CartModel.find({ userId: id, paid: false });
        if (findProduct.length > 0) {
            let ciphertext = await CryptoJS.AES.encrypt(JSON.stringify(findProduct), process.env.JWT).toString();
            res.json({ message: 'Success', value: ciphertext })
        }
        else {
            let ciphertext = await CryptoJS.AES.encrypt(JSON.stringify({ message: "Empty" }), process.env.JWT).toString();
            res.json({ message: 'Success', value: ciphertext })
        }

    } catch (error) {
        res.status(400).json({ message: 'Error, please try again...', })
    }
}


export default JWTAuth(handler);