import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import RegisterModel from "@/Model/User";


const handler = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(400).json({ message: 'Only POST requests allowed.' })
    }
    try {
        await MongoDBConnect();
        const {data} = JSON.parse(req.body)
        const response = await RegisterModel.findOne({ _id: data });
        const user = {
            displayName: response.displayName,
            fullName: response.fullName,
            type: response.type,
            data: 'ftgdyhu'
        }
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ user: user }), process.env.JWT).toString();
        res.status(200).json({ message: 'Success', value: ciphertext })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error, please try again...' })
    }
}


export default handler;