import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import ProductModel from "@/Model/Products";


const handler = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(400).json({ message: 'Only GET requests allowed.' })
    }
    try {
        await MongoDBConnect();
        let data = await ProductModel.findOne({_id: req.query.id})
        if (data.title) {
            let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.JWT).toString();
            res.status(200).json({ message: 'Success', value: ciphertext })
        }
        else {
            res.status(400).json({ message: 'Error, please try again...' })
        }
    } catch (error) {
        res.status(400).json({ message: 'Error, please try again...' })
    }
}


export default handler;