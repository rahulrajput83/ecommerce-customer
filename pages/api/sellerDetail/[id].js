import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import RegisterModel from "@/Model/User";
import ProductModel from "@/Model/Products";


const handler = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(400).json({ message: 'Only GET requests allowed.' })
    }
    try {
        await MongoDBConnect();
        let data = await RegisterModel.findOne({ _id: req.query.id });
        const product = await ProductModel.find({sellerId: req.query.id});
        data = JSON.stringify(data)
        data = JSON.parse(data)
        const user = {
            fullName: data.fullName,
            displayName: data.displayName,
            address: data.address,
            products: product
        }
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ user: user }), process.env.JWT).toString();
        res.status(200).json({ message: 'Success', value: ciphertext })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error, please try again...' })
    }
}


export default handler;