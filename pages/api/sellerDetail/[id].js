import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import JWTAuth from "/Utils/JWTAuth"
import RegisterModel from "@/Model/User";
import ProductModel from "@/Model/Products";


const handler = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(400).json({ message: 'Only GET requests allowed.' })
    }
    try {
        await MongoDBConnect();
        const data = await RegisterModel.findOne({ _id: req.query.id });
        const product = await ProductModel.find({sellerId: req.query.id});
        const { displayName, fullName } = data
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ user: {displayName, fullName} }), process.env.JWT).toString();
        res.status(200).json({ message: 'Success', value: ciphertext })
    } catch (error) {
        res.status(400).json({ message: 'Error, please try again...' })
    }
}


export default JWTAuth(handler);